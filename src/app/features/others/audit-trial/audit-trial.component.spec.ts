import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditTrialComponent } from './audit-trial.component';

describe('AuditTrialComponent', () => {
  let component: AuditTrialComponent;
  let fixture: ComponentFixture<AuditTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
