import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../employee-service';
import { EmployeeStatus } from '../employee-type';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  employeeId?: number;
  EmployeeStatus = EmployeeStatus;

  departmentId?: number;

  private readonly service = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  employeeForm = this.fb.group({
    firstName: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    joinDate: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: this.fb.control(EmployeeStatus.ACTIVE, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    // explicitly null | number
    manager: new FormControl<number | null>(null),
    department: new FormControl<number | null>(null),
  });

  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.employeeId = data?.['id'];
      if (this.employeeId) this.getemployee();
    });
    this.route.queryParams.subscribe((data) => {
      this.departmentId = data?.['departmentId'];
      if (this.departmentId)
        this.employeeForm.patchValue({
          department: this.departmentId,
        });
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const payload = {
        ...this.employeeForm.value,
        joinDate: this.formatDate(this.employeeForm.value.joinDate),
      };
      console.log('Payload:', payload);
      if (this.employeeId) {
        this.service
          .updateEmployee(this.employeeId, { ...this.employeeForm.value })
          .subscribe({
            next: () => {
              this.router.navigate(['employee', this.employeeId]);
            },
          });
      } else {
        this.service.createEmployee({ ...this.employeeForm.value }).subscribe({
          next: (created) => {
            this.router.navigate(['employee', created.id]);
          },
        });
      }
    }
  }

  get statusOptions(): string[] {
    return Object.values(EmployeeStatus);
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  getemployee() {
    this.service.fetchEmployee(this.employeeId!).subscribe({
      next: (data) => {
        this.employeeForm.setValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          joinDate: this.formatDate(data.joinDate),
          status: data.status,
          manager:
            typeof data.manager === 'number'
              ? data.manager
              : data.manager?.id ?? null,

          department:
            typeof data.department === 'number'
              ? data.department
              : data.department?.id ?? null,
        });
      },
    });
  }

  onCancel() {
    if (this.employeeId) this.router.navigate(['employee', this.employeeId]);
    else this.router.navigate(['/employee']);
  }
}
