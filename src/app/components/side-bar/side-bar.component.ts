import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../commonservice/auth.service";
import { ChangepasswordComponent } from "../../dialogs/changepassword/changepassword.component";
import { ConfirmationComponent } from "../../dialogs/confirmation/confirmation.component";
import { environment } from "../../../environments/environment";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["../../css/style.css", "./side-bar.component.css"],
})
export class SideBarComponent implements OnInit {
  public imageUrl: string = "";
  public projectName: string = environment.PROJECT_NAME;
  public title: string = environment.TITLE;
  public secondaryColor: any = environment.SECONDARY_COLOR;
  public showCP: boolean = environment.showManageCPs;
  public showCustomer: boolean = environment.showManageCustomers;
  public showBrokerage: boolean = environment.enableBrokerageCalculator;
  public enableAboutUS: boolean = environment.enableAboutUS;
  public enableSMConfig: boolean = environment.enableSMConfig;
  public sidebar_logo: any = environment.SIDE_BAR_LOGO;
  public userName: string = "";
  public userRole: string = "";

  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadScript("../../assets/js/custom.js");
    this.userName = localStorage.getItem("userName");
    this.userRole = localStorage.getItem("userType");
    this.imageUrl = localStorage.getItem("imageUrl");
  }

  logout() {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to logout?"
    ).subscribe((result) => {
      if (result.result) {
        this.authenticationService.logout();
        this.router.navigate(["login"]);
      }
    });
  }

  changePassword() {
    this.dialog.open(ChangepasswordComponent, {
      width: "480px",
    });
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement("script");
    script.innerHTML = "";
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
