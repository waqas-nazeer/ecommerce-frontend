import { Injectable } from '@angular/core';
import { promises } from 'dns';
import { resolve } from 'path';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning'| 'confirm';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  delayMs: number;
  resolve? : (result: boolean) => void;
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

   
  confirm(message : string): Promise<boolean>{
     return new Promise<boolean> ((resolve) => {
      const id = this.idCounter++;
      const toast : ToastMessage = {id, type : 'confirm', message, delayMs:0, resolve};
      const current = this.toastsSubject.getValue();
      this.toastsSubject.next([...current, toast]);
     });
  }

  respond(id : number, result : boolean){

    const current = this.toastsSubject.getValue();
    const toast = current.find(t => t.id === id);
 if (toast?.resolve) {
      toast.resolve(result);
    }
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }

  dismiss(id: number) {
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next(current.filter(t => t.id !== id));
  }

}


