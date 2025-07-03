import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { AddIconComponent } from '../components/icons/add-icon';
import { BarChartIconComponent } from '../components/icons/bar-chart-icon';
import { OrgIconComponent } from '../components/icons/org-icon';
import { PieChartIconComponent } from '../components/icons/pie-chart-icon';
import { UsersIconComponent } from '../components/icons/users-icon';
import { DepartmentService } from '../department/department-service';
import { EmployeeService } from '../employee/employee-service';
import { EmployeeStatusCount } from '../employee/employee-type';

function fetchCount(
  fetchFn: () => Observable<{ totalElements?: number }>,
  loading: WritableSignal<boolean>,
  target: WritableSignal<number>,
  onError?: (err: unknown) => void,
) {
  loading.set(true);

  fetchFn()
    .pipe(finalize(() => loading.set(false)))
    .subscribe({
      next: (data) => target.set(data?.totalElements || 0),
      error: (err) => onError?.(err),
    });
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    UsersIconComponent,
    OrgIconComponent,
    PieChartIconComponent,
    BarChartIconComponent,
    AddIconComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
  ) {}

  totalEmployees = signal(0);
  totalDepartments = signal(0);
  activeEmployees = signal(0);
  inactiveEmployees = signal(0);

  loadingDepartments = signal(false);
  loadingEmployees = signal(false);
  loadingEmployeeStatusCount = signal(false);

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchDepartments();
    this.fetchEmployeeStatusCount();
  }

  fetchEmployees() {
    fetchCount(
      () => this.employeeService.fetchAllEmployees(1, 1),
      this.loadingEmployees,
      this.totalEmployees,
      (err) =>
        console.error(
          'Something went wrong while fetching employees count!',
          err,
        ),
    );
  }

  fetchDepartments() {
    fetchCount(
      () => this.departmentService.fetchAllDepartments(1, 1),
      this.loadingDepartments,
      this.totalDepartments,
      (err) =>
        console.error(
          'Something went wrong while fetching departments count!',
          err,
        ),
    );
  }

  fetchEmployeeStatusCount() {
    this.loadingEmployeeStatusCount.set(true);

    this.employeeService
      .getEmployeeStatusCount()
      .pipe(finalize(() => this.loadingEmployeeStatusCount.set(false)))
      .subscribe({
        next: (data: EmployeeStatusCount) => {
          this.activeEmployees.set(data.active || 0);
          this.inactiveEmployees.set(data.inactive || 0);
        },
        error: (err) =>
          console.error(
            'Something went wrong while fetching employee status count!',
            err,
          ),
      });
  }

  // Computed stats
  activeRate = computed(() => {
    const total = this.activeEmployees() + this.inactiveEmployees();
    if (total === 0) return 0;
    return Math.round((this.activeEmployees() / total) * 100);
  });

  avgDeptSize = computed(() => {
    if (this.totalDepartments() === 0) return 0;
    return Math.round(this.totalEmployees() / this.totalDepartments());
  });
}
