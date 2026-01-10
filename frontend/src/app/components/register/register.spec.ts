import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('phone')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('provincia')?.value).toBe('');
    expect(component.registerForm.get('acceptTerms')?.value).toBe(false);
  });

  it('should have invalid form initially', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should validate email as required', () => {
    const email = component.registerForm.get('email');
    expect(email?.hasError('required')).toBe(true);
    
    email?.setValue('invalid');
    expect(email?.hasError('email')).toBe(true);
    
    email?.setValue('valid@email.com');
    expect(email?.hasError('required')).toBe(false);
    expect(email?.hasError('email')).toBe(false);
  });

  it('should validate password minimum length', () => {
    const password = component.registerForm.get('password');
    password?.setValue('short');
    expect(password?.hasError('minlength')).toBe(true);
    
    password?.setValue('LongEnough123!');
    expect(password?.hasError('minlength')).toBe(false);
  });

  it('should validate password match', () => {
    component.registerForm.get('password')?.setValue('Password123!');
    component.registerForm.get('confirmPassword')?.setValue('DifferentPassword123!');
    
    expect(component.registerForm.hasError('passwordMismatch')).toBe(true);
    
    component.registerForm.get('confirmPassword')?.setValue('Password123!');
    expect(component.registerForm.hasError('passwordMismatch')).toBe(false);
  });

  it('should require terms acceptance', () => {
    const acceptTerms = component.registerForm.get('acceptTerms');
    expect(acceptTerms?.hasError('required')).toBe(true);
    
    acceptTerms?.setValue(true);
    expect(acceptTerms?.hasError('required')).toBe(false);
  });

  it('should have country options for Andalucía provinces', () => {
    expect(component.countryOptions.length).toBe(8);
    expect(component.countryOptions.some(o => o.label === 'Sevilla')).toBe(true);
    expect(component.countryOptions.some(o => o.label === 'Málaga')).toBe(true);
  });

  it('should have loading signal initialized to false', () => {
    expect(component.loading()).toBe(false);
  });

  it('should have submitted signal initialized to false', () => {
    expect(component.submitted()).toBe(false);
  });

  it('should return error messages for touched controls', () => {
    const email = component.registerForm.get('email');
    email?.markAsTouched();
    
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('Este campo es obligatorio');
  });

  it('should return empty string for untouched controls', () => {
    const errorMessage = component.getErrorMessage('email');
    expect(errorMessage).toBe('');
  });
});
