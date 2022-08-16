import { Component, OnInit, Inject } from "@angular/core";
import { RemoteApisService } from "../../commonservice/remote-apis.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-failed-excel-list",
  templateUrl: "./failed-excel-list.component.html",
  styleUrls: ["./failed-excel-list.component.css"],
})
export class FailedExcelListComponent implements OnInit {
  FailedSfdc = [];
  FailedPhoneNo = [];
  IncorrectFormat = [];
  excelType: any;
  failedvalidation = [];
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FailedExcelListComponent>
  ) {
    if (this.data.FCPSfdcArray) this.FailedSfdc = this.data.FCPSfdcArray;
    if (this.data.FCPPhoneArray) this.FailedPhoneNo = this.data.FCPPhoneArray;
    if (this.data.FIncorrectFormat)
      this.IncorrectFormat = this.data.FIncorrectFormat;
    if (this.data.excelType) this.excelType = this.data.excelType;
    if (this.data.failedvalidation)
      this.failedvalidation = this.data.failedvalidation;
  }

  ngOnInit() {}
}
