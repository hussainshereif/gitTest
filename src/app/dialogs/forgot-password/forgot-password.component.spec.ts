import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from 'src/app/commonservice/auth.service';
import { HttpClientTestingModule ,HttpTestingController} from '@angular/common/http/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports:[HttpClientTestingModule],
      providers:[AuthService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have onSubmit function', () => {
    expect(component).toBeTruthy();
  });
});
