import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { UserService } from '../../core/services/user.service';
import { RecordService } from '../../core/services/record.service';
import { DashboardStats } from '../../core/models/stats.model';
import { User } from '../../core/models/user.model';
import { EmploymentRecord } from '../../core/models/record.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SkeletonLoaderComponent,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  public stats: DashboardStats | null = null;
  public recentUsers: User[] = [];
  public recentRecords: EmploymentRecord[] = [];
  public isLoadingStats: boolean = true;
  public isLoadingUsers: boolean = true;
  public errorMessage: string = '';
  public selectedDelay: number = 0;

  constructor(
    public authService: AuthService,
    private statsService: StatsService,
    private userService: UserService,
    private recordService: RecordService
  ) {}

  public ngOnInit(): void {
    this.refreshAll();
  }

  public setDelay(delayMs: number): void {
    this.selectedDelay = delayMs;
  }

  public refreshAll(): void {
    this.loadStats();
    this.loadRecentData();
  }

  public loadStats(): void {
    this.isLoadingStats = true;
    this.errorMessage = '';

    this.statsService.getStats(this.selectedDelay).subscribe({
      next: (res) => {
        this.isLoadingStats = false;
        this.stats = res.data;
      },
      error: (err) => {
        this.isLoadingStats = false;
        this.errorMessage = err.error?.message || 'Failed to load system metrics.';
      }
    });
  }

  public loadRecentData(): void {
    this.isLoadingUsers = true;

    this.userService.getUsers({ delayMs: this.selectedDelay }).subscribe({
      next: (res) => {
        this.isLoadingUsers = false;
        this.recentUsers = (res.data || []).slice(0, 5);
      },
      error: () => {
        this.isLoadingUsers = false;
      }
    });

    this.recordService.getRecords(undefined, this.selectedDelay).subscribe({
      next: (res) => {
        this.recentRecords = (res.data || []).slice(0, 5);
      },
      error: () => {}
    });
  }

  public getStatusBadge(status: string): string {
    switch (status) {
      case 'VERIFIED':
        return 'badge-status-verified';
      case 'PENDING':
        return 'badge-status-pending';
      case 'IN_REVIEW':
        return 'badge-status-review';
      case 'REJECTED':
        return 'badge-status-rejected';
      default:
        return 'bg-secondary';
    }
  }
}
