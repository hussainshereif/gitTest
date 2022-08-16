import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";
import { SchemeViewComponent } from "./scheme-view/scheme-view.component";
import { SchemeCreateComponent } from "./scheme-create/scheme-create.component";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-scheme",
  templateUrl: "./scheme-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class SchemeListComponent implements OnInit {
  @Input("projectId") projectId;

  offset: number = 0;
  offsetdb;
  projectName: string;
  recordsPerPage: number = 10;
  sizeofTable: number;
  schemeList: any;
  totalRecords: number;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSchemes(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public createSchemes(): void {
    let dialogRef = this.dialog.open(SchemeCreateComponent, {
      width: "650px",
      data: { projectId: this.projectId, projectName: this.projectName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getSchemes(this.offsetdb);
    });
  }

  public deleteSchemes(id: number): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this Scheme?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.onDelete(id);
      }
    });
  }

  public editSchemes(scheme: []): void {
    let dialogRef = this.dialog.open(SchemeCreateComponent, {
      width: "650px",
      data: {
        projectId: this.projectId,
        projectName: this.projectName,
        scheme: scheme,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getSchemes(this.offsetdb);
    });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.getSchemes(this.offsetdb);
  }

  public preview(scheme: []): void {
    let dialogRef = this.dialog.open(SchemeViewComponent, {
      width: "650px",
      data: { projectId: this.projectId, scheme: scheme },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  private getSchemes(page): void {
    const inputData = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    let url = "user/projectScheme";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.schemeList = res.content;
        this.projectName = res.projectName;
        this.totalRecords = res.totalElements;
      });
  }

  private onDelete(id) {
    this.apiService
      .postDataNotJSON("sales/projectScheme/delete?id=" + id, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getSchemes(this.offset);
        if (res["status"] == 1) {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Deleted successfully!!"
          ).subscribe((result) => {});
        }
      });
  }
}
