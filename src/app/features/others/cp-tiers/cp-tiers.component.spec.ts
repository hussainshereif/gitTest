import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpTiersComponent } from './cp-tiers.component';

describe('CpTiersComponent', () => {
  let component: CpTiersComponent;
  let fixture: ComponentFixture<CpTiersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpTiersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpTiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
