import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBrokerageComponent } from './base-brokerage.component';

describe('BaseBrokerageComponent', () => {
  let component: BaseBrokerageComponent;
  let fixture: ComponentFixture<BaseBrokerageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseBrokerageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
