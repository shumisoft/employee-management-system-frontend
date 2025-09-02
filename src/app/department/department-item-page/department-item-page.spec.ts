import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentItemPage } from './department-item-page';

describe('DepartmentItemPage', () => {
  let component: DepartmentItemPage;
  let fixture: ComponentFixture<DepartmentItemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentItemPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
