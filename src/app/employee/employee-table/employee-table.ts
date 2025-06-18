import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteConfirmationModal } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { PageResponse } from '../../models/PageResponse';
import { EmployeeService } from '../employee-service';
import { Employee, EmployeeStatus } from '../employee-type';

@Component({
  selector: 'app-employee-table',
  imports: [CommonModule, RouterLink, DeleteConfirmationModal],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.css',
})
export class EmployeeTable implements OnInit {
  private readonly service = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  pageNumber: number = 1;
  pageSize: number = 5;

  @Input() departmentId?: number;

  employeePage = signal<PageResponse<Employee> | null>(null);

  deleteId: number | null = null;

  EmployeeStatus = EmployeeStatus;

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this.pageNumber = Number(data?.['page'] ?? 1);
      this.pageSize = Number(data?.['pageSize'] ?? 5);
      this.getCurPage();
    });
  }

  loading = signal(false);

  getCurPage() {
    this.loading.set(true);

    this.service
      .fetchAllEmployees(this.pageNumber, this.pageSize, this.departmentId)
      .subscribe({
        next: (data) => {
          this.employeePage.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  nextPage() {
    if (
      this.employeePage()?.last ||
      this.pageNumber === this.employeePage()?.totalPages
    )
      return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageNumber + 1,
        pageSize: this.pageSize,
        departmentId: this.departmentId,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  prevPage() {
    if (this.employeePage()?.first || this.pageNumber <= 1) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageNumber - 1,
        pageSize: this.pageSize,
        departmentId: this.departmentId,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  onDelete(id: number) {
    this.deleteId = id;
  }

  onCancel() {
    this.deleteId = null;
  }

  onConfirm() {
    this.service.deleteEmployee(this.deleteId!).subscribe({
      next: () => {
        this.deleteId = null;
        this.getCurPage();
      },
    });
  }
}
