import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteConfirmationModal } from '../../components/delete-confirmation-modal/delete-confirmation-modal';
import { OrgChart } from '../../components/org-chart/org-chart';
import { AuthService } from '../../services/auth-service';
import { EmployeeService } from '../employee-service';
import { Employee } from '../employee-type';
import { EmployeeOrgChart, EmployeeStatus } from './../employee-type';

@Component({
  selector: 'app-employee-item-page',
  imports: [CommonModule, RouterLink, DeleteConfirmationModal, OrgChart],
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

  orgChart = signal<EmployeeOrgChart | null>(null);
  orgPage = signal(0);
  orgPageSize = 5;
  loadingOrgChart = false;

  ngOnInit(): void {
    this.isAdmin.set(this.authServie.isAdmin());

    this.route.params.subscribe((data) => {
      this.curId = data?.['id'];

      // Reset pagination when switching employees
      this.orgPage.set(0);
      this.orgChart.set(null);

      this.fetchEmployee();
      this.fetchOrgChart();
    });
  }

  fetchEmployee() {
    this.service.fetchEmployee(this.curId).subscribe({
      next: (data) => this.employee.set(data),
    });
  }

  fetchOrgChart() {
    this.loadingOrgChart = true;

    this.service
      .fetchEmployeeOrgChart(this.curId, this.orgPage(), this.orgPageSize)
      .subscribe({
        next: (data) => {
          const currentOrgChart = this.orgChart();

          if (this.orgPage() === 0 || !currentOrgChart) {
            // First page - replace everything
            this.orgChart.set(data);
          } else {
            // Subsequent pages - append subordinates
            this.orgChart.set({
              ...data,
              subordinates: [
                ...currentOrgChart.subordinates,
                ...data.subordinates,
              ],
            });
          }

          console.log(this.orgChart());

          this.loadingOrgChart = false;
        },
        error: () => {
          this.loadingOrgChart = false;
        },
      });
  }

  loadMoreSubordinates() {
    if (this.loadingOrgChart) return; // Prevent double-click

    this.orgPage.set(this.orgPage() + 1);
    this.fetchOrgChart();
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
