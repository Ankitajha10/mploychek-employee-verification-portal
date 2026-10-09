import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$: Observable<ToastMessage[]> = this.toastsSubject.asObservable();

  public show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info', title?: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, newToast]);

    // Auto remove after 4.5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 4500);
  }

  public success(message: string, title: string = 'Success'): void {
    this.show(message, 'success', title);
  }

  public error(message: string, title: string = 'Error'): void {
    this.show(message, 'danger', title);
  }

  public warning(message: string, title: string = 'Notice'): void {
    this.show(message, 'warning', title);
  }

  public info(message: string, title: string = 'Information'): void {
    this.show(message, 'info', title);
  }

  public remove(id: string): void {
    const updated = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(updated);
  }
}
