import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { HelperService } from "../../../../../../app/commonservice/common/helper.service";
import { environment } from "../../../../../../environments/environment";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-collateral-create",
  templateUrl: "./collateral-create.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class CollateralCreateComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  bgValidation = { valid: true, insize: true };
  bodyFormdata: FormData = new FormData();
  BName: any;
  customise: any;
  collateralList = [
    { Value: true, Text: "Yes", selected: false },
    { Value: false, Text: "No", selected: false },
  ];
  docId: any;
  fileName: any;
  fileUrl: any;
  isText: boolean;
  isFileDuplicateName: boolean;
  isBig: boolean;
  isCustomCollateral = environment.enableCustomCollateral;
  submitted: boolean;
  typeList: { Value: string; Text: string; selected: boolean }[];
  uploadType: string[];

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CollateralCreateComponent>,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.uploadType = this.helperService.imageType;
    this.addForm = this.createFormGroup();
    this.getCollateral();
    this.typeList = [
      { Value: "TEXT", Text: "Text", selected: false },
      { Value: "IMAGE", Text: "Image", selected: false },
      { Value: "PDF", Text: "PDF", selected: false },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addMessage(text): void {
    this.addForm.controls.message.setValue(
      this.addForm.controls.message.value + " " + text
    );
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public onCustomise(value): void {
    this.customise = this.isText ? false : value;
  }

  public onCollateralType(type): void {
    if (type == "TEXT") {
      this.isText = true;
      this.addForm.value.customise = false;
      this.customise = false;
    } else {
      this.uploadType =
        type == "PDF"
          ? this.helperService.pfdType
          : this.helperService.imageType;
      this.isText = false;
      this.addForm.value.customise = this.addForm.get("customise").value;
      this.customise = this.addForm.value.customise;
    }
  }

  public saveCollateral() {
    this.submitted = true;
    if (!this.isCustomCollateral) this.addForm.patchValue({ customise: false });
    if (this.isText && this.addForm.controls.message.value == "") return;

    // if (
    //   !this.isText &&
    //   this.isCustomCollateral &&
    //   (this.addForm.controls.file.value == "" ||
    //     this.addForm.controls.customise.value == "")
    // )
    //   return;

    let collateral = this.addForm.controls;
    if (collateral.type.value == "TEXT") {
      collateral.customise.setValue(true);
    }
    let formData: FormData = new FormData();
    if (this.bodyFormdata.has("file")) {
      formData.append("file", this.bodyFormdata.get("file"));
    }

    if (!this.addForm.value.id) {
      let url =
        "sales/projectBrochure?projectId=" +
        this.data.id +
        "&name=" +
        collateral.name.value +
        "&heading=" +
        collateral.heading.value +
        "&isCustomizable=" +
        collateral.customise.value +
        "&shareMessage=" +
        collateral.message.value +
        "&type=" +
        collateral.type.value;
      this.apiService
        .postDataMultipartRaw(url, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (this.customise) {
            this.dialogRef.close({
              status: 3,
              id: res.id,
              type: collateral.type.value,
              url: res.url,
            });
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Collateral Created Successfully!"
            ).subscribe((result) => {});
            this.dialogRef.close({ status: 1 });
          }
        });
    } else {
      let url =
        "sales/projectBrochure/update?id=" +
        this.addForm.value.id +
        "&name=" +
        collateral.name.value +
        "&heading=" +
        collateral.heading.value +
        "&isCustomizable=" +
        collateral.customise.value +
        "&shareMessage=" +
        collateral.message.value +
        "&type=" +
        collateral.type.value;
      this.apiService
        .postDataMultipartRaw(url, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.apiService
            .postData(
              "sales/ProjectBrochure/publish?id=" +
                this.addForm.value.id +
                "&isPublished=false",
              ""
            )
            .subscribe((result) => {
              if (this.customise) {
                this.dialogRef.close({
                  status: 3,
                  id: res.id,
                  type: collateral.type.value,
                  url: res.url,
                });
              } else {
                AlertComponent.showAlert(
                  this.dialog,
                  "",
                  "Collateral Updated Successfully!"
                ).subscribe((result) => {});
                this.dialogRef.close({ status: 1 });
              }
            });
        });
    }
  }

  public uploadFile(fileInput: any = null): void {
    this.fileName = fileInput.target.files[0].name;
    let file = fileInput.target.files[0].name.split(".").pop();
    this.fileUrl = fileInput.target.files[0];
    this.isFileDuplicateName = false;
    if (this.bodyFormdata.has("file")) this.bodyFormdata.delete("file");
    this.bodyFormdata.append(
      "file",
      fileInput.target.files[0],
      fileInput.target.files[0].name
    );
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [],
      name: [
        "",
        [Validators.required, Validators.minLength(2)],
        Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$"),
      ],
      heading: [""],
      type: ["", [Validators.required]],
      file: ["", []],
      customise: [false],
      message: ["", [Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$")]],
    });
  }

  private getCollateral(): void {
    if (this.data.status == "update") {
      let formField = this.addForm.controls;
      let url = "user/projectBrochure/" + this.data.id;
      this.apiService
        .getData(url)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          formField.id.setValue(res.id);
          formField.name.setValue(res.name);
          formField.heading.setValue(res.heading);
          formField.type.setValue(res.type);
          formField.customise.setValue(res.customizable);
          formField.message.setValue(res.shareMessage);
          this.onCollateralType(res.type);
          this.onCustomise(res.customizable);
          if (res.url != null) {
            this.helperService.urlToFile(res.url).then((result) => {
              this.bodyFormdata.append("file", result, result.name);
              this.fileName = result.name;
              this.isFileDuplicateName = true;
              formField.file.setValue(result.name);
            });
          }
        });
    }
  }
}
