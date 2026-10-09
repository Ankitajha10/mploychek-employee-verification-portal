import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { User, UserRole, UserStatus } from '../../core/models/user.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SkeletonLoaderComponent,
    ConfirmDialogComponent,
    UserFormModalComponent,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public users: User[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';

  // Filter and search controls
  public searchTerm: string = '';
  public selectedRole: UserRole | '' = '';
  public selectedStatus: UserStatus | '' = '';
  public selectedDelay: number = 0;

  // Modal controls
  public isFormModalOpen: boolean = false;
  public userToEdit: User | null = null;
  public isSubmittingForm: boolean = false;

  // Confirmation dialog controls
  public isConfirmDialogOpen: boolean = false;
  public confirmDialogTitle: string = '';
  public confirmDialogMessage: string = '';
  public userToDeactivate: User | null = null;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.loadUsers();
  }

  public setDelay(delay: number): void {
    this.selectedDelay = delay;
  }

  public loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService
      .getUsers({
        search: this.searchTerm,
        role: this.selectedRole,
        status: this.selectedStatus,
        delayMs: this.selectedDelay
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.users = res.data || [];
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.message || 'Failed to retrieve users. Please verify connection.';
        }
      });
  }

  public onSearchChange(): void {
    this.loadUsers();
  }

  public onFilterChange(): void {
    this.loadUsers();
  }

  public openAddUserModal(): void {
    this.userToEdit = null;
    this.isFormModalOpen = true;
  }

  public openEditUserModal(user: User): void {
    this.userToEdit = user;
    this.isFormModalOpen = true;
  }

  public handleSaveUser(event: { isEdit: boolean; data: any }): void {
    this.isSubmittingForm = true;

    if (event.isEdit && this.userToEdit?._id) {
      this.userService.updateUser(this.userToEdit._id, event.data).subscribe({
        next: (res) => {
          this.isSubmittingForm = false;
          this.isFormModalOpen = false;
          this.toastService.success(`User '${res.data.name}' successfully updated.`);
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmittingForm = false;
          this.toastService.error(err.error?.message || 'Failed to update user.');
        }
      });
    } else {
      this.userService.createUser(event.data).subscribe({
        next: (res) => {
          this.isSubmittingForm = false;
          this.isFormModalOpen = false;
          this.toastService.success(`User '${res.data.name}' successfully provisioned.`);
          this.loadUsers();
        },
        error: (err) => {
          this.isSubmittingForm = false;
          this.toastService.error(err.error?.message || 'Failed to create user.');
        }
      });
    }
  }

  public promptToggleStatus(user: User): void {
    this.userToDeactivate = user;
    const isActivating = user.status === 'INACTIVE';

    this.confirmDialogTitle = isActivating ? 'Activate User Account' : 'Deactivate User Account';
    this.confirmDialogMessage = isActivating
      ? `Are you sure you want to reactivate the account for ${user.name} (${user.username})?`
      : `Are you sure you want to deactivate ${user.name} (${user.username})? They will be unable to log in, but historical verification records will be preserved for audit compliance.`;

    this.isConfirmDialogOpen = true;
  }

  public confirmToggleStatus(): void {
    if (!this.userToDeactivate?._id) return;

    const newStatus: UserStatus = this.userToDeactivate.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.userService.toggleStatus(this.userToDeactivate._id, newStatus).subscribe({
      next: (res) => {
        this.isConfirmDialogOpen = false;
        this.toastService.success(`Account for '${res.data.name}' is now ${res.data.status}.`);
        this.loadUsers();
      },
      error: (err) => {
        this.isConfirmDialogOpen = false;
        this.toastService.error(err.error?.message || 'Failed to update account status.');
      }
    });
  }

  public cancelToggleStatus(): void {
    this.isConfirmDialogOpen = false;
    this.userToDeactivate = null;
  }
}
