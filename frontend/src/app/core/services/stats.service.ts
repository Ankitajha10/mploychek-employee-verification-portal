import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/stats.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly apiUrl = 'http://localhost:5000/api/stats';

  constructor(private http: HttpClient) {}

  public getStats(delayMs: number = 0): Observable<ApiResponse<DashboardStats>> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }
    return this.http.get<ApiResponse<DashboardStats>>(this.apiUrl, { params });
  }
}
