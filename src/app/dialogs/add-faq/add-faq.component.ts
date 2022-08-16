import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Inject } from "@angular/core";
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
  selector: "app-add-faq",
  templateUrl: "./add-faq.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AddFAQComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddFAQComponent>
  ) {
    //    dialogRef.disableClose = true;
  }

  addFAQForm: FormGroup;
  error = "";
  isSave: boolean = false;
  projectId: any;
  returnUrl: string;
  submitted = false;

  ngOnInit() {
    this.addFAQForm = this.formBuilder.group({
      question: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("[a-zA-Z0-9., ]+"),
        ],
      ],
      answer: [
        "",
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern("[a-zA-Z0-9., ]+"),
        ],
      ],
    });
    if (this.data.type == 2) {
      this.getSMData(this.data.id);
    }
    this.projectId = this.data.projectId;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.addFAQForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.submitted = true;
    if (this.addFAQForm.invalid) return;
    this.isSave = true;
    if (this.data.type == 2) {
      let fid = this.data.id;
      let faqData = {
        question: this.f.question.value,
        answer: this.f.answer.value,
      };
      this.apiService
        .postData("user/projectFaq/update?id=" + fid, faqData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.showAlert();
        });
    } else {
      let faqData = {
        id: 0,
        question: this.f.question.value,
        answer: this.f.answer.value,
      };

      this.apiService
        .postData("user/projectFaq?projectId=" + this.projectId, faqData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.showAlert();
        });
    }
  }

  getSMData(id) {
    let formData = this.data.content;
    this.addFAQForm.controls.question.setValue(formData.question);
    this.addFAQForm.controls.answer.setValue(formData.answer);
  }

  showAlert() {
    AlertComponent.showAlert(
      this.dialog,
      "",
      "Data has been saved successfully"
    );
    this.isSave = false;
    this.dialogRef.close({ result: true });
  }

  close() {
    this.dialogRef.close();
  }
}
