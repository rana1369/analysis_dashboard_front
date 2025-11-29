import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { User, LoginRequest, LoginResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // In a real app, this would call your backend API
    // For now, we'll simulate with mock data
    return new Observable(observer => {
      // Mock authentication - replace with actual API call
      const mockResponse: LoginResponse = {
        user: {
          id: '1',
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          role: credentials.username === 'admin' ? 'Admin' as any : 
                credentials.username === 'finance' ? 'Finance' as any : 'Viewer' as any,
          token: 'mock-jwt-token-' + Date.now()
        },
        token: 'mock-jwt-token-' + Date.now()
      };

      setTimeout(() => {
        this.setUser(mockResponse.user, mockResponse.token);
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });

    // Real implementation would be:
    // return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
    //   .pipe(tap(response => this.setUser(response.user, response.token)));
  }

  logout(): void {
    localStorage.removeItem(environment.jwtTokenKey);
    localStorage.removeItem(environment.userKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(environment.jwtTokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  private setUser(user: User, token: string): void {
    localStorage.setItem(environment.jwtTokenKey, token);
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(environment.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }
}

