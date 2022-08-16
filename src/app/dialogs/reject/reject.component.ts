import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-reject",
  templateUrl: "./reject.component.html",
  styleUrls: ["./reject.component.css"],
})
export class RejectComponent implements OnInit {
  rejectForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RejectComponent>
  ) {}

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")]],
    });
  }
  get f() {
    return this.rejectForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // console.log(this.rejectForm.controls.reason.invalid);
    if (this.rejectForm.invalid) return;
    this.apiService
      .postDataNotJSON(
        "admin/document/change-status/" +
          this.data.id +
          "?status=REJECTED&rejectionReason=" +
          this.f.reason.value.trim(),
        ""
      )
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Rejected"
        ).subscribe((result) => {});
        this.dialogRef.close();
      });
  }
}
