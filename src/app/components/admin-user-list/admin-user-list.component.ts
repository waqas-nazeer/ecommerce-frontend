// import { Component, OnInit } from '@angular/core';
// import { UsersService } from '../../services/users.service';
// import { CommonModule } from '@angular/common';
// import { ToastService } from '../../services/toast.service';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-admin-user-list',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './admin-user-list.component.html',
//   styleUrl: './admin-user-list.component.css'
// })
// export class AdminUserListComponent implements OnInit {
 
//   users : any[] =[];


//   constructor(
//     private userService : UsersService , 
//     private toast : ToastService, 
//     private router : Router, 
//     public auth:AuthService){}

//   ngOnInit(): void {
//  this.userService.getUsers().subscribe({
//   next: (data) => this.users = data,
//   error : (err) => console.log(err)
  
//  })
//   }
//   async  deleteUser(id:number) {
//     // if (!confirm('Are you sure you want to delete this user?')) return;

//    const confirmed =await this.toast.confirm(
//     'Are you sure you want to delete this product?'
//   );
//  if (confirmed){
//     this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.users = this.users.filter(u => u.id !== id);
//         this.toast.success('User deleted successfully');
//         // this.router.navigate(['/admin/users']);
//       },
//       error: (err) => this.toast.error(err.error?.message || 'Failed to delete user')
//     });
//   }else {
//     this.toast.info('Product deletion cancelled');
//   }
//   }
//   changeRole(user: any, newRole: string) {
//     if (!confirm(`Change role of ${user.username} to ${newRole}?`)) return;
//     this.userService.changeUserRole(user.id, newRole).subscribe({
//       next: () => {
//         this.toast.success(`Role updated to ${newRole}`);
//         // this.loadUsers(); // refresh table
//       },
//       error: err => this.toast.error(err.error?.message || 'Failed to change role')
//     });
//   }

// }

import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UsersService,
    private toast: ToastService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => this.users = data.filter((u: { role: string; }) => u.role !== 'superAdmin'),
      error: (err) => this.toast.error(err.error?.message || 'Failed to load users')
    });
  }

  async deleteUser(id: number) {
    const confirmed = await this.toast.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.toast.success('User deleted successfully');
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to delete user')
    });
  }

  async changeRole(user: any, newRole: string) {
    // if (!confirm(`Change role of ${user.username} to ${newRole}?`)) return;

    const confirm = await this.toast.confirm(`Change role of ${user.username} to ${newRole}?`)
   if (!confirm) return;
    this.userService.changeUserRole(user.id, newRole).subscribe({
      // next: () => {
      //   user.role = newRole; // Update role inline
      //   this.toast.success(`Role updated to ${newRole}`);
       next: () => {
      // Update the user's role inline
      user.role = newRole; // <-- res.user is returned from backend
      this.toast.success(`Role updated to ${newRole}`);
    },
      error: (err) => this.toast.error(err.error?.message || 'Failed to change role')
    });
    
  }

  onRoleChange(user: any, event: Event) {
  const select = event.target as HTMLSelectElement;
  const newRole = select.value;
  this.changeRole(user, newRole);
}
}
