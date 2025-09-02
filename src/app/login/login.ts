import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  message = signal('');

  login() {
    if (this.username === '' || this.password === '') return;
    this.message.set('');

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (data) => {
          this.authService.storeResponse(data);
        },
        error: (e) => {
          this.message.set(e.error.message);
        },
      });
  }
}
