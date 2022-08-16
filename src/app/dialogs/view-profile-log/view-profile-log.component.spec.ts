import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileLogComponent } from './view-profile-log.component';

describe('ViewProfileLogComponent', () => {
  let component: ViewProfileLogComponent;
  let fixture: ComponentFixture<ViewProfileLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProfileLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProfileLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
