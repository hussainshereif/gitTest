import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-gallery-view",
  templateUrl: "./project-gallery-view.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class GalleryViewComponent implements OnInit {
  caption: any;
  previewImage: any;
  urlType: any;
  filename: any;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GalleryViewComponent>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.preview(
      this.data.gallery.url,
      this.data.gallery.caption,
      this.data.gallery.urlType
    );
    if (this.data.location.imageLink)
      this.filename = this.data.gallery.url.split("/").pop();
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public preview(previewImage, caption, type): void {
    this.previewImage = previewImage;
    this.caption = caption;
    this.urlType = type;
    if (type == "VIDEO")
      this.previewImage = this.sanitizer.bypassSecurityTrustResourceUrl(
        "https://www.youtube.com/embed/" + previewImage
      );
  }
}
