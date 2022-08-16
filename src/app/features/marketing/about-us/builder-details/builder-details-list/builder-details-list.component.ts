import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../../app/dialogs/confirmation/confirmation.component";

import { BuilderDetailsCreateComponent } from "../builder-details-create/builder-details-create.component";

@Component({
  selector: "app-builder-details-list",
  templateUrl: "./builder-details-list.component.html",
  styleUrls: ["./builder-details-list.component.css"],
})
export class BuilderDetailsListComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

  @Input() builderData;

  viewURL: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    let typeURL =
      this.builderData.contentType === "WEBSITE"
        ? this.builderData.imageUrl
        : this.builderData.contentUrl;
    this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(typeURL);
  }

  public onBack(): void {
    this.newItemEvent.emit("false");
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(BuilderDetailsCreateComponent, {
      width: "790px",
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  public onDelete(id): void {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this Builder Detail?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("user/about/delete/builderDetail/" + id, "")
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {});
            this.onBack();
          });
      }
    });
  }
}
