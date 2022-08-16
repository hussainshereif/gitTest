import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { GalleryCreateComponent } from "./project-gallery-create/project-gallery-create.component";
import { GalleryViewComponent } from "./project-gallery-view/project-gallery-view.component";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class GalleryListComponent implements OnInit {
  @Input("projectId") projectId;

  galleryList: any;
  offset: number = 0;
  offsetdb;
  recordsPerPage: number = 10;
  sizeofTable: any;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getGallery(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    if (this.offsetdb > 0) {
      this.getGallery(this.offsetdb);
    } else {
      let init = 0;
      this.getGallery(init);
    }
  }

  public createGallery(): void {
    let dialogRef = this.dialog.open(GalleryCreateComponent, {
      width: "650px",
      data: { projectId: this.projectId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGallery(this.offsetdb);
    });
  }

  public editGallery(e): void {
    let dialogRef = this.dialog.open(GalleryCreateComponent, {
      width: "650px",
      data: { projectId: this.projectId, gallery: e },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGallery(this.offsetdb);
    });
  }

  public deleteGallery(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this brochure?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postDataNotJSON("sales/projectGallery/delete?id=" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.getGallery(this.offset);
            if (res["status"] == 1) {
              AlertComponent.showAlert(
                this.dialog,
                "",
                "Deleted successfully!!"
              ).subscribe((result) => {});
            }
          });
      }
    });
  }

  public preview(gallery): void {
    let dialogRef = this.dialog.open(GalleryViewComponent, {
      width: "650px",
      data: { projectId: this.projectId, gallery: gallery },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  private getGallery(page): void {
    const inputData = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    let url = "user/projectGallery";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.galleryList = res.content;
        if (this.galleryList.length > 0) {
          this.galleryList = this.galleryList.map((item) => {
            item.fileName = item.url.split("/").pop();
            return item;
          });
        }
        this.totalRecords = res.totalElements;
      });
  }
}
