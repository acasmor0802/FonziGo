import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, ToastMessage } from './toast.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit toasts via observable', () => {
    return new Promise<void>((resolve) => {
      let emittedToasts: ToastMessage[] = [];
      
      service.toasts$.subscribe(toasts => {
        emittedToasts = toasts;
      });

      service.success('Test Title');

      setTimeout(() => {
        expect(emittedToasts.length).toBe(1);
        expect(emittedToasts[0].type).toBe('success');
        expect(emittedToasts[0].title).toBe('Test Title');
        resolve();
      }, 0);
    });
  });

  it('should create success toast', () => {
    return new Promise<void>((resolve) => {
      service.toasts$.subscribe(toasts => {
        if (toasts.length > 0) {
          expect(toasts[0].type).toBe('success');
          resolve();
        }
      });

      service.success('Success message');
    });
  });

  it('should create error toast', () => {
    return new Promise<void>((resolve) => {
      service.toasts$.subscribe(toasts => {
        if (toasts.length > 0) {
          expect(toasts[0].type).toBe('error');
          resolve();
        }
      });

      service.error('Error message');
    });
  });

  it('should create info toast', () => {
    return new Promise<void>((resolve) => {
      service.toasts$.subscribe(toasts => {
        if (toasts.length > 0) {
          expect(toasts[0].type).toBe('info');
          resolve();
        }
      });

      service.info('Info message');
    });
  });

  it('should create warning toast', () => {
    return new Promise<void>((resolve) => {
      service.toasts$.subscribe(toasts => {
        if (toasts.length > 0) {
          expect(toasts[0].type).toBe('warning');
          resolve();
        }
      });

      service.warning('Warning message');
    });
  });

  it('should include optional message', () => {
    return new Promise<void>((resolve) => {
      service.toasts$.subscribe(toasts => {
        if (toasts.length > 0) {
          expect(toasts[0].message).toBe('Additional info');
          resolve();
        }
      });

      service.success('Title', 'Additional info');
    });
  });

  it('should dismiss toast by id', fakeAsync(() => {
    let currentToasts: ToastMessage[] = [];
    
    service.toasts$.subscribe(toasts => {
      currentToasts = toasts;
    });

    service.success('Test', undefined, 10000); // Long duration
    tick(0);
    
    const toastId = currentToasts[0]?.id;
    expect(currentToasts.length).toBe(1);
    
    service.dismiss(toastId);
    tick(0);
    
    expect(currentToasts.length).toBe(0);
  }));

  it('should auto-dismiss toast after duration', fakeAsync(() => {
    let currentToasts: ToastMessage[] = [];
    
    service.toasts$.subscribe(toasts => {
      currentToasts = toasts;
    });

    service.success('Auto dismiss', undefined, 1000);
    tick(0);
    expect(currentToasts.length).toBe(1);
    
    tick(1100); // Wait for auto-dismiss
    expect(currentToasts.length).toBe(0);
  }));
});
