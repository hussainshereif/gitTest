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
  selector: "app-add-banner",
  templateUrl: "./add-banner.component.html",
  styleUrls: ["./add-banner.component.css"],
})
export class AddBannerComponent implements OnInit {
  bannerImageName;
  submitted:boolean=false;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddBannerComponent>
  ) {}

  ngOnInit() {}
  bgValidation = { valid: true, insize: true };
  caption;
  close() {
    this.dialogRef.close();
  }

  bodyFormdata: FormData = new FormData();
  onBannerImageUpload(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.bgValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        if (this.bodyFormdata.has("bannerImgURL"))
          this.bodyFormdata.delete("bannerImgURL");
        this.bodyFormdata.append(
          "bannerImgURL",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        // this.bgValidation=this.apiService.getImageValidation(fileInput.target.files[0]);
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.bgValidation = message;
          });
      }
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  saveVideo() {
    this.submitted=true;
    if (this.bgValidation.valid == true) {
      let formData: FormData = new FormData();
      if (this.bodyFormdata.has("bannerImgURL"))
        formData.append("file", this.bodyFormdata.get("bannerImgURL"));

      this.apiService.postDataMultipartRaw("sales/banner?caption="+this.caption, formData).subscribe(
        (res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Banner image saved successfully!"
          ).subscribe((result) => {});
          this.dialogRef.close();
        },
        (error) => {
          AlertComponent.showAlert(this.dialog, "", error.error).subscribe(
            (result) => {}
          );
          this.dialogRef.close();
        }
      );
    }
  }
}
