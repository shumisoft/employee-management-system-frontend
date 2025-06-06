import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  readonly demoMode = environment.demoMode;

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

  quickLogin(role: 'ADMIN' | 'EMPLOYEE') {
    if (!environment.demoMode) return;

    const creds = environment?.demoCredentials?.[role] || null;

    if (creds) {
      this.username = creds.username;
      this.password = creds.password;
      this.login();
    }
  }
}
