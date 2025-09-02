import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api.tokens';
import { PageResponse } from '../models/PageResponse';
import { Employee, EmployeeRequest } from './employee-type';
import { Observable } from 'rxjs';

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
    departmentId?: number
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

  fetchEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.uri}/${this.route}/${id}`);
  }

  createEmployee(employee: Partial<EmployeeRequest>): Observable<Employee> {
    return this.http.post<Employee>(`${this.uri}/${this.route}`, employee);
  }

  updateEmployee(
    id: number,
    employee: Partial<EmployeeRequest>
  ): Observable<Employee> {
    return this.http.patch<Employee>(
      `${this.uri}/${this.route}/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${this.route}/${id}`);
  }
}
