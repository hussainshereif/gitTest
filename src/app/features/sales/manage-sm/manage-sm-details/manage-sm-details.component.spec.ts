import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSmDetailsComponent } from './manage-sm-details.component';

describe('ManageSmDetailsComponent', () => {
  let component: ManageSmDetailsComponent;
  let fixture: ComponentFixture<ManageSmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
