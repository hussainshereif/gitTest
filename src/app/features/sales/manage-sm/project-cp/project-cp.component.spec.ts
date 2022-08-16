import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCpComponent } from './project-cp.component';

describe('ProjectCpComponent', () => {
  let component: ProjectCpComponent;
  let fixture: ComponentFixture<ProjectCpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectCpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
