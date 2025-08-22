import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  // Place an order
  placeOrder(items: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/place`, { items });
  }

  // Get all orders for current user
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
