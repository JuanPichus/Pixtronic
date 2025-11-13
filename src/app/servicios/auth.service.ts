import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Usuario {
  id: number;
  username: string;
  email: string;
  admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Solo acceder a localStorage si estamos en el navegador
    let storedUser = null;
    if (this.isBrowser) {
      const stored = localStorage.getItem('currentUser');
      storedUser = stored ? JSON.parse(stored) : null;
    }
    
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            if (this.isBrowser) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.admin || false;
  }
}