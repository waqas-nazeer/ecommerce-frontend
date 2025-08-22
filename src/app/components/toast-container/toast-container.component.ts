import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2000;">
      <div *ngFor="let t of toasts" class="toast align-items-center text-bg-{{ mapType(t.type) }} show mb-2" role="alert">
        <div class="d-flex">
          <div class="toast-body">{{ t.message }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" (click)="dismiss(t.id)"></button>
        </div>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  toasts: ToastMessage[] = [];

  constructor(private toast: ToastService) {
    this.toast.toasts$.subscribe(list => {
      this.toasts = list;
    });
  }

  mapType(type: string) {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  dismiss(id: number) {
    this.toast.dismiss(id);
  }
}


