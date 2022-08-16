import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedSMComponent } from './selected-sm.component';

describe('SelectedSMComponent', () => {
  let component: SelectedSMComponent;
  let fixture: ComponentFixture<SelectedSMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedSMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedSMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
