import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeOrgChart } from '../../employee/employee-type';

@Component({
  standalone: true,
  selector: 'app-org-chart',
  imports: [CommonModule, RouterLink],
  templateUrl: './org-chart.html',
  styleUrl: './org-chart.css',
})
export class OrgChart {
  @Input() orgChart: EmployeeOrgChart | null = null;
  @Input() loading = false;

  @Output() loadMore = new EventEmitter<void>();

  readonly Math = Math;
}
