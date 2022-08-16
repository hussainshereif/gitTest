import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTemplateCreateComponent } from './invoice-template-create.component';

describe('InvoiceTemplateCreateComponent', () => {
  let component: InvoiceTemplateCreateComponent;
  let fixture: ComponentFixture<InvoiceTemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTemplateCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
