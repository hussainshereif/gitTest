import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-scheme-view",
  templateUrl: "./scheme-view.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class SchemeViewComponent implements OnInit {
  filename: any;
  previewImage: string;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SchemeViewComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.scheme.imageLink)
      this.filename = this.data.scheme.imageLink.split("/").pop();
    this.preview(this.data.scheme.imageLink);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public preview(previewImageLink: string): void {
    this.previewImage = previewImageLink;
  }
}
