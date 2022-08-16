import { ThisReceiver } from "@angular/compiler";
import { Component, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { HelperService } from "../../../../../../app/commonservice/common/helper.service";
import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-builder-details-create",
  templateUrl: "./builder-details-create.component.html",
  styleUrls: ["./builder-details-create.component.css"],
})
export class BuilderDetailsCreateComponent implements OnInit {
  addForm: FormGroup;
  bodyFormdata: FormData = new FormData();
  contentTypeList: { Value: string; Text: string; selected: boolean }[];
  type: any;
  pfdType: string[];
  imageType: string[];
  tempLink:string;
  videoType: string[];
  uploadType: string[];

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BuilderDetailsCreateComponent>,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.contentTypeList = this.helperService.contentTypeList;
    this.uploadType = this.helperService.imageType;
    this.addForm = this.createFormGroup();
    if (this.data.title) {
      this.addForm.patchValue(this.data);
      this.addForm.patchValue({
        link: this.data.contentUrl,
        thumbnailImage: this.data.imageUrl,
      });
      if (this.data.contentType !== "WEBSITE")
        this.addForm.patchValue({ content: this.data.contentUrl });
    }
  }

  public onContentTypeChange(e): void {
    this.uploadType = this.helperService.onContentTypeChange(e);
    if(e=='Link' && this.data.id > 0 && this.addForm.value.link){
      this.tempLink=this.addForm.value.link;
      this.addForm.patchValue({ link: "" });
    }
  }

  public addFile(fileInput: any = null, fileType): void {
    if (this.bodyFormdata.has(fileType)) this.bodyFormdata.delete(fileType);
    this.bodyFormdata.append(
      fileType,
      fileInput.target.files[0],
      fileInput.target.files[0].name
    );
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public addDetails(): void {
    if(this.addForm.value.contentType=='WEBSITE' &&this.addForm.value.link==''&& this.tempLink!=""){
      this.addForm.patchValue({ link: this.tempLink });
    }
    this.addForm.value.submitted = 1;
    let formData: FormData = new FormData();
    formData = this.helperService.getFormData(
      formData,
      this.addForm,
      this.bodyFormdata
    );
    if (this.addForm.valid) {
      if (this.addForm.value.id) {
        let url = "user/about/builderDetail";
        if (!this.bodyFormdata.has("thumbnailImage"))
          formData.delete("thumbnailImage");
        if (
          this.addForm.value.contentType !== "WEBSITE" &&
          !this.bodyFormdata.has("content")
        ) {
          formData.delete("contentType");
        }
        this.apiService
          .postDataMultipartRaw(url + "/" + this.addForm.value.id, formData)
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Builder Details Updated Successfully!"
            ).subscribe((result) => {
              this.dialogRef.close();
            });
          });
      } else {
        let url = "user/about/builderDetail";
        this.apiService.postDataMultipartRaw(url, formData).subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Builder Details Created Successfully!"
          ).subscribe((result) => {
            this.dialogRef.close();
          });
        });
      }
    }
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      content: [""],
      contentType: ["", [Validators.required]],
      description: ["", [Validators.required]],
      link: [""],
      thumbnailImage: ["", [Validators.required]],
      title: ["", [Validators.required]],
      submitted: [""],
    });
  }
}
