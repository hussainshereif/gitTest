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
  selector: "app-add-normal-brokerage",
  templateUrl: "./add-normal-brokerage.component.html",
  styleUrls: ["./add-normal-brokerage.component.css"],
})
export class AddNormalBrokerageComponent implements OnInit {
  normalBaseId: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNormalBrokerageComponent>
  ) {}

  baseBrokerageForm: FormGroup;

  submitted = false;
  returnUrl: string;

  ngOnInit() {
    this.baseBrokerageForm = this.formBuilder.group({
      baseNormalPerc: [
        "",
        [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
    });
  }

  get f() {
    return this.baseBrokerageForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    //console.log(this.baseBrokerageForm.controls.baseNormalPerc.errors);
    if (this.baseBrokerageForm.invalid) return;
    if (this.data.normalBaseId == null) {
      this.normalBaseId = 0;
    } else {
      this.normalBaseId = this.data.normalBaseId;
    }
    let formData: FormData = new FormData();
    formData.append("projectId", this.data.projectId);
    formData.append("baseId", this.normalBaseId);
    formData.append("baseNormalPerc", this.f.baseNormalPerc.value);
    formData.append("baseSchedPerc", "0");
    formData.append("baseStartDate", "");
    formData.append("baseEndDate", "");
    formData.append("baseType", "1");
    formData.append("groupId", this.data.groupId);

    this.apiService
      .postDataMultipartRaw("project/addProjectBaseBrokerage", formData)
      .subscribe((res) => {
        if (res["status"] == 1) {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Normal brokerage added successfully!"
          ).subscribe((result) => {});
          this.dialogRef.close();
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
