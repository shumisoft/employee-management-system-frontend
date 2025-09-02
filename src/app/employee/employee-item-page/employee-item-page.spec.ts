import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeItemPage } from './employee-item-page';

describe('EmployeeItemPage', () => {
  let component: EmployeeItemPage;
  let fixture: ComponentFixture<EmployeeItemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeItemPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
