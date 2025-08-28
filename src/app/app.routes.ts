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
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';

  export const routes: Routes = [

      
  { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

     // ✅ Role-based
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: [ 'user','admin','superAdmin'] } },
  { path: 'products', component: ProductlistComponent, canActivate: [authGuard], data: { roles: ['user', 'admin','superAdmin'] } },
  { path: 'addproducts', component: AddProductComponent, canActivate: [authGuard], data: { roles: ['admin', 'superAdmin'] } },
  { path: 'cart', component: CartComponent, canActivate: [authGuard], data: { roles: ['user'] } },
  { path: 'place-order', component: PlaceOrderComponent, canActivate: [authGuard], data: { roles: ['user'] } },

  { path: 'updateproduct/:id',  component: UpdateProductComponent, canActivate: [authGuard], data: { roles: ['admin','superAdmin'] }},
  {path: 'admin/users', component : AdminUserListComponent, canActivate :[authGuard], data : {roles : ['superAdmin']}},

  ];
