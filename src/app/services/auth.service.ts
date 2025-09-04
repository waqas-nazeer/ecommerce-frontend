

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // your backend URL

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Register user
  register(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // ✅ Login user
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // ✅ Save token to localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // ✅ Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // ✅ Remove token and redirect
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  // ✅ Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token); 
      console.log('Decoded JWT:', decoded);
      return decoded.role || null;
    } catch (err) {
      console.error('Failed to decode token', err);
      return null;
    }
  }

 getUsername(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    console.log('Decoded JWT:', decoded); // check what fields exist
    return decoded.username ||  null; // adjust depending on your JWT payload
  } catch (err) {
    console.error('Failed to decode token', err);
    return null;
  }
}
  hasRole(allowedRoles: string[]): boolean {
    const role = this.getUserRole();
    return role ? allowedRoles.includes(role) : false;
  }

  // ✅ Check if admin
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'superAdmin';
  }

  isUser(): boolean {
    return this.getUserRole() === 'user';
  }

  isSuperAdmin(): boolean {
    return this.getUserRole() === 'superAdmin';
  }
}
