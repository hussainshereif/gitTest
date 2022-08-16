import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "../alert/alert.component";

@Component({
  selector: "app-custom-collateral-creator",
  templateUrl: "./add-custom-collateral.component.html",
  styleUrls: ["./add-custom-collateral.component.css"],
})
export class CollateralCustomCreatorComponent implements OnInit {
  templates: any;
  viewURL: any;
  customImage: any;
  projectId: number;
  htmlData: string;
  templateId: any;
  pdfColor: any;
  collateralPdfBgm: any;
  isFileDuplicateName: boolean = false;
  bodyFormdata: FormData = new FormData();
  bgColor: string;
  isBGcolorEnable: boolean;
  bgImage: any;
  bgImageUrl: any;
  selectedFile: any;
  isColorPicker: boolean;
  textWidth: number;
  fontSize: number;
  linkToCollateral: any;
  type: string;

  constructor(
    private apiService: RemoteApisService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,

    public dialogRef: MatDialogRef<CollateralCustomCreatorComponent>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = +params["id"] || 0;
    });
    this.textWidth = 30;
    this.fontSize = 14;
    this.pdfColor = "";
    this.collateralPdfBgm = "Image";
    let index = this.data.downloadList.findIndex(
      (val) => val.id == this.data.docId
    );
    var data = this.data.downloadList[index];
    if (data && data.collateralTemplate) {
      this.textWidth = data.collateralTemplate.textBoxWidth * 100;
      this.fontSize = data.collateralTemplate.fontSize;
      this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.data.docUrl
      );
    } else {
      this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.data.docUrl
      );
    }
    if (this.data.docType == "TEXT") {
    } else if (this.data.docType == "IMAGE") {
      this.type = "Image";
    } else if (this.data.docType == "PDF") {
      this.type = "PDF Page";
    }

    this.getTemplates();
  }

  getTemplates() {
    let Data = {
      // type: this.data.doc  Type,
    };
    this.apiService
      .getDataInputValue("admin/pre-defined-collateral", Data)
      .subscribe((res: any) => {
        this.templates = res.content;
        console.log(this.templates);
      });
  }

  onClickPdf() {
    let index = this.data.downloadList.findIndex(
      (val) => val.id == this.data.docId
    );
    let link = document.createElement("a");
    link.href = this.linkToCollateral
      ? this.linkToCollateral
      : this.data.downloadList[index].url;
    link.target = "_blank";
    link.click();
  }

  onChangeTemplate(data) {
    this.customImage = data.htmlContent;
    this.templateId = data.id;
  }

  onPreview() {
    if (this.data.docType == "IMAGE") {
      this.pdfColor = "FFFFF";
    }
    if (this.templateId && (this.pdfColor || this.bgImageUrl)) {
      let body = new URLSearchParams();
      body.append("html", "test");
      body.append("templateId", this.templateId);
      body.append("brochureId", this.data.docId);
      body.append("fontSize", this.fontSize.toString());
      body.append("textBoxWidth", this.textWidth.toString());

      if (this.data.docType == "PDF") {
        if (this.pdfColor) {
          body.append("backgroundColor", this.pdfColor);
        } else {
          body.append("imageUrl", this.bgImageUrl);
        }
      }

      this.apiService
        .postDataNotJSON("sales/collateral/preview", body.toString())
        .subscribe((res) => {
          this.linkToCollateral = res.message;
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Preview generated successfully"
          );
          this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            res.message
          );
        });
    } else {
      if (!this.templateId) {
        AlertComponent.showAlert(this.dialog, "", "Please select template");
      } else {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Please select Background Color"
        );
      }
    }
  }

  onSubmit() {
    let body = new URLSearchParams();
    body.append("preDefinedCollateralId", this.templateId);
    body.append("projectBrochureId", this.data.docId);
    body.append("fontSize", this.fontSize.toString());
    body.append("textBoxWidth", this.textWidth.toString());
    if (this.data.docType == "PDF") {
      if (this.pdfColor) {
        body.append("backgroundColor", this.pdfColor);
      } else {
        body.append("backgroundImageUrl", this.bgImageUrl);
      }
    }
    this.apiService
      .postDataNotJSON("sales/collateral", body.toString())
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Collateral saved successfully!!"
        ).subscribe((result) => {
          this.dialogRef.close();
        });
      });
  }

  uploadBackgroundImage(fileInput) {
    this.isColorPicker = false;
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      if (fileInput.target.files && fileInput.target.files[0]) {
        this.selectedFile = fileInput.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", this.selectedFile);
        this.apiService
          .postDataMultipartRaw("sales/collateral/uploadBGImage", formData)
          .subscribe((res: any) => {
            if (res.status == "SUCCESS") {
              this.bgImage = res.message;
              this.bgImageUrl = this.bgImage;
              document.getElementById("bgImageDiv").style.backgroundImage =
                `url(` + this.bgImageUrl + `)`;
              this.bgColor = " ";
              this.isBGcolorEnable = false;
            } else {
              AlertComponent.showAlert(this.dialog, "", res.message);
            }
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

  onCollateralType(type) {
    this.collateralPdfBgm = type;
  }
  onbgmChange(e) {
    this.pdfColor = e.color.hex.substring(1);
  }
  onClose() {
    this.dialogRef.close();
  }
}
