import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, CreateUserRequest, UpdateUserRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="isOpen" class="modal-backdrop fade show"></div>
    <div
      *ngIf="isOpen"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-header border-bottom p-4">
            <h5 class="modal-title fw-bold text-dark d-flex align-items-center">
              <i class="bi me-2 text-primary" [ngClass]="isEditMode ? 'bi-pencil-square' : 'bi-person-plus-fill'"></i>
              {{ isEditMode ? 'Edit User Details' : 'Provision New User' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="onClose()"
              aria-label="Close"
            ></button>
          </div>

          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="modal-body p-4">
              <div class="row g-3">
                <!-- Full Name -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Full Name *</label>
                  <input
                    type="text"
                    formControlName="name"
                    class="form-control"
                    [ngClass]="{ 'is-invalid': userForm.get('name')?.touched && userForm.get('name')?.invalid }"
                    placeholder="e.g. Ramesh Kumar"
                  />
                  <div class="invalid-feedback">Full name is required.</div>
                </div>

                <!-- Username -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Username *</label>
                  <input
                    type="text"
                    formControlName="username"
                    class="form-control font-monospace"
                    [readonly]="isEditMode"
                    [ngClass]="{ 'is-invalid': userForm.get('username')?.touched && userForm.get('username')?.invalid }"
                    placeholder="e.g. ramesh"
                  />
                  <div class="invalid-feedback">Username is required (min 3 characters).</div>
                </div>

                <!-- Email -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Email Address *</label>
                  <input
                    type="email"
                    formControlName="email"
                    class="form-control"
                    [ngClass]="{ 'is-invalid': userForm.get('email')?.touched && userForm.get('email')?.invalid }"
                    placeholder="ramesh&#64;example.com"
                  />
                  <div class="invalid-feedback">A valid email address is required.</div>
                </div>

                <!-- Employee ID -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Employee ID *</label>
                  <input
                    type="text"
                    formControlName="employeeId"
                    class="form-control font-monospace"
                    [ngClass]="{ 'is-invalid': userForm.get('employeeId')?.touched && userForm.get('employeeId')?.invalid }"
                    placeholder="EMP-ENG-501"
                  />
                  <div class="invalid-feedback">Employee ID is required.</div>
                </div>

                <!-- Department -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Department *</label>
                  <input
                    type="text"
                    formControlName="department"
                    class="form-control"
                    [ngClass]="{ 'is-invalid': userForm.get('department')?.touched && userForm.get('department')?.invalid }"
                    placeholder="Engineering / QA / Product"
                  />
                  <div class="invalid-feedback">Department is required.</div>
                </div>

                <!-- Role -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Role *</label>
                  <select formControlName="role" class="form-select">
                    <option value="GENERAL_USER">General User (Employee)</option>
                    <option value="ADMIN">Administrator (Elevated)</option>
                  </select>
                </div>

                <!-- Account Status -->
                <div class="col-md-6">
                  <label class="form-label small fw-semibold text-dark">Status *</label>
                  <select formControlName="status" class="form-select">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <!-- Password (Only on Create) -->
                <div class="col-md-6" *ngIf="!isEditMode">
                  <label class="form-label small fw-semibold text-dark">Temporary Password *</label>
                  <input
                    type="password"
                    formControlName="password"
                    class="form-control"
                    placeholder="Default: Welcome&#64;123"
                  />
                  <small class="text-muted" style="font-size: 0.72rem;">
                    Leave blank to use default: <code>Welcome&#64;123</code>
                  </small>
                </div>
              </div>
            </div>

            <div class="modal-footer border-top p-3 bg-light rounded-bottom-4">
              <button
                type="button"
                class="btn btn-outline-secondary px-4"
                (click)="onClose()"
                [disabled]="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary px-4 fw-semibold"
                [disabled]="isSubmitting"
              >
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEditMode ? 'Save Changes' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-backdrop {
        background-color: rgba(15, 23, 42, 0.6);
      }
    `
  ]
})
export class UserFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() userToEdit: User | null = null;
  @Input() isSubmitting: boolean = false;

  @Output() saveUser = new EventEmitter<{ isEdit: boolean; data: any }>();
  @Output() closeModal = new EventEmitter<void>();

  public userForm!: FormGroup;
  public isEditMode: boolean = false;

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.initForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToEdit'] || changes['isOpen']) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.isEditMode = !!this.userToEdit;

    this.userForm = this.fb.group({
      name: [this.userToEdit?.name || '', [Validators.required]],
      username: [this.userToEdit?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [this.userToEdit?.email || '', [Validators.required, Validators.email]],
      employeeId: [this.userToEdit?.employeeId || '', [Validators.required]],
      department: [this.userToEdit?.department || '', [Validators.required]],
      role: [this.userToEdit?.role || 'GENERAL_USER', [Validators.required]],
      status: [this.userToEdit?.status || 'ACTIVE', [Validators.required]],
      password: ['']
    });
  }

  public onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formVal = this.userForm.value;
    if (!formVal.password) {
      delete formVal.password;
    }

    this.saveUser.emit({
      isEdit: this.isEditMode,
      data: formVal
    });
  }

  public onClose(): void {
    this.closeModal.emit();
  }
}
