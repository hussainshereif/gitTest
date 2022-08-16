import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-cp-group-create",
  templateUrl: "./cp-group-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class CPGroupCreateComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  bodyFormdata: FormData = new FormData();
  cpFileName: any;
  cpGroupExcel = environment.COMMON_FILES.CP_GROUP_EXCEL;
  priority = ["1", "2", "3", "4", "6", "7"];
  showDrop: boolean;
  submitted: boolean = false;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CPGroupCreateComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.createFormGroup();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.addForm.controls;
  }

  public addDetails(): void {
    this.submitted = true;
    const data = {
      name: this.addForm.value.name,
      priority: this.addForm.value.priority,
      description: this.addForm.value.name,
    };
    let formData: FormData = new FormData();
    if (this.bodyFormdata.has("file"))
      formData.append("file", this.bodyFormdata.get("file"));
    formData.append("group", JSON.stringify(data));

    if (this.addForm.valid) {
      let url = "admin/group";
      this.apiService
        .postDataMultipartRaw(url, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "CP Group Created Successfully!"
          ).subscribe((result) => {
            this.dialogRef.close();
          });
        });
    }
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.pattern("[a-zA-Z0-9., ]+"),
        ],
      ],
      priority: ["1", [Validators.required]],
      file: [""],
    });
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public uploadFile(fileInput: any = null): void {
    this.cpFileName = fileInput.target.files[0].name;
    if (this.bodyFormdata.has("file")) this.bodyFormdata.delete("file");
    this.bodyFormdata.append(
      "file",
      fileInput.target.files[0],
      fileInput.target.files[0].name
    );
  }
}
