import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop fade show"></div>
    <div
      *ngIf="isOpen"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-dark d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill text-warning me-2 fs-4"></i>
              {{ title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="onCancel()"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body py-3 text-secondary">
            <p class="mb-0">{{ message }}</p>
          </div>
          <div class="modal-footer border-top-0 pt-0">
            <button
              type="button"
              class="btn btn-outline-secondary px-4"
              (click)="onCancel()"
            >
              Cancel
            </button>
            <button
              type="button"
              [class]="'btn px-4 ' + confirmButtonClass"
              (click)="onConfirm()"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        background-color: rgba(15, 23, 42, 0.6);
      }
      .modal-content {
        border-radius: 12px;
      }
    `
  ]
})
export class ConfirmDialogComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() confirmButtonClass: string = 'btn-danger';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  public onConfirm(): void {
    this.confirmed.emit();
  }

  public onCancel(): void {
    this.cancelled.emit();
  }
}
