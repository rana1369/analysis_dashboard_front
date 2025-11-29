export enum UserRole {
  Admin = 'Admin',
  Finance = 'Finance',
  Viewer = 'Viewer'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

