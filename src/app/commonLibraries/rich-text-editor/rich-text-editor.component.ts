import { Component, OnInit, Inject, AfterContentChecked } from "@angular/core";
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
} from "@syncfusion/ej2-angular-richtexteditor";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { style } from "@angular/animations";
@Component({
  selector: "app-rich-text-editor",
  templateUrl: "./rich-text-editor.component.html",
  styleUrls: ["./rich-text-editor.component.css"],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
})
export class RichTextEditorComponent implements OnInit {
  content: any;
  editValue: any;
  constructor(
    public dialogRef: MatDialogRef<RichTextEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.content = this.data.htmlContent;
  }
  // ngAfterContentChecked(){
  //   console.log(this.dialogRef,"dialogref");
  // }

  public fontFamily: Object = {
    items: [
      {
        text: "Segoe UI",
        value: "Segoe UI",
        class: "e-segoe-ui",
        command: "Font",
        subCommand: "FontName",
      },
      {
        text: "Arial",
        value: "Arial",
        command: "Font",
        subCommand: "FontName",
      },
      {
        text: "Georgia",
        value: "Georgia,serif",
        command: "Font",
        subCommand: "FontName",
      },
      {
        text: "Impact",
        value: "Impact,Charcoal,sans-serif",
        class: "e-impact",
        command: "Font",
        subCommand: "FontName",
      },
      // {text: "Tahoma", value: "Tahoma,Geneva,sans-serif", class: "e-tahoma", command: "Font", subCommand: "FontName"},
      {
        text: "Times New Roman",
        value: "Times New Roman,Times,serif",
        command: "Font",
        subCommand: "FontName",
      },
      {
        text: "Verdana",
        value: "Verdana,Geneva,sans-serif",
        command: "Font",
        subCommand: "FontName",
      },
      {
        text: "Metropolis",
        value: "Metropolis",
        command: "Font",
        subCommand: "FontName",
      },
    ],
  };

  public tools: object = {
    items: [
      "Undo",
      "Redo",
      "|",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "|",
      "OrderedList",
      "UnorderedList",
      "|",
      "Indent",
      "Outdent",
      "|",
      "CreateLink",
      "Image",
      "|",
      "ClearFormat",
      "Print",
      "SourceCode",
      "|",
      "FullScreen",
    ],
  };
  public quickTools: object = {
    image: [
      "Replace",
      "Align",
      "Caption",
      "Remove",
      "InsertLink",
      "-",
      "Display",
      "AltText",
      "Dimension",
    ],
  };

  path(ev: any) {
    // console.log(ev,"path");
  }
  onSubmit(): void {
    let style = "";
    // console.log(document.getElementById('content').getAttributeNode("style").value)
    var parser = new DOMParser();
    var doc = parser.parseFromString(this.content, "text/html");
    let ele = doc.body.children[0];
    // console.log(doc.body,"body");
    if (ele != undefined) {
      if (ele.children[0] != undefined) {
        if (ele.children[0].getAttributeNode("style") != undefined) {
          style = ele.children[0].getAttributeNode("style").value;
        }
        if (ele.children[0].children[0] != undefined) {
          if (
            ele.children[0].children[0].getAttributeNode("style") != undefined
          ) {
            style =
              style +
              ele.children[0].children[0].getAttributeNode("style").value;
          }
          if (ele.children[0].children[0].children[0] != undefined) {
            if (
              ele.children[0].children[0].children[0].getAttributeNode(
                "style"
              ) != undefined
            ) {
              style =
                style +
                ele.children[0].children[0].children[0].getAttributeNode(
                  "style"
                ).value;
            }
            if (
              ele.children[0].children[0].children[0].children[0] != undefined
            ) {
              if (
                ele.children[0].children[0].children[0].children[0].getAttributeNode(
                  "style"
                ) != undefined
              ) {
                style =
                  style +
                  ele.children[0].children[0].children[0].children[0].getAttributeNode(
                    "style"
                  ).value;
              }
              if (
                ele.children[0].children[0].children[0].children[0]
                  .children[0] != undefined
              ) {
                if (
                  ele.children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                    "style"
                  ) != undefined
                ) {
                  style =
                    style +
                    ele.children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                      "style"
                    ).value;
                }
                if (
                  ele.children[0].children[0].children[0].children[0]
                    .children[0].children[0] != undefined
                ) {
                  if (
                    ele.children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                      "style"
                    ) != undefined
                  ) {
                    style =
                      style +
                      ele.children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                        "style"
                      ).value;
                  }
                  if (
                    ele.children[0].children[0].children[0].children[0]
                      .children[0].children[0].children[0] != undefined
                  ) {
                    if (
                      ele.children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                        "style"
                      ) != undefined
                    ) {
                      style =
                        style +
                        ele.children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                          "style"
                        ).value;
                    }
                    if (
                      ele.children[0].children[0].children[0].children[0]
                        .children[0].children[0].children[0].children[0] !=
                      undefined
                    ) {
                      if (
                        ele.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                          "style"
                        ) != undefined
                      ) {
                        style =
                          style +
                          ele.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].getAttributeNode(
                            "style"
                          ).value;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // let element=doc.body.children[0].children[0];
    // style=element.getAttributeNode('stytle').value;
    this.dialogRef.close({ result: this.content, style: style });
  }
  onClose() {
    this.dialogRef.close();
  }
  rteCreated(): void {
    // console.log("rteCreated");
  }
  public static showEdit(_dialoginstance: MatDialog, htmlContent: any) {
    const dialogRef = _dialoginstance.open(RichTextEditorComponent, {
      width: "600px",
      maxHeight: "500px",
      data: {
        htmlContent: htmlContent,
      },
    });
    return dialogRef.afterClosed();
  }
}
