import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api.tokens';
import { PageResponse } from '../models/PageResponse';
import { Employee, EmployeeOrgChart, EmployeeOrgChartResponse, EmployeeRequest } from './employee-type';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  route = 'api/employee';
  constructor(@Inject(API_URL) private readonly uri: string) {}

  fetchAllEmployees(
    pageNumber: number,
    pageSize: number,
    departmentId?: number,
  ): Observable<PageResponse<Employee>> {
    let params: any = {
      page: pageNumber - 1,
      pageSize,
    };

    if (departmentId !== undefined && departmentId !== null) {
      params.departmentId = departmentId;
    }

    return this.http.get<PageResponse<Employee>>(`${this.uri}/${this.route}`, {
      params,
    });
  }

  fetchEmployeeOrgChart(
    id: number,
    page = 0,
    pageSize = 5,
  ): Observable<EmployeeOrgChart> {
    return this.http
      .get<EmployeeOrgChartResponse>(
        `${this.uri}/${this.route}/${id}/org-chart`,
        { params: { page: page.toString(), pageSize: pageSize.toString() } },
      )
      .pipe(
        map((response) => ({
          manager: response.manager,
          employee: response.employee,
          subordinates: response.subordinates.content,
          hasMoreSubordinates: !response.subordinates.last,
        })),
      );
  }

  fetchEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.uri}/${this.route}/${id}`);
  }

  createEmployee(employee: Partial<EmployeeRequest>): Observable<Employee> {
    return this.http.post<Employee>(`${this.uri}/${this.route}`, employee);
  }

  updateEmployee(
    id: number,
    employee: Partial<EmployeeRequest>,
  ): Observable<Employee> {
    return this.http.patch<Employee>(
      `${this.uri}/${this.route}/${id}`,
      employee,
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${this.route}/${id}`);
  }
}
