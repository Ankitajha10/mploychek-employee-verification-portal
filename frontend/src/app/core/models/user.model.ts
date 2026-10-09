export type UserRole = 'ADMIN' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  status: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  employeeId: string;
  status: UserStatus;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  employeeId?: string;
  status?: UserStatus;
}
