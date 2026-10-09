import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isLoading: boolean = false;
  public errorMessage: string = '';
  public showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    // If already authenticated, redirect to appropriate dashboard
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUserValue();
      if (user?.role === 'ADMIN') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
      return;
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['GENERAL_USER', [Validators.required]]
    });
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Quick-fill demo credentials for evaluator convenience
   */
  public fillDemoCredentials(role: UserRole, username: string, pass: string): void {
    this.loginForm.patchValue({
      username,
      password: pass,
      role
    });
    this.errorMessage = '';
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password, role } = this.loginForm.value;

    this.authService.login({ username, password, role }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${response.data.user.name}!`, 'Login Successful');

        if (response.data.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Authentication failed. Please verify your credentials and network connection.';
        }
      }
    });
  }
}
