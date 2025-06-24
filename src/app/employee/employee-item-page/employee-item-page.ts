import { EmployeeStatus } from './../employee-type';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Employee } from '../employee-type';
import { EmployeeService } from '../employee-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationModal } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-employee-item-page',
  imports: [CommonModule, RouterLink, DeleteConfirmationModal],
  templateUrl: './employee-item-page.html',
  styleUrl: './employee-item-page.css',
})
export class EmployeeItemPage implements OnInit {
  curId!: number;
  employee = signal<Employee | null>(null);

  showDeleteDialog = false;

  EmployeeStatus = EmployeeStatus;

  private readonly service = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authServie = inject(AuthService);

  isAdmin = signal<boolean>(false);

  ngOnInit(): void {
    this.isAdmin.set(this.authServie.isAdmin());

    this.route.params.subscribe((data) => {
      this.curId = data?.['id'];
      this.fetchEmployee();
    });
  }

  fetchEmployee() {
    this.service.fetchEmployee(this.curId).subscribe({
      next: (data) => this.employee.set(data),
    });
  }

  onDelete() {
    this.showDeleteDialog = true;
  }

  onCancel() {
    this.showDeleteDialog = false;
  }

  onConfirm() {
    this.service.deleteEmployee(this.employee()!.id).subscribe({
      next: () => {
        this.router.navigate(['/employee']);
      },
    });
  }
}
