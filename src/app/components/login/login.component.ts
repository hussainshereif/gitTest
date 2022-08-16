import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { AESEncryptDecryptService } from "../../commonservice/aesencrypt-decrypt.service";
import { AuthService } from "../../commonservice/auth.service";
import { environment } from "../../../environments/environment";

import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["../../css/style.css"],
})
export class LoginComponent implements OnInit {
  public buttonColor: any = environment.BUTTON_COLOR;
  public errorMessage: string = "";
  public emailAddress: any;
  public formUsername: boolean = true;
  public formPassword: boolean = false;
  public isCpEnabled: any = environment.showManageCPs;
  public isError: boolean = false;
  public isUrlInvalid: boolean = false;
  public logo: any = environment.LOGO;
  public loginBG: any = environment.LOGIN_BG;
  public loginUsername: FormGroup;
  public loginPassword: FormGroup;
  public mainText: string = environment.loginMainText;
  public subText: string = environment.loginSubText;
  public showForgotPassword: boolean = false;
  public submittedUsername: boolean = false;
  public submittedPassword: boolean = false;
  public username: string = "";
  public token: any;

  private clientId: string = environment.CLIENT_ID;
  private contextPath: string = environment.CONTEXT_PATH;
  private saltkey: any;

  constructor(
    private _AESEncryptDecryptService: AESEncryptDecryptService,
    private authenticationService: AuthService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    let windowOrigin = window.location.origin;
    let windowHref = window.location.href;
    if (
      localStorage.getItem("userType") != undefined ||
      windowOrigin + "/login" == windowHref ||
      windowOrigin + "/" == windowHref ||
      windowOrigin + "/" + this.contextPath + "login" == windowHref ||
      windowOrigin + "/" + this.contextPath == windowHref
    ) {
      this.isUrlInvalid = false;
    } else {
      this.isUrlInvalid = true;
    }
    this.formValidation();
    this.authenticationService.logout();
  }

  backToEmail(): void {
    this.loginPassword.reset();
    this.formUsername = true;
    this.formPassword = false;
    this.errorMessage = "";
    this.isError = false;
    this.showForgotPassword = false;
  }

  get f() {
    return this.loginUsername.controls;
  }

  cancelForgotPassword() {
    this.showForgotPassword = false;
  }

  formValidation(): void {
    this.loginUsername = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
    });

    this.loginPassword = this.formBuilder.group({
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  forgotPassword() {
    let callUrl = "login/forgotPassword?email=" + this.f.username.value;
    this.emailAddress = this.f.username.value;

    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Client-Id", this.clientId);
    this.authenticationService.login("", callUrl, headers).subscribe(
      (res) => {
        this.showForgotPassword = true;
      },
      (error) => {
        this.formUsername = true;
        this.formPassword = false;
        this.submittedPassword = false;
        this.loginPassword.reset();
      }
    );
  }

  onUsernameSubmit() {
    this.submittedUsername = true;
    this.isError = false;
    if (this.loginUsername.invalid) {
      return;
    }
    let body = new URLSearchParams();
    body.append("email", this.f.username.value);
    body.append("userRole", "");
    body.append("sendOtp", "false");
    body.append("deviceType", "");
    body.append("deviceRegistrationId", "");
    let callUrl = "login/email";
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Client-Id", this.clientId);
    this.authenticationService.login(body, callUrl, headers).subscribe(
      (data: any) => {
        let res = JSON.parse(data);
        this.username = this.f.username.value;
        this.token = res.accessToken;
        this.saltkey = res.saltKey;
        localStorage.setItem("saltkey", this.saltkey);
        this.formUsername = false;
        this.formPassword = true;
      },
      (error) => {
        this.isError = true;
        this.errorMessage = error.message;
      }
    );
  }

  onPasswordSubmit() {
    this.submittedPassword = true;
    if (this.loginPassword.invalid) {
      return;
    }
    this.isError = false;
    let password = this._AESEncryptDecryptService.encrypt(
      this.saltkey + this.p.password.value
    );
    let body = new URLSearchParams();
    body.append("password", password);
    body.append("isPasswordAuth", "true");
    let callUrl = "login/authenticate";
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + this.token)
      .set("Client-Id", this.clientId);
    this.authenticationService.login(body, callUrl, headers).subscribe(
      (data: any) => {
        let res = JSON.parse(data);
        localStorage.setItem("access_token", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("userName", res.user.name);
        localStorage.setItem("userType", res.user.activeRole);
        localStorage.setItem("imageUrl", res.user.imageUrl);
        if (environment.showManageCustomers) {
          this.router.navigate(["/manage-customers"]);
        } else {
          this.router.navigate(["/manage-CPList"]);
        }
      },
      (error) => {
        this.isError = true;
        this.errorMessage = error.message;
        this.loginPassword.reset();
      }
    );
  }

  get p() {
    return this.loginPassword.controls;
  }
}
