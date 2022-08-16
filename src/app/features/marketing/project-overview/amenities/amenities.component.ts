import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { AddAmenitiesComponent } from "../../../../dialogs/add-amenities/add-amenities.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-amenities",
  templateUrl: "./amenities.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class AmenitiesComponent implements OnInit, OnDestroy {
  @Input("projectId") projectId;

  amenitiesList: any = [];
  defAmenities = [];
  model: any;
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  sizeofTable;
  submitted: boolean = false;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAmenities(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addAmenities(): void {
    let dialogRef = this.dialog.open(AddAmenitiesComponent, {
      width: "800px",
      data: {
        type: 1,
        projectId: this.projectId,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        this.getAmenities(0);
      }
    });
  }

  editAmenities(id: string, i: number, event): void {
    let dataObj = this.amenitiesList[i];
    let dialogRef = this.dialog.open(AddAmenitiesComponent, {
      width: "800px",
      data: {
        type: 2,
        id: id,
        content: dataObj,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        this.getAmenities(0);
      }
    });
    event.stopPropagation();
  }

  deleteAmenities(id, event): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this amenity?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("sales/projectAmenity/delete?id=" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {});
            this.getAmenities(this.offset);
          });
      }
    });
    event.stopPropagation();
  }

  getAmenities(page): void {
    let Data = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
    };
    this.apiService
      .getDataInputValue("user/projectAmenity", Data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.sizeofTable = res.totalPages * 10;
        this.amenitiesList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    this.getAmenities(this.offsetdb);
  }
}
