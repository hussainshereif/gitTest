import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  public static showAlert(
    _dialoginstance: MatDialog,
    title: any = "Confirmation",
    message: string = "Are you sure ?",
    yes_label: string = "Yes",
    no_label: string = "No"
  ) {
    const dialogRef = _dialoginstance.open(AlertComponent, {
      width: "400px",
      data: {
        title: title,
        message: message,
        positivelabel: yes_label,
        negativelabel: no_label,
      },
    });

    return dialogRef.afterClosed();
  }

  yes() {
    this.dialogRef.close({ result: true });
  }

  no() {
    this.dialogRef.close({ result: false });
  }
}
