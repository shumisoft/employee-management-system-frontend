import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
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
  route = 'api/auth';

  private readonly router = inject(Router);

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly uri: string
  ) {}

  login(body: AuthRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.uri}/${this.route}/login`,
      body
    );
  }

  register(body: AuthRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(
      `${this.uri}/${this.route}/register`,
      body
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
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

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  storeResponse(data: TokenResponse) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem(
      'authUser',
      JSON.stringify(JSON.stringify(jwtDecode(data.token)))
    );
    this.router.navigateByUrl('/');
  }
}
