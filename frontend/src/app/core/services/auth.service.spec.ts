import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER' as const
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start logged out when no token in storage', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should have default userName as "Usuario" when not logged in', () => {
    expect(service.userName()).toBe('Usuario');
  });

  it('should return undefined for userEmail when not logged in', () => {
    expect(service.userEmail()).toBeUndefined();
  });

  it('should not be admin when not logged in', () => {
    expect(service.isAdmin()).toBe(false);
  });

  it('should return null from getToken when no token stored', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return token from getToken when stored', () => {
    localStorage.setItem('auth_token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should update user state with updateUser', () => {
    service.updateUser(mockUser);
    
    expect(service.currentUser()).toEqual(mockUser);
    expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser));
  });

  it('should clear session on logout', () => {
    // Setup logged in state
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    service.updateUser(mockUser);
    
    // Logout
    service.logout();
    
    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('should compute isAdmin correctly for admin user', () => {
    const adminUser = { ...mockUser, role: 'ADMIN' as const };
    service.updateUser(adminUser);
    
    expect(service.isAdmin()).toBe(true);
  });

  it('should compute isAdmin correctly for regular user', () => {
    service.updateUser(mockUser);
    
    expect(service.isAdmin()).toBe(false);
  });

  it('should compute userName from currentUser', () => {
    service.updateUser(mockUser);
    
    expect(service.userName()).toBe('Test User');
  });

  it('should compute userEmail from currentUser', () => {
    service.updateUser(mockUser);
    
    expect(service.userEmail()).toBe('test@example.com');
  });
});
