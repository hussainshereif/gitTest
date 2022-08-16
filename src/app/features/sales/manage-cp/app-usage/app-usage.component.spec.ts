import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsageComponent } from './app-usage.component';

describe('AppUsageComponent', () => {
  let component: AppUsageComponent;
  let fixture: ComponentFixture<AppUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
