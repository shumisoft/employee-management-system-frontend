import { Component, OnInit, signal } from '@angular/core';
import { Department } from '../department-type';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../department-service';
import { CommonModule } from '@angular/common';
import { PageResponse } from '../../models/PageResponse';
import { DeleteConfirmationModal } from '../../components/delete-confirmation-modal/delete-confirmation-modal';

@Component({
  selector: 'app-department-table',
  imports: [RouterLink, CommonModule, DeleteConfirmationModal],
  templateUrl: './department-table.html',
  styleUrl: './department-table.css',
})
export class DepartmentTable implements OnInit {
  curPage: number = 1;
  curSize: number = 5;
  departmentPage = signal<PageResponse<Department> | null>(null);

  deleteId: number | null = null;

  constructor(
    private readonly service: DepartmentService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => {
      this.curPage = Number(data?.['page'] ?? 1);
      this.curSize = Number(data?.['pageSize'] ?? 5);
      this.getCurPage();
    });
  }

  getCurPage() {
    this.service.fetchAllDepartments(this.curPage - 1, this.curSize).subscribe({
      next: (data) => {
        this.departmentPage.set(data);
      },
    });
  }

  nextPage() {
    if (
      this.departmentPage()?.last ||
      this.curPage === this.departmentPage()?.totalPages
    )
      return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: Number(this.curPage) + 1, pageSize: this.curSize },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  prevPage() {
    if (this.departmentPage()?.first || this.curPage <= 1) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.curPage - 1, pageSize: this.curSize },
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
    this.service.deleteDepartment(this.deleteId!).subscribe({
      next: () => {
        this.deleteId = null;
        this.getCurPage();
      },
    });
  }
}
