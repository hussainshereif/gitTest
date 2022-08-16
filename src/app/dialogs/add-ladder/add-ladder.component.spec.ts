import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLadderComponent } from './add-ladder.component';

describe('AddLadderComponent', () => {
  let component: AddLadderComponent;
  let fixture: ComponentFixture<AddLadderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLadderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLadderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
