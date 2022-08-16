import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { AddBannerComponent } from "src/app/dialogs/add-banner/add-banner.component";

@Component({
  selector: "app-banner-list",
  templateUrl: "./banner-list.component.html",
  styleUrls: ["./banner-list.component.css"],
})
export class BannerlistComponent implements OnInit {
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}
  offset;
  offsetdb;
  recordsPerPage;
  bannerList = [];
  sizeofTable;
  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;

    this.getBannerList(this.offset);
  }

  getBannerList(page) {
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService.getDataInputValue("user/banner", data).subscribe((res) => {
      this.sizeofTable = res.totalPages * 10;
      this.bannerList = res.content;

      if (this.bannerList.length > 0) {
        this.bannerList = this.bannerList.map((item) => {
          item.bannerName = item.url.split("/").pop();
          return item;
        });
      }
    });
  }

  deleteBanner(bid) {
    let body = new URLSearchParams();
    body.append("bannerImgId", bid);
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this banner?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postDataNotJSON("sales/banner/delete/" + bid, "")
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Banner image deleted successfully!"
            ).subscribe((result) => {});
            if (this.offsetdb > 0) {
              this.getBannerList(this.offsetdb * 10);
            } else {
              let init = 0;
              this.getBannerList(init);
            }
          });
      }
    });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getBannerList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getBannerList(init);
    }
  }

  addBannerImage() {
    let dialogRef = this.dialog.open(AddBannerComponent, {
      width: "650px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getBannerList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getBannerList(init);
      }
    });
  }
}
