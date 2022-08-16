import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCpListComponent } from './employee-cp-list.component';

describe('EmployeeCpListComponent', () => {
  let component: EmployeeCpListComponent;
  let fixture: ComponentFixture<EmployeeCpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
