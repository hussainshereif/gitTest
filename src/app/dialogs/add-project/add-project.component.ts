import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../commonservice/remote-apis.service";
import { AlertComponent } from "../alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  public addProjectForm: FormGroup;
  public projectList: any = [];
  public submitted: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddProjectComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formValidation();
    this.getProjectList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addSMProject() {
    this.submitted = true;
    if (this.addProjectForm.invalid) return;
    let url: string =
      "admin/sales-manager/assign-projects/" +
      this.data.id +
      "?projectIds=" +
      this.addProjectForm.controls.project.value;
    this.addProjectForm.controls.project.value;
    this.apiService
      .postData(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.status == "PARTIAL SUCCESS") {
          AlertComponent.showAlert(this.dialog, "", res.message).subscribe(
            (result) => {}
          );
        } else {
          this.close();
        }
      });
  }

  cancel(): void {
    this.dialogRef.close({ result: false });
  }

  close(): void {
    this.dialogRef.close({ result: true });
  }

  get f() {
    return this.addProjectForm.controls;
  }

  formValidation(): void {
    this.addProjectForm = this.fb.group({
      project: ["", [Validators.required]],
    });
  }

  getProjectList(): void {
    let url: string = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectList = res;
      });
  }
}
