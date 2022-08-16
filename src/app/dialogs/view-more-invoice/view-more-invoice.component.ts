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
  selector: "app-view-more-invoice",
  templateUrl: "./view-more-invoice.component.html",
  styleUrls: ["./view-more-invoice.component.css"],
})
export class ViewMoreInvoiceComponent implements OnInit {
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMoreInvoiceComponent>
  ) {}

  ngOnInit() {}
}
