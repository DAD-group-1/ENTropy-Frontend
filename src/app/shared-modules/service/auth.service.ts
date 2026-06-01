import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, take, tap, throwError } from 'rxjs';
import { AuthenticationService } from '../../core/data-services';
import { NavigationService } from './navigation.service';
import { filter } from 'rxjs/operators';

export enum Roles {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  MANAGEMENT = 'management',
  ADMIN = 'admin'
}

interface TokenData {
  sub: string;
  email: string;
  iat: string;
  exp: string;
  data: {
    role: Roles;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private navigationService = inject(NavigationService);
  private api = inject(AuthenticationService);

  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  public readonly ACCESS_TOKEN = 'access_token';
  public readonly REFRESH_TOKEN = 'refresh_token';

  private _tokenData: TokenData | null = null;

  get tokenData(): TokenData | null {
    return this._tokenData;
  }

  get tokenPersonalizedData(): TokenData['data'] | null {
    return this._tokenData?.data ?? null;
  }

  updateTokenData(): void {
    const token = this.getAccessToken();

    if (!token) {
      this._tokenData = null;
      return;
    }

    try {
      this._tokenData = JSON.parse(atob(token.split('.')[1])) as TokenData;
    } catch {
      this._tokenData = null;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);

    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
    }
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  hasAccessTokenAndNotExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  hasRefreshTokenAndNotExpired(): boolean {
    const token = this.getRefreshToken();
    if (!token) return false;

    return !this.isTokenExpired(token);
  }

  hasOneTokenAndNotExpired(): boolean {
    return this.hasAccessTokenAndNotExpired() || this.hasRefreshTokenAndNotExpired();
  }
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No token and/or no refresh token'));
    }

    if (this.isRefreshing) {
      return this.refreshSubject.asObservable().pipe(
        filter((token): token is string => token !== null),
        take(1),
      );
    }

    this.isRefreshing = true;
    this.refreshSubject.next(null);

    return this.api.authenticationRefreshToken({ refresh_token: refreshToken }).pipe(
      map((response) => {
        this.setTokens(response.data.access_token, response.data.refresh_token);
        this.updateTokenData();

        return response?.data?.access_token;
      }),

      tap((accessToken) => {
        this.isRefreshing = false;
        this.refreshSubject.next(accessToken);
      }),

      catchError((err) => {
        this.isRefreshing = false;
        this.refreshSubject.next(null);
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();

    this.clearTokens();

    if (refreshToken) {
      this.api.authenticationLogout({ refresh_token: refreshToken }).subscribe();
    }

    this.updateTokenData();

    this.navigationService.navigate('/login');
  }

  isLoggedVerified(): Observable<boolean> {
    return this.api.authenticationVerifyToken().pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
