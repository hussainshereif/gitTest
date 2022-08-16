import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-collateral-view",
  templateUrl: "./collateral-view.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class CollateralViewComponent implements OnInit {
  filename: any;
  previewImage: any;
  urlType: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CollateralViewComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.collateral.url)
      this.filename = this.data.collateral.url.split("/").pop();
    this.urlType = this.data.collateral.type;
    this.preview(this.data.collateral.url);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public preview(previewImageLink): void {
    this.previewImage = previewImageLink;
    if (this.urlType == "PDF") {
      this.previewImage =
        this.sanitizer.bypassSecurityTrustResourceUrl(previewImageLink);
    }
  }
}
