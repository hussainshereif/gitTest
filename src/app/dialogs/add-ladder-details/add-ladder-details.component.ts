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
  selector: "app-add-ladder-details",
  templateUrl: "./add-ladder-details.component.html",
  styleUrls: ["./add-ladder-details.component.css"],
})
export class AddLadderDetailsComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddLadderDetailsComponent>
  ) {}

  addLadderDetailsForm: FormGroup;

  submitted = false;
  returnUrl: string;
  error = "";
  ngOnInit() {
    this.addLadderDetailsForm = this.formBuilder.group({
      startRange: [
        "",
        [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
      endRange: [
        "",
        [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
      ladValue: [
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
    return this.addLadderDetailsForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.addLadderDetailsForm.invalid) return;

    let formData: FormData = new FormData();
    formData.append("ladId", this.data.ladId);
    formData.append("detailId", "0");
    formData.append("ladValue", this.f.ladValue.value);
    formData.append("startRange", this.f.startRange.value);
    formData.append("endRange", this.f.endRange.value);

    this.apiService
      .postDataMultipartRaw("brokerage/addorUpdateLadderDetails", formData)
      .subscribe((res) => {
        if (res["status"] == 1) {
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
