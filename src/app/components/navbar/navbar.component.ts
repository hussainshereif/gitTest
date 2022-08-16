import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "../../commonservice/auth.service";
import { ConfirmationComponent } from "../../dialogs/confirmation/confirmation.component";
import { environment } from "../../../environments/environment";

import { BreadcrumbService } from "angular-crumbs";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["../../css/style.css", "./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public breadCrumbsArr: any = [];
  public imageUrl: string = "";
  public showCustomer = environment.showManageCustomers;
  public title: string;

  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  ngOnInit() {
    this.title = this.showCustomer
      ? "Manage Customers"
      : "Manage Channel Patners";
    this.imageUrl = localStorage.getItem("imageUrl");
    this.breadcrumbService.breadcrumbChanged.subscribe((crumbs) => {
      this.breadCrumbsArr = crumbs;
      this.title = crumbs.filter(
        (route) => route.terminal == true
      )[0].displayName;
    });
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
}
