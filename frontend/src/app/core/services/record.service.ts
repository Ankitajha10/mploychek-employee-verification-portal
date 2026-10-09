import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmploymentRecord, CreateRecordRequest } from '../models/record.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private readonly apiUrl = 'http://localhost:5000/api/records';

  constructor(private http: HttpClient) {}

  public getRecords(userId?: string, delayMs: number = 0): Observable<ApiResponse<EmploymentRecord[]>> {
    let params = new HttpParams();

    if (userId) {
      params = params.set('userId', userId);
    }
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }

    return this.http.get<ApiResponse<EmploymentRecord[]>>(this.apiUrl, { params });
  }

  public getRecordById(id: string, delayMs: number = 0): Observable<ApiResponse<EmploymentRecord>> {
    let params = new HttpParams();
    if (delayMs > 0) {
      params = params.set('delay', delayMs.toString());
    }
    return this.http.get<ApiResponse<EmploymentRecord>>(`${this.apiUrl}/${id}`, { params });
  }

  public createRecord(record: CreateRecordRequest): Observable<ApiResponse<EmploymentRecord>> {
    return this.http.post<ApiResponse<EmploymentRecord>>(this.apiUrl, record);
  }

  public updateRecord(id: string, record: Partial<CreateRecordRequest>): Observable<ApiResponse<EmploymentRecord>> {
    return this.http.put<ApiResponse<EmploymentRecord>>(`${this.apiUrl}/${id}`, record);
  }
}
