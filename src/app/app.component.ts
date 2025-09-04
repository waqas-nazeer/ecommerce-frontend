  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
  import { CommonModule, Location } from '@angular/common';
  import { AuthService } from './services/auth.service';
  import { SearchService } from './services/search.service';
  import { CartService } from './services/cart.service';
  import {  filter } from 'rxjs/operators';
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
    showBackButton = false;
    
    constructor( 
      public auth: AuthService, 
      private search: SearchService, 
      private cart: CartService,
      private location: Location,
      private router : Router
    ) {}

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

          // Detect route changes and toggle back button
      this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event : NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;

        if (this.auth.isUser() && currentUrl === '/products') {
          this.showBackButton = false
        } else if((this.auth.isAdmin() || this.auth.isSuperAdmin()) && currentUrl === '/dashboard'){
            this.showBackButton = false
        }else {
          this.showBackButton = true;
        }
      });
    }

      

  goBack(): void{
 this.location.back();
  }
  goHome(): void{
 if (this.auth.isUser()) {
  this.router.navigate(['/products'])
 } else if(this.auth.isSuperAdmin() ||this.auth.isAdmin()){
  this.router.navigate(['/dashboard'])
 }else {
    // fallback (e.g., not logged in)
    this.router.navigate(['/login']);
  }
    
  }
    ngOnDestroy(): void {
      this.cartSub?.unsubscribe();
    }
  }
