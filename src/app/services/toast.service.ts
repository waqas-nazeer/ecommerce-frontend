import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  delayMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private idCounter = 1;

  show(type: ToastType, message: string, delayMs: number = 3000): void {
    const id = this.idCounter++;
    const toast: ToastMessage = { id, type, message, delayMs };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);
    if (delayMs > 0) {
      setTimeout(() => this.dismiss(id), delayMs);
    }
  }

  success(message: string, delayMs: number = 2500) {
    this.show('success', message, delayMs);
  }

  error(message: string, delayMs: number = 3500) {
    this.show('error', message, delayMs);
  }

  info(message: string, delayMs: number = 3000) {
    this.show('info', message, delayMs);
  }

  warning(message: string, delayMs: number = 3000) {
    this.show('warning', message, delayMs);
  }

  dismiss(id: number) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }
}


