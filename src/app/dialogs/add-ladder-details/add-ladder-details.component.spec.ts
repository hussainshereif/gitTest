import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLadderDetailsComponent } from './add-ladder-details.component';

describe('AddLadderDetailsComponent', () => {
  let component: AddLadderDetailsComponent;
  let fixture: ComponentFixture<AddLadderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLadderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLadderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
