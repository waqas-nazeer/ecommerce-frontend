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

  const nav = this.router.getCurrentNavigation();
  const state = nav?.extras?.state;

  const product = state?.['product'];
  this.singleOrder = state?.['singleOrder'] || false;
  const selectedItems = state?.['selectedItems'];

  if (product && this.singleOrder) {
    // Buy now → single product
    this.cartItems = [product];
  } else if (selectedItems && selectedItems.length > 0) {
    // Checkout from cart with checkboxes
    this.cartItems = selectedItems;
  } else {
    // Default → load full cart
    let items = localStorage.getItem('checkoutItems');
    this.cartItems = items ? JSON.parse(items) : [];
    this.cartService.refreshCart();
  }

  // this.cartItems = this.cartService.checkoutItems;

  this.calculateTotal();
}

  private initDeliveryForm() {
    this.deliveryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3),Validators.pattern(/^[a-zA-Z\s]+$/)]],
      phone: ['+92', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      house: ['', [Validators.required,]],
      country: ['Pakistan', [Validators.required,]]
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
      productId:  item._id || item.product?.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const orderData = {
      items: orderItems,
      deliveryDetails: this.deliveryForm.value
    };

    this.orderService.placeOrder(orderData).subscribe({
         next: (res : any) => {
        this.toast.success(`Order placed successfully! Total: ${this.totalAmount}`);

     //Remove only purchased items from cart

     const purchasedIds = orderItems.map(item => item.productId);
     const remainingItems = this.cartItems.filter(item => !purchasedIds.includes(item._id || item.product?.id)
    );
    this.cartService.setCartItems(remainingItems);
        this.router.navigate(['/invoice', res.orderId]); // Redirect to products page
      },
      error: err => {
        console.error('Error placing order:', err);
        this.toast.error('Error placing order');
      }
    });
  }
}
