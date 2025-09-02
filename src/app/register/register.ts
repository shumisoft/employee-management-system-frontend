import { AuthService } from './../services/auth-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { single } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  isEmployee = false;
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  message = signal('');

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  addEmployeeIdControl() {
    if (!this.registerForm.get('employeeId')) {
      this.registerForm.addControl(
        'employeeId',
        new FormControl('', [Validators.required])
      );
    }
  }

  removeEmployeeIdControl() {
    if (this.registerForm.get('employeeId')) {
      this.registerForm.removeControl('employeeId');
    }
  }

  onSubmit() {
    console.log({
      value: this.registerForm.value,
      valid: this.registerForm.valid,
    });

    this.message.set('');

    if (this.registerForm.get('password')?.errors) {
    }

    if (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.message.set('passwords do not match');
      return;
    }

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (data) => {
          this.authService.storeResponse(data);
        },
        error: (e) => {
          this.message.set(e.error.message);
        },
      });
    }
  }
}
