import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

@Component({
  selector: "app-delete-confirmation",
  templateUrl: "./delete-confirmation.component.html",
  styleUrls: ["../../css/style.css"],
})
export class DeleteConfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public static showConfirmation(
    _dialoginstance: MatDialog,
    title: string = "Confirmation",
    message: string = "Are you sure ?",
    yes_label: string = "Yes",
    no_label: string = "No"
  ) {
    const dialogRef = _dialoginstance.open(DeleteConfirmationComponent, {
      width: "500px",
      data: {
        title: title,
        message: message,
        positivelabel: yes_label,
        negativelabel: no_label,
      },
    });
    return dialogRef.afterClosed();
  }

  public onDelete(): void {
    this.dialogRef.close({ result: true });
  }

  public onCancel(): void {
    this.dialogRef.close({ result: false });
  }
}
