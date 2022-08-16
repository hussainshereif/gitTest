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
  selector: "app-news-create",
  templateUrl: "./news-create.component.html",
  styleUrls: ["./news-create.component.css"],
})
export class NewsCreateComponent implements OnInit {
  addForm: FormGroup;
  bodyFormdata: FormData = new FormData();
  contentTypeList: { Value: string; Text: string; selected: boolean }[];
  imageType: string[];
  pfdType: string[];
  tempLink:string;
  type: any;
  uploadType: string[];
  videoType: string[];

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewsCreateComponent>,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
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

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      contentType: ["", [Validators.required]],
      content: [""],
      link: [""],
      description: ["", [Validators.required]],
      thumbnailImage: ["", [Validators.required]],
      title: ["", [Validators.required]],
      submitted: [""],
    });
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
    if(this.data.id > 0 && this.addForm.value.link){
      this.tempLink=this.addForm.value.link;
      this.addForm.patchValue({ link: "" });
    }
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
        let url = "user/about/news";
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
              "News Updated Successfully!"
            ).subscribe((result) => {
              this.dialogRef.close();
            });
          });
      } else {
        let url = "user/about/news";
        this.apiService.postDataMultipartRaw(url, formData).subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "News Created Successfully!"
          ).subscribe((result) => {
            this.dialogRef.close();
          });
        });
      }
    }
  }
}
