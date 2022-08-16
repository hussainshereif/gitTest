import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpSmMappingListComponent } from './cp-sm-mapping-list.component';

describe('CpSmMappingListComponent', () => {
  let component: CpSmMappingListComponent;
  let fixture: ComponentFixture<CpSmMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpSmMappingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpSmMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
