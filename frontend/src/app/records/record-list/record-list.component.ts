import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecordService } from '../../core/services/record.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { EmploymentRecord, VerificationStatus } from '../../core/models/record.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SkeletonLoaderComponent,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss']
})
export class RecordListComponent implements OnInit {
  public records: EmploymentRecord[] = [];
  public filteredRecords: EmploymentRecord[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';

  public filterStatus: string = '';
  public searchTerm: string = '';
  public selectedDelay: number = 0;

  public isAdmin: boolean = false;

  constructor(
    private recordService: RecordService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadRecords();
  }

  public setDelay(delay: number): void {
    this.selectedDelay = delay;
  }

  public loadRecords(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recordService.getRecords(undefined, this.selectedDelay).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.records = res.data || [];
        this.applyFilters();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load records.';
      }
    });
  }

  public applyFilters(): void {
    let result = [...this.records];

    if (this.filterStatus) {
      result = result.filter((r) => r.verificationStatus === this.filterStatus);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.company.toLowerCase().includes(term) ||
          r.position.toLowerCase().includes(term) ||
          (typeof r.userId === 'object' && r.userId?.name?.toLowerCase().includes(term))
      );
    }

    this.filteredRecords = result;
  }

  public updateRecordStatus(record: EmploymentRecord, newStatus: VerificationStatus): void {
    if (!this.isAdmin || !record._id) return;

    this.recordService.updateRecord(record._id, { verificationStatus: newStatus }).subscribe({
      next: (res) => {
        record.verificationStatus = res.data.verificationStatus;
        this.toastService.success(`Verification status updated to ${newStatus}.`);
        this.applyFilters();
      },
      error: (err) => {
        this.toastService.error(err.error?.message || 'Failed to update status.');
      }
    });
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

  public getUserDisplayName(userRef: any): string {
    if (typeof userRef === 'object' && userRef !== null && userRef.name) {
      return userRef.name;
    }
    return 'Self / Current User';
  }
}
