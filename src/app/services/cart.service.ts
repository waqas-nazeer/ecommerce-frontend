import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/api/cart';


   // This BehaviorSubject will store the latest cart items
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  checkoutItems: any = [];

  constructor(private http: HttpClient) { }

  // ✅ Get token from localStorage (same key as AuthService)
  private getAuthHeaders() {
    const token = localStorage.getItem('authToken'); // 👈 fixed here
    return {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
  }

  // ✅ Add product to cart
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId, quantity }, this.getAuthHeaders())
     .pipe(
      tap(() => this.refreshCart()) // automatically refresh cart
    );
  }

 // ✅ Get all cart items
getCart(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`, this.getAuthHeaders());
}

refreshCart() {
  this.getCart().subscribe(items => {
    this.cartItemsSubject.next(items);
  });
}
// Clear all items in cart
clearCart(): Observable<any> {
  return this.http.delete(`${this.apiUrl}/clear`, this.getAuthHeaders())
    .pipe(
      tap(() => this.refreshCart()) // Refresh the cart after clearing
    );
}

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`, this.getAuthHeaders())
      .pipe(tap(() => this.refreshCart()));
  }

  setCartItems(items :any[]){
    localStorage.setItem('cart',JSON.stringify(items));
    this.cartItemsSubject.next(items)
  }
}
