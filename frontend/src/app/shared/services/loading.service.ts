import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log('LoadingService inicializado');
  }

  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
      console.log('Loading activado (peticiones activas:', this.requestCount, ')');
    }
  }

  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
      console.log('Loading desactivado (peticiones activas:', this.requestCount, ')');
    }
  }

  // Para uso manual
  setLoading(loading: boolean): void {
    if (loading) {
      this.show();
    } else {
      this.hide();
    }
  }

  getLoadingState(): boolean {
    return this.loadingSubject.value;
  }

  // Reset en caso de error
  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    console.log('LoadingService reset');
  }
}
