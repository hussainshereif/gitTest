import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../../app/dialogs/confirmation/confirmation.component";

import { AppVideoCreateComponent } from "../app-videos-create/app-videos-create.component";

@Component({
  selector: "app-videos-details-list",
  templateUrl: "./app-videos-details.component.html",
  styleUrls: ["./app-videos-details.component.css"],
})
export class AppVideoDetailComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

  @Input() videoData;

  viewURL: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    let typeURL =
      this.videoData.contentType === "WEBSITE"
        ? this.videoData.imageUrl
        : this.videoData.contentUrl;
    this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(typeURL);
  }

  public onBack(): void {
    this.newItemEvent.emit("false");
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(AppVideoCreateComponent, {
      width: "600px",
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public onDelete(id): void {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this App Tutorial Video?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("user/about/delete/appTutorialVideo/" + id, "")
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {});
          });
      }
    });
  }
}
