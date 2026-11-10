import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'Admin' | 'Driver';

export interface AuthUser {
  id?: string;
  username?: string;
  role: UserRole;
  name: string;
  email?: string;
  profileImageUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userKey = 'driver-management-user';
  private readonly tokenKey = 'driver-management-token';
  private readonly baseUrl = environment.apiBaseUrl;
  user: AuthUser | null = null;

  constructor(private router: Router, private http: HttpClient) {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      this.user = JSON.parse(saved);
    }

    if (localStorage.getItem(this.tokenKey)) {
      this.loadCurrentUser().catch(() => undefined);
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<ApiResponse<{ token: string; user: any }>>(`${this.baseUrl}/auth/login`, { email: username, password }));
      const payload = response?.data;
      if (!payload?.token) {
        return false;
      }

      const role = this.normalizeRole(payload.user?.role);
      this.user = {
        id: payload.user?.id,
        username,
        role,
        name: payload.user?.name ?? payload.user?.email ?? username,
        email: payload.user?.email,
        profileImageUrl:  payload.user?.profileImageUrl
      };

      localStorage.setItem(this.tokenKey, payload.token);
      localStorage.setItem(this.userKey, JSON.stringify(this.user));
      return true;
    } catch (error) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      return false;
    }
  }

  logout() {
    this.user = null;
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.user || !!localStorage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    return this.user?.role ?? null;
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  async register(name: string, email: string, password: string, role: UserRole = 'Driver'): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.baseUrl}/auth/register`, { name, email, password, role }));
      return !!response?.data;
    } catch {
      return false;
    }
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('driver-management-token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      const response = await firstValueFrom(this.http.get<ApiResponse<any>>(`${this.baseUrl}/auth/me`, { headers: this.authHeaders() }),);
      const payload = response?.data;
      if (!payload) {
        return;
      }

      this.user = {
        id: payload.id,
        username: payload.email,
        role: this.normalizeRole(payload.role),
        name: payload.name ?? payload.email,
        email: payload.email,
        profileImageUrl: payload.profileImageUrl
      };
      localStorage.setItem(this.userKey, JSON.stringify(this.user));
    } catch {
      this.user = null;
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.tokenKey);
    }
  }

  private normalizeRole(role?: string): UserRole {
    const normalized = (role ?? '').toUpperCase();
    if (normalized.includes('ADMIN') || normalized === 'SUPER_ADMIN') {
      return 'Admin';
    }
    return 'Driver';
  }
}
