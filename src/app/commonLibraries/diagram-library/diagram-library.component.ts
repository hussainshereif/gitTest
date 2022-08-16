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
  BasicShapeModel,
  TextStyleModel,
  ShapeStyleModel,
} from "@syncfusion/ej2-diagrams";
import { DiagramComponent } from "@syncfusion/ej2-angular-diagrams";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { ColorEvent } from "ngx-color";

@Component({
  selector: "app-diagram-library",
  templateUrl: "./diagram-library.component.html",
  styleUrls: ["./diagram-library.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class DiagramLibraryComponent implements OnInit {
  content: any;
  diagramShape: any = "Ellipse";
  node: NodeModel;
  style: ShapeStyleModel;
  borderColor: string;
  colorFill: boolean = false;

  shape: BasicShapeModel = {
    type: "Basic",
    shape: this.diagramShape,
    // cornerRadius: 10
  };
  @ViewChild("diagram", { static: false })
  public diagram: DiagramComponent;

  constructor(
    public dialogRef: MatDialogRef<DiagramLibraryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.style = { fill: "none", strokeColor: "black" };
  }

  public getNodeDefaults(node: NodeModel): NodeModel {
    node.height = 100;
    node.width = 100;
    return node;
  }

  shapeFun() {
    this.shape = {
      type: "Basic",
      shape: this.diagramShape,
      // cornerRadius: 10
    };
  }

  colorPickerDiv(ev) {
    // console.log(ev,"ev")
    if (ev.target.className == "color_picker_div") {
      this.colorFill = false;
    }
  }
  public static showEdit(_dialoginstance: MatDialog, htmlContent: any) {
    const dialogRef = _dialoginstance.open(DiagramLibraryComponent, {
      width: "480px",
      height: "570px",
      data: {
        htmlContent: htmlContent,
      },
    });
    return dialogRef.afterClosed();
  }

  onClose() {
    this.dialogRef.close({ result: "" });
  }
  onSave() {
    let htmlContent = document.getElementById("diagramcontent");
    let node = document.getElementById("node1");
    // console.log(node,"node");
    this.dialogRef.close({ result: htmlContent });
  }
  reShape(value: any) {
    if (value == 1) {
      this.diagramShape = "Rectangle";
    } else if (value == 2) {
      this.diagramShape = "Triangle";
    } else if (value == 3) {
      this.diagramShape = "Ellipse";
    }
    this.shape.shape = this.diagramShape;
    this.shapeFun();
    // console.log(this.shape,"shape");
  }

  handleChange($event: ColorEvent) {
    this.style = { fill: $event.color.hex, strokeColor: "white" };
    document.getElementById("fillIcon").style.color = this.style.fill;
  }
  fillIcon() {
    // console.log("working");
    if (this.colorFill == true) {
      this.colorFill = false;
    } else {
      this.colorFill = true;
    }
  }
}
