import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserRequest, UpdateUserRequest, UserRole, UserStatus } from '../models/user.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  public getUsers(options?: {
    search?: string;
    role?: UserRole | '';
    status?: UserStatus | '';
    delayMs?: number;
  }): Observable<ApiResponse<User[]>> {
    let params = new HttpParams();

    if (options?.search) {
      params = params.set('search', options.search.trim());
    }
    if (options?.role) {
      params = params.set('role', options.role);
    }
    if (options?.status) {
      params = params.set('status', options.status);
    }
    if (options?.delayMs && options.delayMs > 0) {
      params = params.set('delay', options.delayMs.toString());
    }

    return this.http.get<ApiResponse<User[]>>(this.apiUrl, { params });
  }

  public getUserById(id: string, delayMs: number = 0): Observable<ApiResponse<User>> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`, { params });
  }

  public createUser(user: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user);
  }

  public updateUser(id: string, user: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user);
  }

  public toggleStatus(id: string, status?: UserStatus): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}/status`, { status });
  }

  public deleteUser(id: string): Observable<ApiResponse<User>> {
    return this.http.delete<ApiResponse<User>>(`${this.apiUrl}/${id}`);
  }
}
