import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    role: string | null = null;
    username: string | null = null;
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Optional: redirect normal users if they try to access
    if (!this.auth.isAdmin() && !this.auth.isSuperAdmin()) {
      this.router.navigate(['/products']);
    }

  }


}