import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

@Component({
  selector: "app-view-profile-log",
  templateUrl: "./view-profile-log.component.html",
  styleUrls: ["./view-profile-log.component.css"],
})
export class ViewProfileLogComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  logList = [];
  showIndex;
  sizeofTable;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewProfileLogComponent>
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getStatusList(this.offset);
  }

  getStatusList(page) {
    // console.log("get")
    // let body = new URLSearchParams();
    // body.append('offset', page);
    // body.append('recordsPerPage', this.recordsPerPage);
    this.apiService
      .getData("user/profileUpdateRequest/allPending")
      .subscribe((res) => {
        // console.log(res, "res");
        this.sizeofTable = res["result"].totalRecords;
        this.logList = res["result"].ProfileRequestStatusList;
      });
  }
  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getStatusList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getStatusList(init);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
