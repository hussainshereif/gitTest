// import { Component,  } from '@angular/core';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Inject,
} from "@angular/core";
import {
  Diagram,
  NodeModel,
  TextModel,
  TextStyleModel,
  FlowShapeModel,
} from "@syncfusion/ej2-diagrams";
// import { Diagram, NodeModel,  , TextStyleModel } from '@syncfusion/ej2-diagrams';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
@Component({
  selector: "app-diagram",
  templateUrl: "./diagram.component.html",
  styleUrls: ["./diagram.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DiagramComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DiagramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  public shape: FlowShapeModel = {
    type: "Flow",
    shape: "Document",
  };
  public getNodeDefaults(node: NodeModel): NodeModel {
    node.height = 100;
    node.width = 100;
    node.style.fill = "none";
    return node;
  }
  public static showEdit(_dialoginstance: MatDialog, htmlContent: any) {
    const dialogRef = _dialoginstance.open(DiagramComponent, {
      width: "500px",
      height: "500px",
      data: {
        htmlContent: htmlContent,
      },
    });
    return dialogRef.afterClosed();
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    this.dialogRef.close({ result: "data" });
  }
}
