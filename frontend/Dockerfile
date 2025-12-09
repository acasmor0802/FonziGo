FROM node:20-alpine AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend . .

RUN npm run build

# Stage 2: Servir con nginx
FROM nginx:alpine

COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
