import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../app/dialogs/alert/alert.component";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-add-collateral",
  templateUrl: "./add-collateral.component.html",
  styleUrls: ["./add-collateral.component.css"],
})
export class AddCollateralComponent implements OnInit {
  collateralForm: FormGroup;
  customise: boolean = false;
  bodyFormdata: FormData = new FormData();
  fileName: any;
  isText: boolean = false;
  isFileDuplicateName: boolean = false;
  isCustomCollateral = environment.enableCustomCollateral;
  submitted: boolean = false;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCollateralComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.validation();
    this.getCollateral();
  }

  private validation(): void {
    this.collateralForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.minLength(2)],
        Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$"),
      ],
      type: ["", [Validators.required]],
      file: ["", []],
      customise: [""],
      message: ["", [Validators.pattern("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$")]],
    });
  }

  get f() {
    return this.collateralForm.controls;
  }

  public onSubmit(): void {
    this.submitted = true;

    if (!this.isCustomCollateral)
      this.collateralForm.patchValue({ customise: false });
    if (this.collateralForm.invalid) {
      return;
    }
    if (this.isText && this.collateralForm.controls.message.value == "") return;
    if (
      !this.isText &&
      this.isCustomCollateral &&
      (this.collateralForm.controls.file.value == "" ||
        this.collateralForm.controls.customise.value == "")
    )
      return;

    let collateral = this.collateralForm.controls;
    if (collateral.type.value == "TEXT") {
      collateral.customise.setValue(true);
    }
    let formData: FormData = new FormData();
    if (this.bodyFormdata.has("file")) {
      formData.append("file", this.bodyFormdata.get("file"));
    }

    if (this.data.status == "new") {
      let url =
        "sales/projectBrochure?projectId=" +
        this.data.id +
        "&name=" +
        collateral.name.value +
        "&isCustomizable=" +
        collateral.customise.value +
        "&shareMessage=" +
        collateral.message.value +
        "&type=" +
        collateral.type.value;
      this.apiService.postDataMultipartRaw(url, formData).subscribe((res) => {
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
        this.data.id +
        "&name=" +
        collateral.name.value +
        "&isCustomizable=" +
        collateral.customise.value +
        "&shareMessage=" +
        collateral.message.value +
        "&type=" +
        collateral.type.value;
      this.apiService.postDataMultipartRaw(url, formData).subscribe((res) => {
        this.apiService
          .postData(
            "sales/ProjectBrochure/publish?id=" +
              this.data.id +
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

  public onCustomise(value): void {
    this.customise = this.isText ? false : value;
  }

  public addFile(fileInput: any = null): void {
    this.isFileDuplicateName = false;
    if (this.bodyFormdata.has("file")) this.bodyFormdata.delete("file");
    this.bodyFormdata.append(
      "file",
      fileInput.target.files[0],
      fileInput.target.files[0].name
    );
  }

  public onCollateralType(type): void {
    if (type == "TEXT") {
      this.isText = true;
      this.collateralForm.value.customise = false;
      this.customise = false;
    } else {
      this.isText = false;
      this.collateralForm.value.customise =
        this.collateralForm.get("customise").value;
      this.customise = this.collateralForm.value.customise;
    }
  }

  public cpNameButton(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value + " " + "CP NAME PLACEHOLDER"
    );
  }

  public cpComapnyNameButton(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value +
        " " +
        "CP COMPANY NAME PLACEHOLDER"
    );
  }

  public cpAddressButton(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value +
        " " +
        "CP ADDRESS PLACEHOLDER"
    );
  }

  public cpRaraNumberButton(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value +
        " " +
        "CP RERA NO. PLACEHOLDER"
    );
  }

  public cpAccountOwnerName(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value + " " + "CP ACCOUNT OWNER NAME"
    );
  }

  public cpPhoneNumber(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value + " " + "CP PHONE PLACEHOLDER"
    );
  }

  public cpEmail(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value + " " + "CP E-MAIL PLACEHOLDER"
    );
  }

  public cpWebsite(): void {
    this.collateralForm.controls.message.setValue(
      this.collateralForm.controls.message.value +
        " " +
        "CP WEBSITE PLACEHOLDER"
    );
  }

  async urlToFile(url: any) {
    let fileName = url.split("/").pop();
    let typeName = "image/" + url.split(".").pop();
    let fetchUrl = await fetch(url);
    let content = await fetchUrl.blob();
    let fileInput = new File([content], fileName, {
      type: typeName,
      lastModified: Date.now(),
    });
    return fileInput;
  }

  private getCollateral(): void {
    if (this.data.status == "update") {
      let formField = this.collateralForm.controls;
      let url = "user/projectBrochure/" + this.data.id;
      this.apiService.getData(url).subscribe((res) => {
        formField.name.setValue(res.name);
        formField.type.setValue(res.type);
        let customizable = res.customizable.toString();
        formField.customise.setValue(customizable);
        formField.message.setValue(res.shareMessage);
        this.onCollateralType(res.type);
        this.onCustomise(res.customizable);
        if (res.url != null) {
          this.urlToFile(res.url).then((result) => {
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
