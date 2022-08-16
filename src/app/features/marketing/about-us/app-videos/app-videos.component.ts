import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../app/dialogs/confirmation/confirmation.component";

import { AppVideoCreateComponent } from "./app-videos-create/app-videos-create.component";

@Component({
  selector: "app-videos",
  templateUrl: "./app-videos.component.html",
  styleUrls: ["./app-videos.component.css"],
})
export class AppVideosComponent implements OnInit {
  offsetdb: number;
  offset: number = 0;
  recordsPerPage: number = 3;
  showDetails: boolean = false;
  selectedData: any;
  sizeofTable;
  videoData: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showDetails = false;
    this.getVideoData(this.offset);
  }

  private getVideoData(page): void {
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
    };
    let url = "user/about/appTutorialVideo";
    this.apiService.getDataInputValue(url, data).subscribe((resp) => {
      this.videoData = resp.content;
      this.sizeofTable = resp.totalPages * 3;
    });
  }

  public showDetailData(data): void {
    this.showDetails = true;
    this.selectedData = data;
  }

  public hideDetails(e): void {
    this.showDetails = false;
  }

  public paginatedSearch(): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getVideoData(this.offsetdb);
    } else {
      let init = 0;
      this.getVideoData(init);
    }
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(AppVideoCreateComponent, {
      width: "600px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.paginatedSearch();
    });
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(AppVideoCreateComponent, {
      width: "600px",
      data: data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.paginatedSearch();
    });
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
            this.paginatedSearch();
          });
      }
    });
  }
}
