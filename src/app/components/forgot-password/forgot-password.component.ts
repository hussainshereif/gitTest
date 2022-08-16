import { Component, Input, OnInit ,Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";

import { environment } from "../../../environments/environment";
import { AuthService } from "../../commonservice/auth.service";
import { AESEncryptDecryptService } from "../../commonservice/aesencrypt-decrypt.service";
import { AlertComponent } from '../../dialogs/alert/alert.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-passwords',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../css/style.css'] 
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {

@Input() token:any;
@Input() userEmail:any;

@Output() changeEmail:EventEmitter<any> = new EventEmitter();
@Output() cancelForgotPassword:EventEmitter<any> = new EventEmitter();

public errorMessage: string = "";
public forgotPasswordForm: FormGroup;
public isError: boolean = false;
public logo: any = environment.LOGO;

submitted = false;
private destroy$: Subject<void> = new Subject();

constructor(
  private _AESEncryptDecryptService: AESEncryptDecryptService,
  private auth: AuthService,
  private formBuilder: FormBuilder,
  public dialog: MatDialog   
) {}

ngOnInit() {
  this.createForm();
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

backToLogin(){
   this.changeEmail.emit();
}

backToPassword(){
  this.cancelForgotPassword.emit();
}

createForm() {
  this.forgotPasswordForm = this.formBuilder.group({
    otp: [
      "",
      [
        Validators.required,
        Validators.min(100),
        Validators.max(9999),
        Validators.minLength(4),
      ],
    ],
    newPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(
          /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&]).{8,16}$/
        ),
      ],
    ],
  });
}

get f() {
  return this.forgotPasswordForm.controls;
}

onSubmit() {
  this.submitted = true;
  this.isError = false;
  if (this.forgotPasswordForm.invalid) return;
  let headers = new HttpHeaders()
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Authorization", "Bearer " + this.token);
  let formData = this.forgotPasswordForm.controls;
  let newPassword = this._AESEncryptDecryptService.encrypt(
    formData.newPassword.value
  );

  let body = new URLSearchParams();
  body.append("oldPassword", formData.otp.value);
  body.append("newPassword", newPassword);
  body.append("isPasswordAuth", "false");
  let url = "login/changePassword";
  this.auth.login(body.toString(), url, headers).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
    let res = JSON.parse(result);
    if (res.status == "SUCCESS") {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Password changed successfully!"
      );
      this.backToLogin();
    } 
  },
  (error) => {
    this.isError = true;
    this.errorMessage = error.message;
   });
}

}
