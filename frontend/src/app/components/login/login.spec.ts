import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Login } from './login';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form on init', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.get('rememberMe')).toBeTruthy();
  });

  it('should have email and password as required', () => {
    const email = component.loginForm.get('email');
    const password = component.loginForm.get('password');

    email?.setValue('');
    password?.setValue('');

    expect(email?.hasError('required')).toBe(true);
    expect(password?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const email = component.loginForm.get('email');

    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue('valid@email.com');
    expect(email?.hasError('email')).toBe(false);
  });

  it('should validate password minimum length', () => {
    const password = component.loginForm.get('password');

    password?.setValue('12345');
    expect(password?.hasError('minlength')).toBe(true);

    password?.setValue('123456');
    expect(password?.hasError('minlength')).toBe(false);
  });

  it('should start with submitted as false', () => {
    expect(component.submitted()).toBe(false);
  });

  it('should start with loading as false', () => {
    expect(component.loading()).toBe(false);
  });

  it('should have valid form when all fields are correct', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false
    });

    expect(component.loginForm.valid).toBe(true);
  });

  it('should have invalid form when email is invalid', () => {
    component.loginForm.setValue({
      email: 'invalid',
      password: 'password123',
      rememberMe: false
    });

    expect(component.loginForm.valid).toBe(false);
  });
});
