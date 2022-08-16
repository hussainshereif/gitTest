import { Component, OnInit, Input } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AddLadderComponent } from "src/app/dialogs/add-ladder/add-ladder.component";
import { AddLadderDetailsComponent } from "src/app/dialogs/add-ladder-details/add-ladder-details.component";
import { LadderDetailsComponent } from "src/app/dialogs/ladder-details/ladder-details.component";

@Component({
  selector: "app-ladder",
  templateUrl: "./ladder.component.html",
  styleUrls: ["./ladder.component.css"],
})
export class LadderComponent implements OnInit {
  @Input("projectId") projectId;

  offset;
  offsetdb;
  recordsPerPage;
  ladderDetails = [];
  sizeofTable;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getLadderList(this.offset);
  }

  getLadderList(page) {
    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    body.append("ladProjectId", this.projectId);
    this.apiService
      .postDataNotJSON("brokerage/ladderList", body.toString())
      .subscribe((res) => {
        this.ladderDetails = res["result"].LadderBrokerage;
        //  this.sizeofTable=res["result"].totalRecords;
      });
  }

  addLadder() {
    let dialogRef = this.dialog.open(AddLadderComponent, {
      width: "650px",
      data: { projectId: this.projectId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getLadderList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getLadderList(init);
      }
    });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getLadderList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getLadderList(init);
    }
  }

  deleteLadder(ladderId) {
    // let pid = mdata;

    let body = new URLSearchParams();
    body.append("ladId", ladderId);

    this.apiService
      .postDataNotJSON("brokerage/deleteLadder", body.toString())
      .subscribe((res) => {
        //shoud check return condition here
        if (res["status"] == 1) {
          let init = 0;
          this.getLadderList(init);
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Ladder deleted successfully!"
          ).subscribe((result) => {});
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }

  addLadderRange(ladId) {
    let dialogRef = this.dialog.open(AddLadderDetailsComponent, {
      width: "650px",
      data: { ladId: ladId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getLadderList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getLadderList(init);
      }
    });
  }

  listLadderDetails(ladId) {
    let dialogRef = this.dialog.open(LadderDetailsComponent, {
      width: "650px",
      data: { ladId: ladId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getLadderList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getLadderList(init);
      }
    });
  }

  editLadderRange(ladId, ladName, startDate, endDate, groupId) {
    let dialogRef = this.dialog.open(AddLadderComponent, {
      width: "650px",
      data: {
        ladId: ladId,
        ladName: ladName,
        ladStartDate: startDate,
        ladEndDate: endDate,
        projectId: this.projectId,
        groupId: groupId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getLadderList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getLadderList(init);
      }
    });
  }
}
