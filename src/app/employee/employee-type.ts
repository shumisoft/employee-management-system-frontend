import { Department } from '../department/department-type';
import { PageResponse } from '../models/PageResponse';

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: EmployeeStatus;
  department?: Department | null;
  manager?: Partial<Employee> | null;
};

export type EmployeeRequest = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  status: EmployeeStatus;
  department?: number | null;
  manager?: number | null;
};

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type EmployeeSummary = Partial<Employee>;

export type EmployeeOrgChartResponse = {
  manager?: EmployeeSummary | null;
  employee: EmployeeSummary;
  subordinates: PageResponse<EmployeeSummary>;
};

export type EmployeeOrgChart = {
  manager?: EmployeeSummary | null;
  employee: EmployeeSummary;
  subordinates: EmployeeSummary[];
  hasMoreSubordinates: boolean;
};

export type EmployeeStatusCount = {
  active: number;
  inactive: number;
};
