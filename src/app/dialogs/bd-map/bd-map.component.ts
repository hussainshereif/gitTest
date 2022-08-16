import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-bd-map",
  templateUrl: "./bd-map.component.html",
  styleUrls: ["./bd-map.component.css"],
})
export class BdMapComponent implements OnInit {
  mapUrl: any;
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BdMapComponent>,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.mapUrl = this.data.mapUrl;
  }
  close() {
    this.dialogRef.close();
  }
}
