import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RecordService } from '../../core/services/record.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../core/models/user.model';
import { EmploymentRecord } from '../../core/models/record.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SkeletonLoaderComponent,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  public currentUser: User | null = null;
  public records: EmploymentRecord[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';
  public selectedDelay: number = 0;

  // Verification Summary counts
  public totalRecordsCount: number = 0;
  public verifiedCount: number = 0;
  public pendingCount: number = 0;
  public inReviewCount: number = 0;

  constructor(
    private authService: AuthService,
    private recordService: RecordService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserValue();
    this.loadRecords();
  }

  public setDelay(delayMs: number): void {
    this.selectedDelay = delayMs;
  }

  public loadRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recordService.getRecords(undefined, this.selectedDelay).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.records = response.data || [];
        this.calculateMetrics();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Failed to load employment verification records. Please try again.';
      }
    });
  }

  private calculateMetrics(): void {
    this.totalRecordsCount = this.records.length;
    this.verifiedCount = this.records.filter((r) => r.verificationStatus === 'VERIFIED').length;
    this.pendingCount = this.records.filter((r) => r.verificationStatus === 'PENDING').length;
    this.inReviewCount = this.records.filter((r) => r.verificationStatus === 'IN_REVIEW').length;
  }

  public getStatusBadgeClass(status: string): string {
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

  public getEmploymentTypeLabel(type: string): string {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type;
    }
  }
}
