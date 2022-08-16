import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { HelperService } from "../../../../../../app/commonservice/common/helper.service";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-scheme-create",
  templateUrl: "./scheme-create.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class SchemeCreateComponent implements OnInit {
  addForm: FormGroup;
  bgValidation = { valid: true, insize: true };
  bodyFormdata: FormData = new FormData();
  fileName: any;
  fileUrl: string;
  isBig: boolean;
  submitted: boolean;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SchemeCreateComponent>,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.addForm = this.createFormGroup();
    if (this.data.scheme) this.getEditData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public saveScheme() {
    this.submitted = true;
    if (this.addForm.valid) {
      let formData: FormData = new FormData();
      if (this.bodyFormdata.has("file"))
        formData.append("file", this.bodyFormdata.get("file"));
      if (this.addForm.value.id) {
        formData.append("caption", this.addForm.value.caption);

        this.apiService
          .postDataMultipartRaw(
            "sales/projectScheme/update/" + this.addForm.value.id,
            formData
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Scheme Updated successfully!!"
            ).subscribe((result) => {
              this.onClose();
            });
          });
      } else {
        this.apiService
          .postDataMultipartRaw(
            "sales/projectScheme?projectId=" +
              this.data.projectId +
              "&caption=" +
              this.addForm.value.caption,
            formData
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Scheme Saved successfully!!"
            ).subscribe((result) => {
              this.onClose();
            });
          });
      }
    }
  }

  public uploadFile(fileInput: any = null): void {
    let file = fileInput.target.files[0].name.split(".").pop();
    this.fileUrl = fileInput.target.files[0];
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.bgValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        if (this.bodyFormdata.has("file")) this.bodyFormdata.delete("file");
        this.bodyFormdata.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this.fileName = fileInput.target.files[0].name;
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.bgValidation = message;
            if (this.bgValidation.insize == false) {
              this.isBig = true;
            }
          });
      }
      this.isBig = false;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  private getEditData() {
    this.addForm.patchValue(this.data.scheme);
    this.imagesController("file", this.data.scheme.imageLink);
    if (this.data.scheme.imageLink)
      this.fileName = this.data.scheme.imageLink.split("/").pop();
  }

  private imagesController(fileparam: string, fileurl: string): void {
    if (fileurl) this[fileparam] = fileurl.split("/").pop();
    if (this.bodyFormdata.has(fileparam)) {
      this.bodyFormdata.append(fileparam, this.bodyFormdata.get(fileparam));
    } else {
      if (this[fileparam] != undefined) {
        this.helperService.urlToFile(fileurl).then((res) => {
          this.bodyFormdata.append(fileparam, res, res.name);
        });
      }
    }
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      caption: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
    });
  }
}
