import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;

  isAdmin = this.authService._isAdmin;

  logout(): void {
    this.authService.logout();
  }
}
