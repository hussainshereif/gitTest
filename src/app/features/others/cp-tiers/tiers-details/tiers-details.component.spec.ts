import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiersDetailsComponent } from './tiers-details.component';

describe('TiersDetailsComponent', () => {
  let component: TiersDetailsComponent;
  let fixture: ComponentFixture<TiersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
