import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

@Component({
  selector: "app-addvideos",
  templateUrl: "./addvideos.component.html",
  styleUrls: ["./addvideos.component.css"],
})
export class AddvideosComponent implements OnInit {
  newVideo;

  moduleID;

  tVideoName;
  tThumbName;
  contentImageName: any;
  contentPdfName: any;
  youtubeUrl: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddvideosComponent>
  ) {
    this.moduleID = this.data.moduleID;
  }

  ngOnInit() {
    this.newVideo = {
      moduleId: this.moduleID,
      trainingImage: null,
      trainingVideoURL: null,
      trainingDescription: null,
      trainingTitle: null,
      trainingType: null,
      trainingContentImage: null,
      trainingContentPdf: null,
      trainingYoutubeUrl: "",
    };
  }
  bgValidation = { valid: true, insize: true };
  bgValidationPdf = { valid: true, insize: true };
  thumbValidation = { valid: true, insize: true };
  close() {
    this.dialogRef.close();
  }

  bodyFormdata: FormData = new FormData();

  onVideoUpload(fileInput: any = null) {
    this.bgValidation = { valid: true, insize: true };

    if (fileInput.target.files && fileInput.target.files[0]) {
      let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

      if (this.bodyFormdata.has("trainingVideoURL"))
        this.bodyFormdata.delete("trainingVideoURL");
      this.bodyFormdata.append(
        "trainingVideoURL",
        fileInput.target.files[0],
        fileInput.target.files[0].name
      );
      this.bgValidation = this.apiService.getVideoValidation(
        fileInput.target.files[0]
      );
    }
    this.tVideoName = fileInput.target.files[0].name;
  }

  onThumbImageUpload(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.thumbValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

        if (this.bodyFormdata.has("trainingImage"))
          this.bodyFormdata.delete("trainingImage");
        this.bodyFormdata.append(
          "trainingImage",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        //  this.thumbValidation=this.apiService.getImageValidation(fileInput.target.files[0]);
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.thumbValidation = message;
          });
      }
      this.tThumbName = fileInput.target.files[0].name;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  onContentImageUpload(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.thumbValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        if (this.bodyFormdata.has("trainingContentImage"))
          this.bodyFormdata.delete("trainingContentImage");
        this.bodyFormdata.append(
          "trainingContentImage",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.thumbValidation = message;
          });
      }
      this.contentImageName = fileInput.target.files[0].name;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  onContentPdfUpload(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "pdf") {
      this.bgValidationPdf = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        if (this.bodyFormdata.has("trainingContentPdf"))
          this.bodyFormdata.delete("trainingContentPdf");
        this.bodyFormdata.append(
          "trainingContentPdf",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this.bgValidationPdf = this.apiService.getPDFValidation(
          fileInput.target.files[0]
        );
      }
      this.contentPdfName = fileInput.target.files[0].name;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Only file format *.pdf allowed"
      );
    }
  }

  // addBrochure(fileInput: any = null) {
  //   if (fileInput.target.files && fileInput.target.files[0]) {
  //    let url = "project/projectBrochureSave";
  //     if (formData.has("brochureFile")) {
  //       if (this.bgValidationPdf.valid == true) {
  //         this.apiService.uploadBrochure(formData, url).subscribe(event => {
  //           if (event["status"] == 0) {
  //             fileInput.target.value = '';
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

  saveVideo() {
    if (
      this.thumbValidation.valid == true ||
      this.bgValidation.valid == true ||
      this.bgValidationPdf.valid == true
    ) {
      let trainingType;
      let formData: FormData = new FormData();
      if (this.newVideo.trainingType == 2) {
        trainingType = "video";
        if (this.bodyFormdata.has("trainingVideoURL"))
          formData.append("file", this.bodyFormdata.get("trainingVideoURL"));
        if (this.bodyFormdata.has("trainingImage"))
          formData.append("thumbnail", this.bodyFormdata.get("trainingImage"));
      } else if (this.newVideo.trainingType == 1) {
        trainingType = "image";
        if (this.bodyFormdata.has("trainingContentImage"))
          formData.append(
            "file",
            this.bodyFormdata.get("trainingContentImage")
          );
      } else if (this.newVideo.trainingType == 3) {
        trainingType = "pdf";
        if (this.bodyFormdata.has("trainingContentPdf"))
          formData.append("file", this.bodyFormdata.get("trainingContentPdf"));
      } else if (this.newVideo.trainingType == 4) {
        trainingType = "youtube";
      }
      this.apiService
        .postDataMultipartRaw(
          "sales/training?trainingModuleId=" +
            this.moduleID +
            "&title=" +
            this.newVideo.trainingTitle +
            "&description=" +
            this.newVideo.trainingDescription +
            "&urlType=" +
            trainingType +
            "&url=" +
            this.newVideo.trainingYoutubeUrl,
          formData
        )
        .subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Training content saved successfully!"
          ).subscribe((result) => {});
          this.dialogRef.close();
        });
    }
  }
}
