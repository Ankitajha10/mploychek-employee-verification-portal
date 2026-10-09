import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper py-3">
      <!-- Loading Text Indicator -->
      <div class="d-flex align-items-center mb-3 text-muted">
        <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
        <span class="small fw-semibold">{{ message }}</span>
      </div>

      <!-- Table Skeleton -->
      <div *ngIf="type === 'table'" class="table-responsive">
        <table class="table align-middle">
          <thead>
            <tr>
              <th *ngFor="let col of getArray(columns)">
                <div class="skeleton-box skeleton-header"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of getArray(rows)">
              <td *ngFor="let col of getArray(columns)">
                <div class="skeleton-box skeleton-cell"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card Skeleton -->
      <div *ngIf="type === 'cards'" class="row g-3">
        <div *ngFor="let card of getArray(rows)" class="col-md-4 col-sm-6">
          <div class="card p-3 border-0 shadow-sm">
            <div class="skeleton-box w-50 mb-2" style="height: 14px;"></div>
            <div class="skeleton-box w-75 mb-3" style="height: 24px;"></div>
            <div class="skeleton-box w-100" style="height: 12px;"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .skeleton-box {
        background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 4px;
      }
      .skeleton-header {
        height: 18px;
        width: 80%;
      }
      .skeleton-cell {
        height: 16px;
        width: 90%;
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `
  ]
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'cards' = 'table';
  @Input() rows: number = 5;
  @Input() columns: number = 6;
  @Input() message: string = 'Fetching data from server...';

  public getArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
