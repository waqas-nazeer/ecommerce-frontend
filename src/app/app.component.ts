  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { RouterLink, RouterOutlet } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { AuthService } from './services/auth.service';
  import { SearchService } from './services/search.service';
  import { CartService } from './services/cart.service';
  import { Subscription } from 'rxjs';
  import { ToastContainerComponent } from './components/toast-container/toast-container.component';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, RouterLink, ToastContainerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  export class AppComponent implements OnInit, OnDestroy {
    title = 'frontend';
    searchQuery = '';
    cartCount = 0;
    private cartSub?: Subscription;
    currentYear = new Date().getFullYear();
    
    constructor(private auth: AuthService, private search: SearchService, private cart: CartService) {}

    isLoggedIn(): boolean {
      return this.auth.isLoggedIn();
    }

    onLogout(): void {
      this.auth.logout();
      this.cartCount = 0;
    }

    onSearch(query: string): void {
      this.searchQuery = query;
      this.search.setQuery(query);
    }

    ngOnInit(): void {
      if (this.isLoggedIn()) {
        this.cart.refreshCart();
      }
      this.cartSub = this.cart.cartItems$.subscribe((items: any[]) => {
        const list = items || [];
        this.cartCount = list.reduce((sum: number, item: any) => sum + (item?.quantity ?? 1), 0);
      });
    }

    ngOnDestroy(): void {
      this.cartSub?.unsubscribe();
    }
  }
