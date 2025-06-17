import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  loading = signal(false);

  // Clear backend error on input changes
  onFieldChange() {
    if (this.message()) this.message.set('');
  }

  login(form: NgForm) {
    if (form.invalid) return;

    this.loading.set(true);
    this.message.set('');

    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (data) => {
          this.authService.storeResponse(data);
          this.loading.set(false);
        },
        error: (e) => {
          this.message.set(e?.error?.message ?? 'Login failed');
          this.loading.set(false);
        },
      });
  }

  quickLogin(role: 'ADMIN' | 'EMPLOYEE', form: NgForm) {
    if (!environment.demoMode) return;

    const creds = environment?.demoCredentials?.[role];

    if (!creds) return;

    this.username = creds.username;
    this.password = creds.password;

    // Allow ngModel to sync before submit
    /**
     * The only reliable way to do this in template-driven forms is to defer submission to the next macrotask.
     * Why macrotask (not microtask)
     * Promise.resolve() = microtask ❌ (too early)
     * setTimeout(0) = macrotask ✅ (after form sync)
     */
    setTimeout(() => {
      this.login(form);
    });
  }
}
