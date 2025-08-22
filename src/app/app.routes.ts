  import { Routes } from '@angular/router';
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  import { LoginComponent } from './components/login/login.component';
  import { RegisterComponent } from './components/register/register.component';
  import { authGuard } from './guards/auth.guard';
  import { guestGuard } from './guards/guest.guard';
  import { ProductlistComponent } from './components/productlist/productlist.component';
  import { AddProductComponent } from './components/add-product/add-product.component';
  import { CartComponent } from './components/cart-list/cart-list.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';

  export const routes: Routes = [

      
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  //   { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    {path: 'products', component : ProductlistComponent, canActivate: [authGuard]},
    {path: 'addproducts', component : AddProductComponent, canActivate: [authGuard]},
      { path: 'cart', component: CartComponent },
      { path: 'place-order', component: PlaceOrderComponent, canActivate: [authGuard] },


  ];
