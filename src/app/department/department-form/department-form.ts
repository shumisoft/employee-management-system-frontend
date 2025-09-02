import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Department } from '../department-type';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../department-service';

@Component({
  selector: 'app-department-form',
  imports: [FormsModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm implements OnInit {
  department = signal<Partial<Department>>({
    name: '',
    description: '',
  });

  departmentId?: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: DepartmentService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.departmentId = data?.['id'];
    });

    if (this.departmentId) this.getdepartment();
  }

  getdepartment() {
    this.service.fetchDepartment(this.departmentId!).subscribe({
      next: (data) => {
        this.department.set(data);
      },
    });
  }

  onSubmit() {
    if (this.departmentId) {
      this.service
        .updateDepartment(this.departmentId, this.department())
        .subscribe({
          next: () => {
            this.router.navigate(['department', this.departmentId]);
          },
        });
    } else {
      this.service.createDepartment(this.department()).subscribe({
        next: (created) => {
          this.router.navigate(['department', created.id]);
        },
      });
    }
  }

  onCancel() {
    if (this.departmentId)
      this.router.navigate(['department', this.departmentId]);
    else this.router.navigate(['/department']);
  }
}
