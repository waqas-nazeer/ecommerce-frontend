import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './place-order.component.html'
})
export class PlaceOrderComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0; 
  singleOrder: any;
  deliveryForm!: FormGroup;
  isFormValid = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

 ngOnInit() {
    this.initDeliveryForm();
    // Check if a product was passed via router state
    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras?.state?.['product'];

    if (product && this.singleOrder) {
      this.cartItems = [product]; // Only this product
    } else {
      // Full cart order
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.calculateTotal();
      });
      this.cartService.refreshCart();
    }

    this.calculateTotal();
  }

  private initDeliveryForm() {
    this.deliveryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      house: ['', [Validators.required, Validators.minLength(5)]],
      country: ['', [Validators.required, Validators.minLength(2)]]
    });
    
    this.deliveryForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });
  }

    // Calculate total price
  calculateTotal() {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }


  placeOrder() {
    if (this.cartItems.length === 0 || !this.deliveryForm.valid) {
      this.toast.error('Please fill in all delivery details!');
      return;
    }

    // Prepare items for backend
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderData = {
      items: orderItems,
      deliveryDetails: this.deliveryForm.value
    };

    this.orderService.placeOrder(orderItems).subscribe({
         next: () => {
        this.toast.success(`Order placed successfully! Total: ${this.totalAmount}`);

     // Remove ordered items from cart
        if (this.singleOrder) {
          // Remove only this item
          this.cartService.removeFromCart(orderItems[0].productId).subscribe(() => {
            this.cartService.refreshCart();
          });
        } else {
          // Clear entire cart
          this.cartService.clearCart().subscribe(() => this.cartService.refreshCart());
        }

        this.router.navigate(['/products']); // Redirect to products page
      },
      error: err => {
        console.error('Error placing order:', err);
        this.toast.error('Error placing order');
      }
    });
  }
}
