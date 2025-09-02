import { Department } from '../department/department-type';

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
