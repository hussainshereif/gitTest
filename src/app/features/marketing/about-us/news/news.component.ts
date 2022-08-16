import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../app/dialogs/confirmation/confirmation.component";

import { NewsCreateComponent } from "./news-create/news-create.component";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit {
  newsData: any;
  offsetdb: number;
  offset: number = 0;
  recordsPerPage: number = 3;
  showDetails: boolean = false;
  selectedData: any;
  sizeofTable;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showDetails = false;
    this.getNewsData(this.offset);
  }

  private getNewsData(page): void {
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
    };
    let url = "user/about/news";
    this.apiService.getDataInputValue(url, data).subscribe((resp) => {
      this.newsData = resp.content;
      this.sizeofTable = resp.totalPages * 3;
    });
  }

  public hideDetails(e): void {
    this.showDetails = false;
  }

  public showDetailData(data): void {
    this.showDetails = true;
    this.selectedData = data;
  }

  public paginatedSearch(): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getNewsData(this.offsetdb);
    } else {
      let init = 0;
      this.getNewsData(init);
    }
  }

  public onAdd(): void {
    let dialogRef = this.dialog.open(NewsCreateComponent, {
      width: "750px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.paginatedSearch();
    });
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(NewsCreateComponent, {
      width: "750px",
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
      "Are you sure you want to delete this News?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("user/about/delete/news/" + id, "")
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "News Deleted successfully!!"
            ).subscribe((result) => {});
            this.paginatedSearch();
          });
      }
    });
  }
}
