import { HttpClient } from '@angular/common/http';
import { computed, effect, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'admin' | 'manager' | 'user';
      status: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string
    };
  };
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'user';
}

interface LoginRequest {
  name?:string;
  email: string;
  password: string;
}



@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'ai-taskflow-mean_access_token';
  private readonly REFRESH_TOKEN_KEY = 'ai-taskflow-mean_refresh_token';

  private userSignal =
    signal<LoginResponse['data']['user'] | null>(null);

  // Expose computed state
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());


  constructor(@Inject(PLATFORM_ID) private platformId:Object,
    private http: HttpClient, private router: Router) {
    // On app init, try to restore from localStorage
    const token = this.getAccessToken();
    if (token) {
      // Optionally hit /me endpoint; for now we only trust token presence
      console.log('Restore token from storage');
    }

    // Reactively log auth state
    effect(() => {
      console.log('Auth state changed. isAuthnticated =', this.isAuthenticated)
    })

  }

  getAccessToken(): string | null {
    if(isPlatformBrowser(this.platformId)){
    return localStorage.getItem(this.TOKEN_KEY);
    }
    return null; // SSR-safe
  }

  register(payload: LoginRequest){
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/register`, payload);
  }

  login(payload:LoginRequest){
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, payload);
  }

  setSession(response:LoginResponse){
    const {user, tokens} = response.data;
    localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    this.userSignal.set(user);
  }

  logout(){
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}
