import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LadderDetailsComponent } from './ladder-details.component';

describe('LadderDetailsComponent', () => {
  let component: LadderDetailsComponent;
  let fixture: ComponentFixture<LadderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LadderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LadderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
