import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../../app/dialogs/confirmation/confirmation.component";

import { NewsCreateComponent } from "../news-create/news-create.component";

@Component({
  selector: "app-news-details",
  templateUrl: "./news-details.component.html",
  styleUrls: ["./news-details.component.css"],
})
export class NewsDetailsComponent implements OnInit {
  @Input() newsData;

  @Output() newItemEvent = new EventEmitter<string>();

  viewURL: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    let typeURL =
      this.newsData.contentType === "WEBSITE"
        ? this.newsData.imageUrl
        : this.newsData.contentUrl;
    this.viewURL = this.sanitizer.bypassSecurityTrustResourceUrl(typeURL);
  }

  public onBack(): void {
    this.newItemEvent.emit("false");
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(NewsCreateComponent, {
      width: "750px",
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public onDelete(id): void {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this News?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("user/about/delete/news?id=" + id, "")
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
