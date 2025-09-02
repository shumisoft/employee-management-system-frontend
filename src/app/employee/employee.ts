import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
})
export class Employee {}
