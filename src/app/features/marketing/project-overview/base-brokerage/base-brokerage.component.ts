import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { Input } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AddScheduledBrokerageComponent } from "src/app/dialogs/add-scheduled-brokerage/add-scheduled-brokerage.component";
import { AddNormalBrokerageComponent } from "src/app/dialogs/add-normal-brokerage/add-normal-brokerage.component";

@Component({
  selector: "app-base-brokerage",
  templateUrl: "./base-brokerage.component.html",
  styleUrls: ["./base-brokerage.component.css"],
})
export class BaseBrokerageComponent implements OnInit {
  @Input("projectId") projectId;
  normBrok: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  baseBrokerageForms: FormGroup;

  groupBrokerageList: any;
  normalBaseId: any;

  ngOnInit() {
    this.getBaseBrokerageList();

    this.baseBrokerageForms = this.formBuilder.group({
      baseNormalPerc: [
        { value: "", disabled: true },
        [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
    });
  }
  // get f() { return this.baseBrokerageForm.controls; }

  getBaseBrokerageList() {
    let body = new URLSearchParams();
    body.append("projectId", this.projectId);
    this.apiService
      .postDataNotJSON("project/projectBaseBrokerageList", body.toString())
      .subscribe((res) => {
        if (res["result"].groupListBaseBrokerage) {
          // console.log(res);
          this.groupBrokerageList = res["result"].groupListBaseBrokerage;
          this.groupBrokerageList.forEach((valueData, index) => {
            let inc = valueData.groupId;
            this.baseBrokerageForms.addControl(
              "baseNormalPerc" + inc,
              new FormControl(
                { value: "", disabled: true },
                Validators.required
              )
            );
            this.normBrok =
              this.groupBrokerageList[index].baseIncentive.baseNormalPerc;
            if (this.normBrok == null) {
              this.normBrok = 0;
            }
            this.baseBrokerageForms.controls["baseNormalPerc" + inc].setValue(
              this.normBrok
            );
          });
        }
      });
  }

  addScheduledBrokeragePopup() {
    let dialogRef = this.dialog.open(AddScheduledBrokerageComponent, {
      width: "600px",
      data: { projectId: this.projectId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getBaseBrokerageList();
    });
  }

  addNormalBrokeragePopup(groupId, normalBaseId) {
    let dialogRef = this.dialog.open(AddNormalBrokerageComponent, {
      width: "600px",
      data: {
        projectId: this.projectId,
        normalBaseId: normalBaseId,
        groupId: groupId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getBaseBrokerageList();
    });
  }

  cancelScheduleBrokerage(baseId) {
    let body = new URLSearchParams();
    body.append("baseId", baseId);
    this.apiService
      .postDataNotJSON("admin/projectBrokerage/delete", body.toString())
      .subscribe((res) => {
        if (res["status"] == 1) {
          this.getBaseBrokerageList();
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Deleted successfully!"
          ).subscribe((result) => {});
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }
}
