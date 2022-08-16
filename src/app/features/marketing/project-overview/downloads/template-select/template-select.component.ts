import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { HelperService } from "../../../../../../app/commonservice/common/helper.service";
import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-template-select",
  templateUrl: "./template-select.component.html",
  styleUrls: [
    "../../../../../css/style.css",
    "./template-select.component.css",
  ],
})
export class TemplateSelectComponent implements OnInit, OnDestroy {
  bgValidation = { valid: true, insize: true };
  bodyFormdata: FormData = new FormData();
  bgImageUrl: any;
  bgColor: string;
  bgImage: any;
  fileName: any;
  fileUrl: string;
  fontFamily = ["Montserrat", "Poppins", "Noto Serif", "Roboto"];
  isBig: boolean;
  isBGcolorEnable: boolean;
  linkToCollateral: any;
  overlayType: string = "Image";
  positionX: number;
  positionY: number;
  selectedTemplate: string;
  showTemplate: boolean = true;
  showPopup: boolean;
  submitted: boolean;
  selectedFile: string | Blob;
  type: string;
  templateType: string = "NewPage";
  templates: any;
  transparent = [
    { text: "0%", value: "00" },
    { text: "25%", value: "40" },
    { text: "50%", value: "80" },
    { text: "75%", value: "BF" },
    { text: "100%", value: "FF" },
  ];
  templateForm: FormGroup;
  uploadType: string[];
  viewURL: string;

  private destroy$: Subject<void> = new Subject();

  @ViewChild("imageDrag") imageDrag: ElementRef;
  @ViewChild("templateDrag") templateDrag: ElementRef;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<TemplateSelectComponent>,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.uploadType = this.helperService.imageType;
    this.templateForm = this.createFormGroup();
    let index = this.data.downloadList.findIndex(
      (val) => val.id == this.data.docId
    );
    var data = this.data.downloadList[index];
    if (data && data.collateralTemplate) {
      this.viewURL =
        this.data.docType == "PDF"
          ? this.sanitizer.bypassSecurityTrustResourceUrl(this.data.docUrl)
          : this.data.docUrl;
    } else {
      this.viewURL =
        this.data.docType == "PDF"
          ? this.sanitizer.bypassSecurityTrustResourceUrl(this.data.docUrl)
          : this.data.docUrl;
    }
    if (this.data.docType == "TEXT") {
    } else if (this.data.docType == "IMAGE") {
      this.type = "Image";
    } else if (this.data.docType == "PDF") {
      this.type = "PDF Page";
    }
    this.getTemplates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public dragEnded(event): void {
    const { offsetLeft, offsetTop } = event.source.element.nativeElement;
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);
    this.positionX = offsetLeft + boundingClientRect.x - parentPosition.left;
    this.positionY = offsetTop + boundingClientRect.y - parentPosition.top;
    this.showPopup = true;
  }

  public onOverlayChange(e): void {
    this.overlayType = e;
  }

  public onTemplateChange(e): void {
    this.templateType = e;
  }

  public onSelectTemplate(temp): void {
    this.showTemplate = !temp;
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public uploadFile(fileInput: any = null): void {
    this.fileUrl = fileInput.target.files[0];
    this.fileName = fileInput.target.files[0].name;
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      if (fileInput.target.files && fileInput.target.files[0]) {
        this.selectedFile = fileInput.target.files[0];
        let formData: FormData = new FormData();
        formData.append("file", this.selectedFile);
        this.apiService
          .postDataMultipartRaw("sales/collateral/uploadBGImage", formData)
          .pipe(takeUntil(this.destroy$))
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

  public updatePreview(): void {
    let body = this.createFormData();
    this.apiService
      .postData("sales/collateral/preview-v2", body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.linkToCollateral = res.message;
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Preview generated successfully"
        );
        let link = document.createElement("a");
        link.href = this.linkToCollateral;
        link.target = "_blank";
        link.click();
      });
  }

  public saveCustomCollateral(): void {
    let body = this.createFormData();
    this.apiService
      .postData("sales/collateral-v2", body)
      .pipe(takeUntil(this.destroy$))
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

  private createFormData() {
    let formData = this.templateForm.value;
    if (this.data.docType == "IMAGE") {
      var widthImage = this.imageDrag.nativeElement.offsetWidth;
      var heightImage = this.imageDrag.nativeElement.offsetHeight;
      var width = this.templateDrag.nativeElement.offsetWidth;
      var height = this.templateDrag.nativeElement.offsetHeight;
    }
    let data = {
      boxHeight:
        this.data.docType == "PDF"
          ? formData.boxHeight
          : Math.abs((height / heightImage) * 100),
      boxWidth:
        this.data.docType == "PDF"
          ? formData.boxWidth
          : Math.abs((width / widthImage) * 100),
      boxX:
        this.data.docType == "PDF"
          ? formData.boxX
          : Math.abs((this.positionX / widthImage) * 100),
      boxY:
        this.data.docType == "PDF"
          ? formData.boxY
          : Math.abs((this.positionY / heightImage) * 100),
      fontColor: formData.fontColor.substring(1),
      boxBackgroundColor:
        formData.boxBackgroundColor.substring(1) + formData.transparent,
      boxBorderColor: formData.boxBorderColor.substring(1),
      preDefinedCollateralId: this.selectedTemplate,
      projectBrochureId: this.data.docId,
      primaryFontSize: formData.primaryFontSize,
      secondaryFontSize: formData.secondaryFontSize,
      fontFamily: formData.fontFamily,
    };
    if (this.data.docType == "PDF") {
      if (formData.pageBackgroundColor) {
        data["pageBackgroundColor"] = formData.pageBackgroundColor.substring(1);
      } else {
        data["backgroundImageUrl"] = this.bgImageUrl;
      }
    }
    return data;
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [""],
      backgroundColor: [""],
      backgroundImageUrl: [""],
      boxBackgroundColor: [""],
      boxBorderColor: ["000000"],
      boxHeight: ["20"],
      boxWidth: ["20"],
      boxX: ["0"],
      boxY: ["0"],
      fontColor: ["FFFFFF"],
      fontFamily: ["Montserrat"],
      fontSize: [""],
      htmlContent: [""],
      pageBackgroundColor: [""],
      preDefinedCollateralId: [""],
      primaryFontSize: ["14"],
      projectBrochureId: [""],
      secondaryFontSize: ["12"],
      textBoxWidth: [""],
      transparent: ["00"],
    });
  }

  private getPosition(el): { top: number; left: number } {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  private getTemplates(): void {
    let Data = {
      // type: this.data.doc  Type,
    };
    this.apiService
      .getDataInputValue("admin/pre-defined-collateral", Data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.templates = res.content;
      });
  }
}
