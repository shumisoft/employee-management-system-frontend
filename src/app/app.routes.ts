import { Routes } from '@angular/router';
import { Login } from './login/login';
import { HomePage } from './home-page/home-page';
import { Dashboard } from './dashboard/dashboard';
import { Employee } from './employee/employee';
import { Department } from './department/department';
import { DepartmentTable } from './department/department-table/department-table';
import { DepartmentForm } from './department/department-form/department-form';
import { DepartmentItemPage } from './department/department-item-page/department-item-page';
import { Register } from './register/register';
import { EmployeeTable } from './employee/employee-table/employee-table';
import { EmployeeForm } from './employee/employee-form/employee-form';
import { EmployeeItemPage } from './employee/employee-item-page/employee-item-page';
import { authGuard } from './guards/auth-guard';
import { Logout } from './logout/logout';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'logout',
    component: Logout,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    canActivate: [authGuard],
    component: HomePage,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'employee',
        component: Employee,
        children: [
          {
            path: '',
            component: EmployeeTable,
          },
          {
            path: 'add',
            component: EmployeeForm,
          },
          {
            path: ':id',
            component: EmployeeItemPage,
          },
          {
            path: ':id/edit',
            component: EmployeeForm,
          },
        ],
      },

      {
        path: 'department',
        component: Department,
        children: [
          {
            path: '',
            component: DepartmentTable,
          },
          {
            path: 'add',
            component: DepartmentForm,
          },
          {
            path: ':id',
            component: DepartmentItemPage,
          },
          {
            path: ':id/edit',
            component: DepartmentForm,
          },
        ],
      },
    ],
  },
];
