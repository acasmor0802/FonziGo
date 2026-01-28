#!/bin/bash
# ==============================================================================
# FonziGo - Health Check Script
# Run this to check the health of all services
# Usage: ./health-check.sh
# ==============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${BLUE}  $1${NC}"
}

log_success() {
    echo -e "${GREEN} $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}  $1${NC}"
}

log_error() {
    echo -e "${RED} $1${NC}"
}

echo ""
echo " FonziGo Health Check"
echo "======================="
echo ""

# Function to check if service is running
check_service() {
    local service_name=$1
    local container_name=$2
    local url=$3
    
    echo -n "Checking $service_name... "
    
    # Check if container exists and is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
        log_error "Container not running"
        return 1
    fi
    
    # Check container health
    local health_status=$(docker inspect --format='{{.State.Health.Status}}' ${container_name} 2>/dev/null || echo "none")
    
    if [ "$health_status" == "healthy" ]; then
        log_success "Healthy"
        
        # Test URL if provided
        if [ -n "$url" ]; then
            if curl -sf -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|204"; then
                echo -n "   Endpoint accessible: $url"
                echo ""
            else
                echo -n "   Endpoint not accessible: $url"
                echo ""
            fi
        fi
        return 0
    elif [ "$health_status" == "starting" ]; then
        log_warn "Starting"
        return 2
    elif [ "$health_status" == "unhealthy" ]; then
        log_error "Unhealthy"
        
        # Show container logs
        echo ""
        log_info "Recent logs from ${container_name}:"
        docker logs --tail=20 ${container_name} 2>&1 | grep -i "error\|exception\|fail" || true
        echo ""
        return 1
    else
        log_warn "No health check (running)"
        
        # Test URL if provided
        if [ -n "$url" ]; then
            if curl -sf -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|204"; then
                echo -n "   Endpoint accessible: $url"
                echo ""
                return 0
            else
                log_error "Endpoint not accessible"
                return 1
            fi
        fi
        return 0
    fi
}

# Function to check system resources
check_system_resources() {
    log_info "System Resources:"
    
    # CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
    echo "  CPU Usage: ${cpu_usage}%"
    
    # Memory usage
    local mem_info=$(free -m | awk 'NR==2{printf "%.1f%% (%.0f MB used / %.0f MB total)", $3*100/$2, $3, $2}')
    echo "  Memory: $mem_info"
    
    # Disk usage
    local disk_usage=$(df -h / | awk 'NR==2{print $5}')
    echo "  Disk Usage: $disk_usage"
    
    # Docker system
    local docker_df=$(docker system df --format "{{.Size}}" | head -1)
    echo "  Docker Data: $docker_df"
    echo ""
}

# Function to check Docker containers
check_docker_containers() {
    log_info "Docker Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
}

# Function to check disk space
check_disk_space() {
    log_info "Disk Space:"
    df -h | grep -E "Filesystem|/dev/"
    echo ""
}

# Function to check Docker volumes
check_volumes() {
    log_info "Docker Volumes:"
    docker volume ls --format "table {{.Name}}\t{{.Driver}}"
    echo ""
}

# Function to check network connectivity
check_network() {
    log_info "Network Connectivity:"
    
    # Check internet connectivity
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        log_success "Internet connectivity: OK"
    else
        log_error "Internet connectivity: FAILED"
    fi
    
    # Check DNS resolution
    if nslookup fonzigo.app > /dev/null 2>&1; then
        log_success "DNS resolution: OK"
    else
        log_error "DNS resolution: FAILED"
    fi
    
    # Check firewall
    if command -v ufw &> /dev/null; then
        echo "  Firewall: $(sudo ufw status | head -1)"
    fi
    echo ""
}

# Function to check SSL certificate
check_ssl() {
    log_info "SSL Certificate:"
    
    if curl -sI https://fonzigo.app 2>&1 | grep -q "SSL certificate"; then
        local cert_info=$(openssl s_client -connect fonzigo.app:443 -servername fonzigo.app </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "Could not get certificate info")
        
        if echo "$cert_info" | grep -q "notAfter="; then
            log_success "SSL certificate is valid"
            echo "  $cert_info" | grep "notAfter="
        else
            log_warn "SSL certificate info not available"
        fi
    else
        log_error "SSL certificate not valid or not obtained"
    fi
    echo ""
}

# Function to check application endpoints
check_application_endpoints() {
    log_info "Application Endpoints:"
    
    local base_url="https://fonzigo.app"
    
    # Check frontend
    echo -n "  Frontend ($base_url)... "
    if curl -sf -o /dev/null -w "%{http_code}" "$base_url" | grep -q "200"; then
        log_success "OK (200)"
    else
        log_error "FAILED"
    fi
    
    # Check health endpoint
    echo -n "  Health ($base_url/health)... "
    if curl -sf -o /dev/null -w "%{http_code}" "$base_url/health" | grep -q "200"; then
        log_success "OK (200)"
    else
        log_error "FAILED"
    fi
    
    # Check API
    echo -n "  API ($base_url/api/actuator/health)... "
    if curl -sf -o /dev/null -w "%{http_code}" "$base_url/api/actuator/health" | grep -q "200"; then
        log_success "OK (200)"
    else
        log_error "FAILED"
    fi
    
    # Check Swagger
    echo -n "  Swagger ($base_url/swagger-ui.html)... "
    if curl -sf -o /dev/null -w "%{http_code}" "$base_url/swagger-ui.html" | grep -q "200\|302"; then
        log_success "OK"
    else
        log_warn "Not accessible (might be disabled)"
    fi
    
    echo ""
}

# Function to check Docker logs for errors
check_logs_for_errors() {
    log_info "Recent Errors in Logs (last hour):"
    
    local containers=("fonzigo-database" "fonzigo-backend" "fonzigo-frontend" "fonzigo-caddy")
    local found_errors=0
    
    for container in "${containers[@]}"; do
        if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            local errors=$(docker logs --since 1h $container 2>&1 | grep -i "error\|exception\|fail" | tail -5)
            if [ -n "$errors" ]; then
                echo "  $container:"
                echo "$errors" | sed 's/^/    /'
                found_errors=1
            fi
        fi
    done
    
    if [ $found_errors -eq 0 ]; then
        log_success "No recent errors found"
    fi
    echo ""
}

# Main execution
echo "Running comprehensive health check..."
echo ""

# Check if docker is available
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed or not in PATH"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed or not in PATH"
    exit 1
fi

# Run all checks
check_network
check_docker_containers
check_volumes
check_disk_space
check_system_resources
check_ssl
check_application_endpoints
check_service "Database" "fonzigo-database" "" || true
check_service "Backend" "fonzigo-backend" "http://localhost:8080/actuator/health" || true
check_service "Frontend" "fonzigo-frontend" "http://localhost:80/" || true
check_service "Caddy" "fonzigo-caddy" "http://localhost/" || true
check_logs_for_errors

# Final summary
echo "======================="
log_success "Health check complete!"
echo ""
echo " Quick status:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo ""
