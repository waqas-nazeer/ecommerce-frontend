import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders() {
    const token = this.auth.getToken(); // get token from AuthService
    if (!token) throw new Error('No auth token found');
      
    
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // Place an order
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, orderData, this.getHeaders());
  }

  // Get all orders for current user
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, this.getHeaders(  ));
  }

  // Get a single order by ID
getOrderById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
};


}


