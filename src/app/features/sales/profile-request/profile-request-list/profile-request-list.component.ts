import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";

import { MatDialog } from "@angular/material/dialog";
// import { ViewProfileLogComponent } from "src/app/dialogs/view-profile-log/view-profile-log.component";
import { ViewLogComponent } from "src/app/dialogs/view-log/view-log.component";

@Component({
  selector: "app-profile-requests",
  templateUrl: "./profile-request-list.component.html",
  styleUrls: ["./profile-request-list.component.css"],
})
export class ProfileRequestsComponent implements OnInit {
  uType;
  offset: number = 0;
  offsetdb;
  recordsPerPage: any = 10;
  CPList: any = [];
  showIndex;
  sizeofTable;
  uploadStatus;
  activationList: any = [];
  activationStatus;
  requestTypes;
  pridArray: any = [];
  pridList: string;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.requestTypes = {
      1: "Email Id",
      2: "RERA Number",
      3: "RERA State",
      4: "Billing Address",
      5: "PAN Number",
      6: "Company",
    };

    this.uploadStatus = "";

    this.getCPList(this.offset);

    this.activationList = [
      { Value: 0, Text: "Pending" },
      { Value: 1, Text: "Active" },
      { Value: 3, Text: "Inactive" },
    ];
  }

  getCPList(page) {
    this.pridArray = [];
    // let body = new URLSearchParams();
    // body.append("offset", page);
    // body.append("recordsPerPage", this.recordsPerPage);
    let url =
      "admin/profileUpdateRequest/all?pageNumber=" +
      page +
      "&pageSize=" +
      10 +
      "&sortBy=&isAscending=true&userType=CHANNEL_PARTNER";
    this.apiService.getData(url).subscribe((res) => {
      this.sizeofTable = res.totalPages * 10;
      this.CPList = res.content;
    });
  }

  paginatedSearch(e) {
    // console.log(e);
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCPList(this.offsetdb);
    } else {
      let init = 0;
      this.getCPList(init);
    }
  }
  activationStatusChange(cpID, e) {
    // let body = new URLSearchParams();
    // body.append('prId', cpID);
    // body.append('action', e.target.value);
    // console.log(e,"event")
    let url =
      "admin/profileUpdateRequest/changeStatus/" +
      cpID +
      "?profileUpdateRequestStatus=" +
      e.target.value;
    this.apiService.postDataNotJSON(url, "").subscribe((res) => {
      //show notification
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Status changed successfully!!"
      ).subscribe((result) => {});
      this.offsetdb = this.offset - 1;
      if (this.offsetdb > 0) {
        this.getCPList(this.offsetdb);
      } else {
        let init = 0;
        this.getCPList(init);
      }
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
      .subscribe((res) => {
        //show notification

        this.pridArray = [];
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getCPList(this.offsetdb * 10);
        } else {
          let init = 0;
          this.getCPList(init);
        }
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
        let init = 0;
        this.getCPList(init);
      }
    });
  }
}
