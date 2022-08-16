import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedTransferComponent } from './failed-transfer.component';

describe('FailedTransferComponent', () => {
  let component: FailedTransferComponent;
  let fixture: ComponentFixture<FailedTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
