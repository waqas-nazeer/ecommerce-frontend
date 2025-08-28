


import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit, OnDestroy {

  products: any[] = [];
  filteredProducts: any[] = [];
  private searchSub?: Subscription;
  isAdmin : boolean = false;
  isUser : boolean = false;
  superAdmin : boolean = false;

  constructor(
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private cartService: CartService,
    private search: SearchService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
  const role = this.auth.getUserRole()?. toLowerCase(); // get the role from JWT or AuthService
  this.isAdmin = role === 'admin' || role ==='superadmin';
  this.isUser = role === 'user';
  this.superAdmin = role === 'superadmin'
  
    this.loadProducts();
    this.searchSub = this.search.query$.subscribe(q => this.applyFilter(q));
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (res) => { 
        const list = Array.isArray(res) ? res : [];
        this.products = list.map((p: any, idx: number) => ({
          ...p,
          imageUrl: p?.imageUrl 
            ? `http://localhost:3000${p.imageUrl}`   // ✅ use backend file path
            : `https://via.placeholder.com/600x450?text=No+Image` // fallback placeholder
        }));
        this.applyFilter(''); 
      },
      error: (err) => {
        this.products = [];
        this.applyFilter('');
        this.toast.error(err.error?.message || 'Failed to load products.');
      }
    });
  }


  async deleteProduct(id: number) {
  const role = this.auth.getUserRole()?.toLowerCase();
  if (role !== 'admin' && role !== 'superadmin') {
    this.toast.error('Only admins or Superadmin can delete products');
    return;
  }
  if (!this.isAdmin && !this.superAdmin) return this.toast.error('Access denied: Admin only');

  // ✅ Await the confirm toast
  const confirmed = await this.toast.confirm(
    'Are you sure you want to delete this product?'
  );

  if (confirmed) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
        this.toast.success('Product deleted successfully');
      },
      error: (err) =>
        this.toast.error(
          err.error?.message ||
            'This product is in some carts, remove it from carts first.'
        ),
    });
  } else {
    this.toast.info('Product deletion cancelled');
  }
}


  goToAddProduct() {

   if (this.isAdmin)  this.router.navigate(['/addproducts']);
   else this.toast.error('Access denied: Admin only');
  }

  // 👇 Add to cart
  addToCart(productId: number) {
    const role = this.auth.getUserRole();
  if(role !== 'user'){
 this.toast.error('Only users can add to cart');
 return;
  }

    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.cartService.refreshCart();
        this.toast.success('Product added to cart!');
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to add product to cart');
        console.error('Add to cart error:', err);
      }
    });
  }

  private applyFilter(query: string) {
    const q = (query || '').toLowerCase();
    this.filteredProducts = !q
      ? this.products
      : this.products.filter(p =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        );
  }
  goToUpdateProduct(productId: number) {
  if (this.isAdmin) {
    // Navigate to the update product page with the product ID
    this.router.navigate(['/updateproduct', productId]);
  } else {
    this.toast.error('Access denied: Admin only');
  }
}

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }
}
