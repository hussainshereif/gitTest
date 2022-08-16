import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

@Component({
  selector: "app-view-training",
  templateUrl: "./view-training.component.html",
  styleUrls: ["./view-training.component.css"],
})
export class ViewTrainingComponent implements OnInit {
  moduleID;

  offset;
  offsetdb;
  recordsPerPage;
  trainingList = [];
  showMessage: boolean;
  sizeofTable; //need from api side for listing or cal length
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewTrainingComponent>
  ) {
    this.moduleID = this.data.moduleID;
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
      trainingModuleId: this.moduleID,
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
}
