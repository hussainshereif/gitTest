import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSmListComponent } from './manage-sm-list.component';

describe('ManageSmListComponent', () => {
  let component: ManageSmListComponent;
  let fixture: ComponentFixture<ManageSmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSmListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
