import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectInvoiceComponent } from './reject-invoice.component';

describe('RejectInvoiceComponent', () => {
  let component: RejectInvoiceComponent;
  let fixture: ComponentFixture<RejectInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
