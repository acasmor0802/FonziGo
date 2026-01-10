import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Alert } from './alert';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Alert', () => {
  let component: Alert;
  let fixture: ComponentFixture<Alert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert]
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type as info', () => {
    expect(component.type).toBe('info');
  });

  it('should not be closeable by default', () => {
    expect(component.closeable).toBe(false);
  });

  it('should emit closed event when close is called', () => {
    const spy = vi.spyOn(component.closed, 'emit');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should accept different alert types', () => {
    component.type = 'success';
    fixture.detectChanges();
    expect(component.type).toBe('success');

    component.type = 'error';
    fixture.detectChanges();
    expect(component.type).toBe('error');

    component.type = 'warning';
    fixture.detectChanges();
    expect(component.type).toBe('warning');
  });
});
