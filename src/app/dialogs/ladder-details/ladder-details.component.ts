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
  selector: "app-ladder-details",
  templateUrl: "./ladder-details.component.html",
  styleUrls: ["./ladder-details.component.css"],
})
export class LadderDetailsComponent implements OnInit {
  lad: any;
  ladderDetails = [];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LadderDetailsComponent>
  ) {}

  ngOnInit() {
    this.getLadderDetails();
  }

  getLadderDetails() {
    let body = new URLSearchParams();
    body.append("ladId", this.data.ladId);
    this.apiService
      .postDataNotJSON("brokerage/getLadderDetails", body.toString())
      .subscribe((res) => {
        this.lad = res["result"].ladder;
        this.ladderDetails = res["result"].ladder.ladderDetails;
        // console.log(this.ladderDetails);
      });
  }

  close() {
    this.dialogRef.close();
  }

  deleteLadderDetails(detailId) {
    // let pid = mdata;
    let body = new URLSearchParams();
    body.append("detailId", detailId);

    this.apiService
      .postDataNotJSON("brokerage/deleteLadderDetails", body.toString())
      .subscribe((res) => {
        //shoud check return condition here
        if (res["status"] == 1) {
          this.getLadderDetails();
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Ladder details deleted successfully!"
          ).subscribe((result) => {});
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }
}
