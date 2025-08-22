

import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartComponent implements OnInit {

  cartItems: any[] = [];
  cartTotal = 0;
  selectedTotal = 0;
  private selectedIds = new Set<number>();

  constructor(
    private cartService: CartService, 
    private router:Router, 
    private toast: ToastService) {}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject for live updates
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
    

    // Load initial cart items
    this.cartService.refreshCart();
  }

  removeItem(productId: number) {
  this.cartService.removeFromCart(productId).subscribe({
    next: () => this.cartService.refreshCart(),
    error: err => console.error(err)
  });
}

  incrementQuantity(item: any) {
    const productId = item?.productId ?? item?.product?.id;
    if (!productId) { return; }
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => this.cartService.refreshCart(),
      error: err => console.error(err)
    });
    // Optimistic UI update
    if (typeof item.quantity === 'number') { item.quantity += 1; this.calculateTotal(); }
  }

  decrementQuantity(item: any) {
    const productId = item?.productId ?? item?.product?.id;
    if (!productId) { return; }
    if ((item?.quantity ?? 1) <= 1) {
      // Remove item if quantity would hit 0
      // this.removeItem(productId);
      return;
    }
    // Try to reduce by 1 using add endpoint with negative quantity
    this.cartService.addToCart(productId, -1).subscribe({
      next: () => this.cartService.refreshCart(),
      error: err => {
        // Fallback if backend does not accept negative quantities:
        // remove and re-add with decremented total
        const newQty = Math.max(1, (item?.quantity ?? 1) - 1);
        this.cartService.removeFromCart(productId).subscribe({
          next: () => this.cartService.addToCart(productId, newQty).subscribe({
            next: () => this.cartService.refreshCart(),
            error: e2 => {
              console.error(e2);
              this.cartService.refreshCart();
            }
          }),
          error: e1 => {
            console.error(e1);
            this.cartService.refreshCart();
          }
        });
      }
    });
    // Optimistic UI update
    if (typeof item.quantity === 'number') { item.quantity -= 1; this.calculateTotal(); }
  }

  checkoutCart() {
    const selectedItems = (this.cartItems || []).filter(i => this.selectedIds.has(i?.productId ?? i?.product?.id));
    if (!selectedItems || selectedItems.length === 0) {
      this.toast.info('Select at least one item to checkout');
      return;
    }
    this.router.navigate(['/place-order'], { state: { selectedItems } });
  }

  private calculateTotal() {
    this.cartTotal = (this.cartItems || []).reduce((sum, it: any) => {
      const unit = Number(it?.product?.price) || 0;
      const qty = Number(it?.quantity) || 0;
      return sum + unit * qty;
    }, 0);
    this.selectedTotal = (this.cartItems || []).reduce((sum, it: any) => {
      const id = it?.productId ?? it?.product?.id;
      if (!this.selectedIds.has(id)) { return sum; }
      const unit = Number(it?.product?.price) || 0;
      const qty = Number(it?.quantity) || 0;
      return sum + unit * qty;
    }, 0);
  }

orderSingleItem(item: any) {
  // Navigate to place-order component and pass product via router state
  this.router.navigate(['/place-order'], { state: { product: item , singleOrder : true} });
}

toggleSelection(item: any, checked: boolean) {
  const id = item?.productId ?? item?.product?.id;
  if (id == null) { return; }
  if (checked) {
    this.selectedIds.add(id);
  } else {
    this.selectedIds.delete(id);
  }
  this.calculateTotal();
}
}
