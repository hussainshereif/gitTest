import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmComponent } from './add-sm.component';

describe('AddSmComponent', () => {
  let component: AddSmComponent;
  let fixture: ComponentFixture<AddSmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
