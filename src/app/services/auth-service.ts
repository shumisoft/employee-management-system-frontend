import { HttpClient } from '@angular/common/http';
import { computed, inject, Inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TokenResponse } from '../models/TokenResponse';
import { API_URL } from '../tokens/api.tokens';

import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { AuthRequest } from '../models/AuthRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly route = 'api/auth';
  readonly ADMIN = 'ADMIN';

  private readonly router = inject(Router);

  private readonly _isAuthenticated = signal<boolean>(
    localStorage.getItem('authToken') !== null,
  );

  isAuthenticated = computed(() => this._isAuthenticated());

  setAuthenticated(value: boolean) {
    this._isAuthenticated.set(value);
  }

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly uri: string,
  ) {}

  login(body: AuthRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.uri}/${this.route}/login`,
      body,
    );
  }

  register(body: AuthRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.uri}/${this.route}/register`,
      body,
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getTokenClaims(): any {
    return JSON.parse(localStorage.getItem('authUser')!);
  }

  getRole(): string | null {
    const claims = this.getTokenClaims();
    return claims?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === this.ADMIN;
  }

  logout() {
    localStorage.clear();
    this.setAuthenticated(false);
    this.router.navigateByUrl('/login');
  }

  storeResponse(data: TokenResponse) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('authUser', JSON.stringify(jwtDecode(data.token)));
    this.setAuthenticated(true);
  }

  storeResponseAndNavigateToDashboard(data: TokenResponse) {
    this.storeResponse(data);
    this.router.navigateByUrl('/dashboard');
  }

  refreshToken(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.uri}/${this.route}/refresh`, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
