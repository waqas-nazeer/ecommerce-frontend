// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ProductService } from '../../services/product.service';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { CartService } from '../../services/cart.service';
// import { SearchService } from '../../services/search.service';
// import { Subscription } from 'rxjs';
// import { ToastService } from '../../services/toast.service';

// @Component({
//   selector: 'app-productlist',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './productlist.component.html',
//   styleUrls: ['./productlist.component.css']
// })
// export class ProductlistComponent implements OnInit, OnDestroy {

//   products:any[]=[];
//   filteredProducts:any[]=[];
//   private searchSub?: Subscription;
//   // private readonly demoProducts: any[] = [
//   //   { id: 101, name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30h battery.', price: 129.99, stock: 12 },
//   //   { id: 102, name: 'Smart Watch', description: 'Fitness tracking with heart-rate monitor and GPS.', price: 89.99, stock: 7 },
//   //   { id: 103, name: 'Bluetooth Speaker', description: 'Portable speaker with deep bass and waterproof design.', price: 59.99, stock: 20 },
//   //   { id: 104, name: 'Gaming Mouse', description: 'Ergonomic mouse with RGB lighting and 6 programmable buttons.', price: 39.99, stock: 15 },
//   //   { id: 105, name: '4K Monitor', description: '27-inch UHD IPS display with HDR support.', price: 299.99, stock: 5 },
//   //   { id: 106, name: 'Mechanical Keyboard', description: 'Tactile switches with customizable keycaps.', price: 79.99, stock: 9 },
//   //   { id: 107, name: 'USB-C Hub', description: '7-in-1 hub with HDMI, USB 3.0, and SD card reader.', price: 34.99, stock: 25 },
//   //   { id: 108, name: 'Action Camera', description: '4K 60fps video with image stabilization.', price: 149.99, stock: 8 }
//   // ];

//   constructor(private productService:ProductService,
//                private router:Router,
//               private cartService : CartService,
//               private search: SearchService,
//               private toast: ToastService){}

//   ngOnInit(): void {
//     this.loadProducts();
//     this.searchSub = this.search.query$.subscribe(q => this.applyFilter(q));
//   }


//   // loadProducts(){
//   // this.productService.getProducts().subscribe({
//   //   next:(res)=> { 
//   //     const list = (res && Array.isArray(res) ? res : []);
//   //     const source = list.length > 0 ? list : this.demoProducts;
//   //     this.products = source.map((p: any, idx: number) => ({
//   //       ...p,
//   //       imageUrl: p?.imageUrl || `https://picsum.photos/seed/${p?.id ?? idx}/600/450`
//   //     }));
//   //     this.applyFilter(''); 
//   //   },
//   //   error:(err)=>{
//   //     this.products = this.demoProducts.map((p: any, idx: number) => ({
//   //       ...p,
//   //       imageUrl: p?.imageUrl
//   //       ? `http://localhost:3000${p.imageUrl}`  // ✅ Use backend URL
//   //       : `https://picsum.photos/seed/${p?.id ?? idx}/600/450`
//   //     }));
//   //     this.applyFilter('');
//   //     this.toast.warning(err.error?.message || 'Failed to load products. Showing demo items.');
//   //   }
//   // });

//   // } 
//   loadProducts() {
//     this.productService.getProducts().subscribe({
//       next: (res) => { 
//         const list = Array.isArray(res) ? res : [];
//         const source = list.length > 0 ? list : this.demoProducts;
  
//         this.products = source.map((p: any, idx: number) => ({
//           ...p,
//           imageUrl: p?.imageUrl 
//             ? `http://localhost:3000${p.imageUrl}`   // ✅ Add backend URL
//             : `https://picsum.photos/seed/${p?.id ?? idx}/600/450` // fallback
//         }));
  
//         this.applyFilter(''); 
//       },
//       error: (err) => {
//         this.products = this.demoProducts.map((p: any, idx: number) => ({
//           ...p,
//           imageUrl: `https://picsum.photos/seed/${p?.id ?? idx}/600/450`
//         }));
//         this.applyFilter('');
//         this.toast.warning(err.error?.message || 'Failed to load products. Showing demo items.');
//       }
//     });
//   }
  


// deleteProduct(id:number){
//  if(confirm('Are you sure to delete this product?')){
 
//   this.productService.deleteProduct(id).subscribe({
//     next:() => { this.loadProducts(); this.toast.success('Product deleted'); },
//     error:(err) => this.toast.error(err.error.message || 'Failed to delete product')
//   });
//  }
// }
// goToAddProduct(){
// this.router.navigate(['/addproducts']);
// }

//  // 👇 Add to cart logic
// addToCart(productId: number) {
//   // Call the cart service to add product
//   this.cartService.addToCart(productId, 1).subscribe({
//     next: () => {
//       // ✅ Refresh the BehaviorSubject so CartComponent gets updated
//       this.cartService.refreshCart();

//       // ✅ Optional: Show a quick alert/notification
//       this.toast.success('Product added to cart!');
//     },
//     error: (err) => {
//       // Handle errors (e.g., not logged in, server issues)
//       this.toast.error(err.error.message || 'Failed to add product to cart');
//       console.error('Add to cart error:', err);
//     }
//   });
// }

//   private applyFilter(query: string) {
//     const q = (query || '').toLowerCase();
//     this.filteredProducts = !q
//       ? this.products
//       : this.products.filter(p =>
//           (p.name || '').toLowerCase().includes(q) ||
//           (p.description || '').toLowerCase().includes(q)
//         );
//   }

//   ngOnDestroy(): void {
//     this.searchSub?.unsubscribe();
//   }

// }


import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';

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

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private search: SearchService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
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

  deleteProduct(id: number) {
    if (confirm('Are you sure to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => { 
          this.loadProducts(); 
          this.toast.success('Product deleted'); 
        },
        error: (err) => this.toast.error(err.error?.message || 'Failed to delete product')
      });
    }
  }

  goToAddProduct() {
    this.router.navigate(['/addproducts']);
  }

  // 👇 Add to cart
  addToCart(productId: number) {
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

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }
}
