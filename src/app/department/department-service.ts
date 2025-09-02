import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PageResponse } from '../models/PageResponse';
import { Department } from './department-type';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api.tokens';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  route = 'api/department';

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) private readonly uri: string
  ) {}

  fetchAllDepartments(
    pageNumber: number,
    pageSize: number
  ): Observable<PageResponse<Department>> {
    return this.http.get<PageResponse<Department>>(
      `${this.uri}/${this.route}`,
      {
        params: { page: pageNumber, pageSize },
      }
    );
  }

  fetchDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.uri}/${this.route}/${id}`);
  }

  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(`${this.uri}/${this.route}`, department);
  }

  updateDepartment(
    id: number,
    department: Partial<Department>
  ): Observable<Department> {
    return this.http.patch<Department>(
      `${this.uri}/${this.route}/${id}`,
      department
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${this.route}/${id}`);
  }
}
