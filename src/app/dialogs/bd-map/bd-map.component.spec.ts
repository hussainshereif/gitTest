import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BdMapComponent } from './bd-map.component';

describe('BdMapComponent', () => {
  let component: BdMapComponent;
  let fixture: ComponentFixture<BdMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BdMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BdMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
