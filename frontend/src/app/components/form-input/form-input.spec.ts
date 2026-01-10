import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInput } from './form-input';
import { describe, it, expect, beforeEach } from 'vitest';

describe('FormInput', () => {
  let component: FormInput;
  let fixture: ComponentFixture<FormInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInput, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInput);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as text', () => {
    expect(component.type).toBe('text');
  });

  it('should accept label input', () => {
    component.label = 'Test Label';
    fixture.detectChanges();
    expect(component.label).toBe('Test Label');
  });

  it('should show required state', () => {
    component.control = new FormControl('', Validators.required);
    component.required = true;
    fixture.detectChanges();
    expect(component.required).toBe(true);
  });

  it('should support different input types', () => {
    component.type = 'email';
    fixture.detectChanges();
    expect(component.type).toBe('email');

    component.type = 'password';
    fixture.detectChanges();
    expect(component.type).toBe('password');
  });
});
