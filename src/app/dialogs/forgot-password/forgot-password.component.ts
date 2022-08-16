import { Component, OnInit, Inject } from "@angular/core";
import { RemoteApisService } from "../../commonservice/remote-apis.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/commonservice/auth.service";
import { HttpHeaders } from "@angular/common/http";
import { AlertComponent } from "../alert/alert.component";
import { AESEncryptDecryptService } from "src/app/commonservice/aesencrypt-decrypt.service";
@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    private auth: AuthService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private router: Router,
    private _AESEncryptDecryptService: AESEncryptDecryptService
  ) {}

  ngOnInit() {
    this.formValidation();
  }
  formValidation() {
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
    if (this.forgotPasswordForm.invalid) return;

    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + this.data.token);
    let formData = this.forgotPasswordForm.controls;
    let newPassword = this._AESEncryptDecryptService.encrypt(
      formData.newPassword.value
    );
    // let url="login/changePassword?oldPassword="+formData.otp.value+"&newPassword="+newPassword+"&isPasswordAuth=false";
    let body = new URLSearchParams();
    body.append("oldPassword", formData.otp.value);
    body.append("newPassword", newPassword);
    body.append("isPasswordAuth", "false");
    let url = "login/changePassword";
    this.auth.login(body.toString(), url, headers).subscribe((result: any) => {
      let res = JSON.parse(result);
      if (res.status == "SUCCESS") {
        // console.log(res,"success")
        this.dialogRef.close({ result: true });
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Password changed successfully!"
        );
      } else {
        // console.log(res,"fail")
        this.dialogRef.close({ result: false });
        AlertComponent.showAlert(this.dialog, "", res.message);
      }
    });
  }
}
