import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar navbar-expand-lg bg-white border-bottom sticky-top py-2 px-3 px-md-4 shadow-sm">
      <div class="container-fluid p-0">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center fw-bold text-dark m-0" routerLink="/">
          <div class="brand-badge me-2 d-flex align-items-center justify-content-center text-white">
            <i class="bi bi-shield-check fs-5"></i>
          </div>
          <div>
            <span class="brand-text">MPloy<span class="text-primary">Chek</span></span>
            <span class="badge bg-light text-secondary border ms-2 d-none d-sm-inline fw-normal" style="font-size: 0.72rem;">
              Verification Portal
            </span>
          </div>
        </a>

        <!-- Right Side: User Details & Logout -->
        <div class="d-flex align-items-center ms-auto" *ngIf="currentUser$ | async as user">
          <!-- Role & Department Info -->
          <div class="d-none d-md-flex flex-column text-end me-3">
            <span class="fw-semibold text-dark small">{{ user.name }}</span>
            <div class="d-flex align-items-center justify-content-end gap-1">
              <span
                class="badge"
                [ngClass]="user.role === 'ADMIN' ? 'bg-indigo text-white' : 'bg-primary-subtle text-primary border border-primary-subtle'"
                style="font-size: 0.7rem;"
              >
                {{ user.role === 'ADMIN' ? 'ADMINISTRATOR' : 'GENERAL USER' }}
              </span>
              <span class="text-muted" style="font-size: 0.7rem;">• {{ user.department }}</span>
            </div>
          </div>

          <!-- User Avatar Icon -->
          <div class="avatar-circle me-3 d-flex align-items-center justify-content-center fw-bold">
            {{ user.name.charAt(0) }}
          </div>

          <!-- Logout Button -->
          <button
            type="button"
            class="btn btn-outline-danger btn-sm d-flex align-items-center px-2 px-md-3"
            (click)="logout()"
            title="Sign out of portal"
          >
            <i class="bi bi-box-arrow-right me-1"></i>
            <span class="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .brand-badge {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
      }
      .brand-text {
        font-size: 1.25rem;
        letter-spacing: -0.5px;
      }
      .avatar-circle {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: #e0e7ff;
        color: #3730a3;
        font-size: 0.95rem;
      }
      .bg-indigo {
        background-color: #4338ca;
      }
    `
  ]
})
export class NavbarComponent {
  public currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  public logout(): void {
    this.authService.logout();
  }
}
