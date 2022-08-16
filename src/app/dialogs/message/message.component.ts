import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"],
})
export class MessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
  public static showMessage(
    _dialoginstance: MatDialog,
    title: any = "Confirmation",
    message: string = "Are you sure ?"
  ) {
    const dialogRef = _dialoginstance.open(MessageComponent, {
      width: "500px",
      data: {
        title: title,
        message: message,
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
