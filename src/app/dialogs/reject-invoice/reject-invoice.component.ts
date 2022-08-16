import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { RemoteApisService } from "../../commonservice/remote-apis.service";

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-reject-invoice",
  templateUrl: "./reject-invoice.component.html",
  styleUrls: ["./reject-invoice.component.css"],
})
export class RejectInvoiceComponent implements OnInit {
  public groups: any;
  public ladGroupId: any;
  public rejectForm: FormGroup;
  public submitted = false;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RejectInvoiceComponent>,
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService
  ) {}

  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ["", [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")]],
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.rejectForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.rejectForm.invalid) return;
    if (this.data.type == 1) {
      let body = new URLSearchParams();
      body.append("invoId", this.data.invoId);
      body.append("invoStatus", "2");
      body.append("invoStatusComment", this.f.reason.value.trim());
      this.apiService
        .postDataNotJSON(
          "finance/invoice/changeStatus/" +
            this.data.invoId +
            "?status=REJECTED" +
            "&statusComments=" +
            this.f.reason.value.trim(),
          ""
        )
        .subscribe((res) => {
          this.dialogRef.close();
        });
    } else if (this.data.type == 2) {
      let body = new URLSearchParams();
      body.append("busId", this.data.invoId);
      body.append("busStatus", "2");
      body.append("busStatusComment", this.f.reason.value.trim());
      this.apiService
        .postDataNotJSON("business/businessApproval", body.toString())
        .subscribe((res) => {
          this.dialogRef.close();
        });
    }
  }
}
