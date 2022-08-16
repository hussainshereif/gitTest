import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-profile-requests",
  templateUrl: "./profile-request-list.component.html",
  styleUrls: ["./profile-request-list.component.css"],
})
export class ProfileRequestsComponent implements OnInit, OnDestroy {
  activationList: any = [
    { Value: 0, Text: "Pending" },
    { Value: 1, Text: "Active" },
    { Value: 3, Text: "Inactive" },
  ];
  cpList: any = [];
  offset: number = 0;
  offsetdb: number = 0;
  pridArray: any = [];
  pridList: string;
  recordsPerPage: any = 10;
  requestTypes: any = {
    1: "Email Id",
    2: "RERA Number",
    3: "RERA State",
    4: "Billing Address",
    5: "PAN Number",
    6: "Company",
  };
  sizeOftable: number = 0;
  uploadStatus: string = "";

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCPList(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCPList(page) {
    this.pridArray = [];
    let url =
      "admin/profileUpdateRequest/all?pageNumber=" +
      page +
      "&pageSize=" +
      10 +
      "&sortBy=&isAscending=true&userType=CUSTOMER";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.sizeOftable = res.totalPages * 10;
        this.cpList = res.content;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCPList(this.offsetdb);
    } else {
      this.getCPList(0);
    }
  }

  activationStatusChange(cpID, e) {
    let url =
      "admin/profileUpdateRequest/changeStatus/" +
      cpID +
      "?profileUpdateRequestStatus=" +
      e.target.value;
    this.apiService
      .postDataNotJSON(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        //show notification
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.paginatedSearch(this.offset);
      });
  }

  addPrId(prId) {
    if (this.pridArray.includes(prId)) {
      this.pridArray.splice(this.pridArray.indexOf(prId), 1);
    } else {
      this.pridArray.push(prId);
    }
  }

  activationOrDecline(status) {
    let body = new URLSearchParams();
    this.pridList = this.pridArray.toString();
    body.append("prId", this.pridList);
    body.append("action", status);
    this.apiService
      .postDataNotJSON("cpUser/manageProfileRequest", body.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        //show notification

        this.pridArray = [];
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.paginatedSearch(this.offset);
      });
  }

  viewLog() {
    this.pridArray = [];
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: {
        type: "User",
        offset: this.offset,
        recordsPerPage: this.recordsPerPage,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getCPList(this.offsetdb * 10);
      } else {
        this.getCPList(0);
      }
    });
  }
}
