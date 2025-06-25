import { Component, OnInit, signal } from '@angular/core';
import { Department } from '../department-type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../department-service';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationModal } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { EmployeeTable } from '../../employee/employee-table/employee-table';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-department-item-page',
  imports: [CommonModule, RouterLink, DeleteConfirmationModal, EmployeeTable],
  templateUrl: './department-item-page.html',
  styleUrl: './department-item-page.css',
})
export class DepartmentItemPage implements OnInit {
  departmentId!: number;
  department = signal<Department | null>(null);
  isAdmin = signal<boolean>(false);

  showDeleteDialog = false;

  constructor(
    private readonly service: DepartmentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authServie: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin.set(this.authServie.isAdmin());

    this.route.params.subscribe((data) => {
      this.departmentId = data?.['id'];
    });

    if (this.departmentId) this.getDepartment();
  }

  getDepartment() {
    this.service.fetchDepartment(this.departmentId).subscribe({
      next: (data) => {
        this.department.set(data);
        console.log(data);
      },
    });
  }

  deleteDepartment(id: number) {
    this.service.deleteDepartment(id);
    this.router.navigate(['/department']);
  }

  onDelete() {
    this.showDeleteDialog = true;
  }

  onCancel() {
    this.showDeleteDialog = false;
  }

  onConfirm() {
    this.service.deleteDepartment(this.department()!.id).subscribe({
      next: () => {
        this.router.navigate(['/department']);
      },
    });
  }
}
