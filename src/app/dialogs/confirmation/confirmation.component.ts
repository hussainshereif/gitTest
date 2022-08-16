import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.css"],
})
export class ConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}

  public static showConfirmation(
    _dialoginstance: MatDialog,
    title: string = "Confirmation",
    message: string = "Are you sure ?",
    yes_label: string = "Yes",
    no_label: string = "No"
  ) {
    const dialogRef = _dialoginstance.open(ConfirmationComponent, {
      width: "600px",
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
