import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1090;">
      <div
        *ngFor="let toast of toasts$ | async"
        class="toast show shadow-lg border-0 mb-2 custom-toast"
        [ngClass]="'toast-' + toast.type"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header bg-transparent text-white border-bottom-0 pb-0">
          <i
            class="bi me-2"
            [ngClass]="{
              'bi-check-circle-fill': toast.type === 'success',
              'bi-exclamation-triangle-fill': toast.type === 'danger',
              'bi-exclamation-circle-fill': toast.type === 'warning',
              'bi-info-circle-fill': toast.type === 'info'
            }"
          ></i>
          <strong class="me-auto text-white">{{ toast.title || 'Notification' }}</strong>
          <button
            type="button"
            class="btn-close btn-close-white"
            (click)="toastService.remove(toast.id)"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body text-white pt-1">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .custom-toast {
        min-width: 300px;
        max-width: 420px;
        border-radius: 8px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .toast-success {
        background-color: #059669;
      }
      .toast-danger {
        background-color: #dc2626;
      }
      .toast-warning {
        background-color: #d97706;
      }
      .toast-info {
        background-color: #2563eb;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
  ]
})
export class ToastComponent {
  public toasts$: Observable<ToastMessage[]>;

  constructor(public toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }
}
