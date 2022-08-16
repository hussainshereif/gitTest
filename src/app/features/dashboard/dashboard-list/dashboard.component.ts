import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../../../css/style.css", "./dashboard.component.css"],
})
export class DashBoardComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject();
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickAdopt(): void {
    let url = "user/enquiry/client-app-adoption-report";
    this.apiService
      .postData(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "The report is being processed. It will be emailed to your email address as an attachment once it is ready. Thank you!"
        );
      });
  }

  onClickFunnel(): void {
    let url = "user/enquiry/leadfunnel-report";
    this.apiService
      .postData(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "The report is being processed. It will be emailed to your email address as an attachment once it is ready. Thank you!"
        );
      });
  }

  onClickPopup(): void {
    AlertComponent.showAlert(this.dialog, "", "Coming soon.");
  }
}
