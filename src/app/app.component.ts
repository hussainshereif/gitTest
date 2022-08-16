import { Component, OnInit } from "@angular/core";

import { RemoteApisService } from "./commonservice/remote-apis.service";
import { AuthService } from "./commonservice/auth.service";
import { environment } from "../environments/environment";

import { BnNgIdleService } from "bn-ng-idle";
import { delay } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  public currentUrl: boolean;
  public isUrlInvalid: boolean = false;
  public loader: any = environment.LOADER;
  public pageLoader: boolean = true;
  public primaryColor: any = environment.PRIMARY_COLOR;
  public secondaryColor: any = environment.SECONDARY_COLOR;
  public showLoader: boolean;
  public title: string = environment.TITLE;
  constructor(
    public authenticationService: AuthService,
    public dialog: MatDialog,
    private apiservice: RemoteApisService,
    private bnIdle: BnNgIdleService
  ) {
    this.bnIdle.startWatching(300).subscribe((res) => {
      if (res) {
        authenticationService.logout();
      }
    });

    this.apiservice
      .getApiLoaderStatus()
      .pipe(delay(0))
      .subscribe((response) => {
        if (response.show) this.pageLoader = true;
        else this.pageLoader = false;
      });
  }

  ngOnInit() {
     this.endLoadFunction();
    if (window.location !== window.parent.location) {
      this.currentUrl = false;
    } else {
      this.currentUrl = true;
    }
  }

  endLoadFunction(): void {
    window.addEventListener("unload", function (e) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("userType");
      localStorage.removeItem("httpError");
      localStorage.removeItem("saltkey");
    });
  }

  onImgError(event): void {
    event.target.src = "../../" + this.loader;
  }
}
