import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);

  user = {};
  ngOnInit(): void {
    this.user = this.authService.getTokenClaims();
  }

  get userEntries() {
    return Object.entries(this.user);
  }
}
