import { Component, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

import { ConfirmationComponent } from "../confirmation/confirmation.component";
import { RemoteApisService } from "../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../app/dialogs/alert/alert.component";

@Component({
  selector: "app-view-training",
  templateUrl: "./view-training.component.html",
  styleUrls: ["./view-training.component.css"],
})
export class ViewTrainingComponent implements OnInit {
  moduleId: number;
  offset: number;
  offsetdb: number;
  recordsPerPage: number;
  trainingList: any = [];
  showMessage: boolean;
  sizeofTable: number; //need from api side for listing or cal length

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewTrainingComponent>
  ) {
    this.moduleId = this.data.moduleID;
  }

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 3;

    this.showMessage = true;

    this.getTrainingList(this.offset);
  }

  getTrainingList(page) {
    // let body = new URLSearchParams();
    // body.append('offset',page);
    // body.append('recordsPerPage', this.recordsPerPage);
    // body.append('trainingModuleId', this.moduleID);

    let data = {
      trainingModuleId: this.moduleId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "",
    };
    this.apiService
      .getDataInputValue("user/training", data)
      .subscribe((res) => {
        // console.log(res,"res");
        this.sizeofTable = res.totalPages;
        this.trainingList = res.content;
        if (this.trainingList.length <= 0) {
          this.showMessage = true;
        } else {
          this.showMessage = false;
        }
      });
  }

  paginatedSearch(e) {
    this.offset = e;
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getTrainingList(this.offsetdb);
    } else {
      let init = 0;
      this.getTrainingList(init);
    }
  }

  close() {
    this.dialogRef.close();
  }

  deleteTrainingVideo(tdata) {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this Training video?"
    ).subscribe((result) => {
      if (result.result) {
        let tid = tdata.id;
        // console.log(tdata,"delete");
        let body = new URLSearchParams();
        body.append("trainingId", tid);

        this.apiService
          .postDataNotJSON("sales/training/delete/" + tid, "")
          .subscribe((res) => {
            //shoud check return condition here
            // if (res["status"] == 1) {
            this.offsetdb = this.offset - 1;
            if (this.offsetdb > 0) {
              this.getTrainingList(this.offsetdb * 3);
            } else {
              let init = 0;
              this.getTrainingList(init);
            }
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Training video Deleted successfully!"
            ).subscribe((result) => {});
            // } else {
            //   AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
            // }
          });
      }
    });
  }
}
