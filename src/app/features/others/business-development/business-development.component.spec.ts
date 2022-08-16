import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDevelopmentComponent } from './business-development.component';

describe('BusinessDevelopmentComponent', () => {
  let component: BusinessDevelopmentComponent;
  let fixture: ComponentFixture<BusinessDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
