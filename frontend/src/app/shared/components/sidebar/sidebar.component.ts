import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sidebar bg-white border-end d-flex flex-column" *ngIf="currentUser$ | async as user">
      <!-- Portal User Header -->
      <div class="p-3 border-bottom bg-light bg-opacity-50">
        <div class="d-flex align-items-center">
          <div class="user-avatar-sm me-2 d-flex align-items-center justify-content-center text-primary fw-bold">
            {{ user.name.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <h6 class="mb-0 text-truncate fw-bold text-dark fs-6">{{ user.name }}</h6>
            <span class="text-muted text-truncate d-block small" style="font-size: 0.75rem;">
              {{ user.email }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="p-2 flex-grow-1">
        <!-- ADMIN NAVIGATION -->
        <div *ngIf="user.role === 'ADMIN'">
          <div class="nav-section-title px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small">
            Admin Management
          </div>

          <ul class="nav nav-pills flex-column gap-1 mb-3">
            <li class="nav-item">
              <a
                class="nav-link d-flex align-items-center"
                routerLink="/admin/dashboard"
                routerLinkActive="active"
              >
                <i class="bi bi-grid-1x2-fill me-2 fs-6"></i>
                <span>Admin Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link d-flex align-items-center"
                routerLink="/admin/users"
                routerLinkActive="active"
              >
                <i class="bi bi-people-fill me-2 fs-6"></i>
                <span>User Management</span>
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link d-flex align-items-center"
                routerLink="/admin/records"
                routerLinkActive="active"
              >
                <i class="bi bi-file-earmark-check-fill me-2 fs-6"></i>
                <span>Employment Records</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- GENERAL USER NAVIGATION -->
        <div *ngIf="user.role === 'GENERAL_USER'">
          <div class="nav-section-title px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small">
            Employee Portal
          </div>

          <ul class="nav nav-pills flex-column gap-1 mb-3">
            <li class="nav-item">
              <a
                class="nav-link d-flex align-items-center"
                routerLink="/user-dashboard"
                routerLinkActive="active"
              >
                <i class="bi bi-speedometer2 me-2 fs-6"></i>
                <span>My Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link d-flex align-items-center"
                routerLink="/my-records"
                routerLinkActive="active"
              >
                <i class="bi bi-briefcase-fill me-2 fs-6"></i>
                <span>Employment History</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- SHARED PROFILE SECTION -->
        <div class="nav-section-title px-3 pt-2 pb-1 text-uppercase text-muted fw-bold small">
          Account
        </div>
        <ul class="nav nav-pills flex-column gap-1">
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center"
              [routerLink]="user.role === 'ADMIN' ? '/admin/dashboard' : '/user-dashboard'"
              [fragment]="'profile-section'"
            >
              <i class="bi bi-person-badge-fill me-2 fs-6"></i>
              <span>Profile Summary</span>
            </a>
          </li>
          <li class="nav-item">
            <button
              class="nav-link text-danger d-flex align-items-center w-100 text-start border-0 bg-transparent"
              (click)="logout()"
            >
              <i class="bi bi-box-arrow-right me-2 fs-6"></i>
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Footer Info -->
      <div class="p-3 border-top mt-auto bg-light bg-opacity-25 small text-muted text-center" style="font-size: 0.72rem;">
        <div>MPloyChek Platform v1.0</div>
        <div class="text-secondary opacity-75">Candidate Assessment</div>
      </div>
    </nav>
  `,
  styles: [
    `
      .sidebar {
        width: 250px;
        min-height: calc(100vh - 61px);
      }
      .user-avatar-sm {
        width: 34px;
        height: 34px;
        background-color: #dbeafe;
        border-radius: 8px;
        font-size: 0.9rem;
      }
      .nav-section-title {
        font-size: 0.7rem;
        letter-spacing: 0.5px;
      }
      .nav-link {
        color: #475569;
        font-weight: 500;
        padding: 0.65rem 1rem;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      .nav-link:hover {
        background-color: #f1f5f9;
        color: #0f172a;
      }
      .nav-link.active {
        background-color: #2563eb;
        color: #ffffff;
      }
      .nav-link.active i {
        color: #ffffff;
      }
    `
  ]
})
export class SidebarComponent {
  public currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  public logout(): void {
    this.authService.logout();
  }
}
