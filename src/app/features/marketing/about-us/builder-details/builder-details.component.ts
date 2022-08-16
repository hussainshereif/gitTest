import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../app/dialogs/confirmation/confirmation.component";

import { BuilderDetailsCreateComponent } from "./builder-details-create/builder-details-create.component";

@Component({
  selector: "app-builder-details",
  templateUrl: "./builder-details.component.html",
  styleUrls: ["./builder-details.component.css"],
})
export class BuilderDetailsComponent implements OnInit {
  builderData: any;
  offsetdb: number;
  offset: number = 0;
  recordsPerPage: number = 3;
  selectedData: any;
  showDetails: boolean = false;
  sizeofTable;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.showDetails = false;
    this.getBuilderData(this.offset);
  }

  private getBuilderData(page): void {
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
    };
    let url = "user/about/builderDetail";
    this.apiService.getDataInputValue(url, data).subscribe(
      (resp) => {
        this.builderData = resp.content;
        this.sizeofTable = resp.totalPages * 3;
      },
      (error) => {
        this.builderData = [];
      }
    );
  }

  public paginatedSearch(): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getBuilderData(this.offsetdb);
    } else {
      let init = 0;
      this.getBuilderData(init);
    }
  }

  public addBuilderDetails(): void {
    let dialogRef = this.dialog.open(BuilderDetailsCreateComponent, {
      width: "790px",
      data: {},
    });
    dialogRef.afterClosed().subscribe(() => {
      this.paginatedSearch();
    });
  }

  public hideDetails(e): void {
    this.showDetails = false;
    this.paginatedSearch();
  }

  public onEdit(data): void {
    let dialogRef = this.dialog.open(BuilderDetailsCreateComponent, {
      width: "790px",
      data: data,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.offsetdb = this.offset - 1;
      this.paginatedSearch();
    });
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
            ).subscribe(() => {});
            this.paginatedSearch();
          });
      }
    });
  }

  public showDetailData(data): void {
    this.showDetails = true;
    this.selectedData = data;
  }
}
