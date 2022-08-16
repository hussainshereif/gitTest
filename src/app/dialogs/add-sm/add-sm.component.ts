import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../commonservice/remote-apis.service";
import { AlertComponent } from "../../dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-add-sm",
  templateUrl: "./add-sm.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AddSmComponent implements OnInit, OnDestroy {
  addSMForm: FormGroup;
  headingText: string = "Add SM";
  submitted: boolean = false;
  subText: string = "Create new SM";

  private destroy$: Subject<void> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    public dialogRef: MatDialogRef<AddSmComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formValidation();
    if (this.data.type == 2) {
      this.headingText = "Edit SM";
      this.getSMData(this.data.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.addSMForm.controls;
  }

  formValidation() {
    this.addSMForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(125),
          Validators.pattern("[a-zA-Z0-9. ]+"),
        ],
      ],
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      // dialCode:["",[Validators.required]],
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          ,
          Validators.maxLength(20),
        ],
      ],
    });
  }

  getSMData(id) {
    let formData = this.data.content;
    this.addSMForm.controls.email.setValue(formData.email);
    this.addSMForm.controls.mobile.setValue(formData.mobileNumber);
    this.addSMForm.controls.name.setValue(formData.name);
  }

  onCancel() {
    this.dialogRef.close({ result: false });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.addSMForm.valid) return;

    let inputData = {
      name: this.addSMForm.controls.name.value,
      email: this.addSMForm.controls.email.value,
      mobileNumber: this.addSMForm.controls.mobile.value,
    };
    let url =
      this.data.type === 1
        ? "admin/sales-manager"
        : "admin/sales-manager/update/" + this.data.id;
    this.apiService
      .postData(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "SM saved successfully!"
        ).subscribe((result) => {
          this.dialogRef.close({ result: true });
        });
      });
  }
}
