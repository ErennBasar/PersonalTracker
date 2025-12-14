import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthUser } from '../models/auth';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  // O anki kullanıcıyı uygulamada her yerden erişilebilir yapıyoruz
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Sayfa yenilendiğinde LocalStorage'dan kullanıcıyı geri yükle
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(request: LoginRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/login`, request).pipe(
      tap((user: AuthUser) => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthUser> {
    return this.http.post<AuthUser>(`${this.apiUrl}/register`, request);
  }

  logout() {
    // Çıkış yapınca her şeyi temizle
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Şu anki kullanıcının ID'sini almak için pratik metod
  getCurrentUserId(): string | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.id : null;
  }
}
