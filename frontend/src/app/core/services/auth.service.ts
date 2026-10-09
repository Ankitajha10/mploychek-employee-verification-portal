import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { LoginRequest, LoginResponseData, ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api';
  private readonly TOKEN_KEY = 'mploychek_auth_token';
  private readonly USER_KEY = 'mploychek_user_profile';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Authenticate user with credentials and requested role
   */
  public login(credentials: LoginRequest, delayMs: number = 0): Observable<ApiResponse<LoginResponseData>> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }

    return this.http
      .post<ApiResponse<LoginResponseData>>(`${this.apiUrl}/auth/login`, credentials, { params })
      .pipe(
        tap((res) => {
          if (res.success && res.data.token) {
            this.setSession(res.data.token, res.data.user);
          }
        })
      );
  }

  /**
   * Refresh current user profile from server
   */
  public fetchProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setCurrentUser(res.data);
        }
      })
    );
  }

  /**
   * Logout user, clear local storage and redirect to login
   */
  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  public hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === role;
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  public isGeneralUser(): boolean {
    return this.hasRole('GENERAL_USER');
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
