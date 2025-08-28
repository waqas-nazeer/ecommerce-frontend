import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

private apiUrl = 'http://localhost:3000/api/superAdmin'

  constructor(private http : HttpClient , private auth : AuthService) { }

  getUsers(): Observable<any>{
   const token = this.auth.getToken();
   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.get(`${this.apiUrl}/users`, {headers})
  }

  deleteUser(id : number):Observable<any>{
    const token = this.auth.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/users/${id}`, {headers})
  } 
  // ✅ Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


   // ✅ Change user role
  changeUserRole(userId: number, role: string) {
    const token = this.getToken(); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role }, { headers });
  }

}
