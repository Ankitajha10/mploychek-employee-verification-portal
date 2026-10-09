import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard/admin-dashboard.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { RecordListComponent } from './records/record-list/record-list.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // General User Routes (Protected by authGuard)
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-records',
    component: RecordListComponent,
    canActivate: [authGuard]
  },

  // Admin Routes (Protected by authGuard and adminGuard)
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/records',
    component: RecordListComponent,
    canActivate: [authGuard, adminGuard]
  },

  // Default and Wildcard redirects
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
