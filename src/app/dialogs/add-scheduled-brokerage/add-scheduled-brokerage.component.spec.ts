import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScheduledBrokerageComponent } from './add-scheduled-brokerage.component';

describe('AddScheduledBrokerageComponent', () => {
  let component: AddScheduledBrokerageComponent;
  let fixture: ComponentFixture<AddScheduledBrokerageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddScheduledBrokerageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScheduledBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
