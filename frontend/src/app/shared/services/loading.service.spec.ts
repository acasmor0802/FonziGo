import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
    // Reset state before each test
    service.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    return new Promise<void>((resolve) => {
      service.isLoading$.subscribe(loading => {
        expect(loading).toBe(false);
        resolve();
      });
    });
  });

  it('should show loading when show() is called', () => {
    service.show();
    expect(service.getLoadingState()).toBe(true);
  });

  it('should hide loading when hide() is called after show()', () => {
    service.show();
    service.hide();
    expect(service.getLoadingState()).toBe(false);
  });

  it('should handle multiple show() calls with reference counting', () => {
    service.show();
    service.show();
    service.show();
    
    expect(service.getLoadingState()).toBe(true);
    
    service.hide();
    expect(service.getLoadingState()).toBe(true); // Still loading
    
    service.hide();
    expect(service.getLoadingState()).toBe(true); // Still loading
    
    service.hide();
    expect(service.getLoadingState()).toBe(false); // Now hidden
  });

  it('should not go below zero on hide()', () => {
    service.hide();
    service.hide();
    service.hide();
    
    expect(service.getLoadingState()).toBe(false);
    
    // Should still work after multiple hides
    service.show();
    expect(service.getLoadingState()).toBe(true);
    
    service.hide();
    expect(service.getLoadingState()).toBe(false);
  });

  it('should set loading directly with setLoading(true)', () => {
    service.setLoading(true);
    expect(service.getLoadingState()).toBe(true);
  });

  it('should set loading directly with setLoading(false)', () => {
    service.show();
    service.setLoading(false);
    expect(service.getLoadingState()).toBe(false);
  });

  it('should reset all state with reset()', () => {
    service.show();
    service.show();
    service.show();
    
    expect(service.getLoadingState()).toBe(true);
    
    service.reset();
    
    expect(service.getLoadingState()).toBe(false);
  });
});
