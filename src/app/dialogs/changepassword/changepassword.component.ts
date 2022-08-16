import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { sha256 } from "js-sha256";
import { AESEncryptDecryptService } from "src/app/commonservice/aesencrypt-decrypt.service";
@Component({
  selector: "app-changepassword",
  templateUrl: "./changepassword.component.html",
  styleUrls: ["./changepassword.component.css"],
})
export class ChangepasswordComponent implements OnInit {
  constructor(
    private _AESEncryptDecryptService: AESEncryptDecryptService,
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangepasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //    dialogRef.disableClose = true;
  }

  changePasswordForm: FormGroup;

  submitted = false;
  returnUrl: string;
  error = "";
  passwordMatch = false;
  userName = localStorage.getItem("userName");

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      newpassword: [
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
      oldpassword: [
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

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.passwordMatch = false;
    this.submitted = true;
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (this.f.newpassword.value.includes(this.userName)) {
      this.passwordMatch = true;
      return;
    }

    let userId = localStorage.getItem("userId");
    let encNewPassword = this._AESEncryptDecryptService.encrypt(
      this.f.newpassword.value
    );
    let encOldPassword = this._AESEncryptDecryptService.encrypt(
      localStorage.getItem("saltkey") + this.f.oldpassword.value
    );
    // console.log(encOldPassword,"encOldPassword");
    let body = new URLSearchParams();
    body.append("oldPassword", encOldPassword);
    body.append("newPassword", encNewPassword);
    body.append("isPasswordAuth", "true");
    // let url="login/changePassword?oldPassword="+encOldPassword+"&newPassword="+encNewPassword+"&isPasswordAuth=true";
    let url = "login/changePassword";
    this.apiService
      .postDataNotJSON(url, body.toString())
      .subscribe((res: any) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Password changed successfully!"
        ).subscribe((result) => {});
        this.dialogRef.close();
      });
  }
}
