import { User, UserRole } from './user.model';

export interface LoginRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}
