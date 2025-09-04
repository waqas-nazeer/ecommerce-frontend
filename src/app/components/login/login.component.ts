import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
     private auth: AuthService,
      private router: Router, 
      private toast: ToastService) {}

onLogin() {
  if (this.loginForm.valid) {
    const   credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.auth.login(credentials).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.token);
         // ✅ Role-based redirect
        if (this.auth.isSuperAdmin() || this.auth.isAdmin()) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/products'], { replaceUrl: true });
        }
      },
      error: (err: any) => {
        this.toast.error(err.error.message || 'Login failed');
      }
    });
  }
}

}

