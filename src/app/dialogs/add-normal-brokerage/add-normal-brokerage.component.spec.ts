import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNormalBrokerageComponent } from './add-normal-brokerage.component';

describe('AddNormalBrokerageComponent', () => {
  let component: AddNormalBrokerageComponent;
  let fixture: ComponentFixture<AddNormalBrokerageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNormalBrokerageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNormalBrokerageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
