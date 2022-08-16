import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTemplateListComponent } from './invoice-template-list.component';

describe('InvoiceTemplateListComponent', () => {
  let component: InvoiceTemplateListComponent;
  let fixture: ComponentFixture<InvoiceTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
