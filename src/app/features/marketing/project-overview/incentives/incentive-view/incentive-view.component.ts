import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-incentive-view",
  templateUrl: "./incentive-view.component.html",
  styleUrls: ["../../../../../css/style.css"],
})
export class IncentiveViewComponent implements OnInit {
  filename: any;
  previewImage: string;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IncentiveViewComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.location.imageLink)
      this.filename = this.data.location.imageLink.split("/").pop();
    this.preview(this.data.location.imageLink);
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public preview(previewImageLink): void {
    this.previewImage = previewImageLink;
  }
}
