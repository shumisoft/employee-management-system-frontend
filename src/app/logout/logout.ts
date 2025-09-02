import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.logout();
  }
}
