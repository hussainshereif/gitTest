import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";
import { IncentiveCreateComponent } from "./incentive-create/incentive-create.component";
import { IncentiveViewComponent } from "./incentive-view/incentive-view.component";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-incentives",
  templateUrl: "./incentives-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class IncentivesListComponent implements OnInit {
  @Input("projectId") projectId;

  incentivesList: any;
  offset: number = 0;
  offsetdb;
  projectName: string;
  recordsPerPage: number = 10;
  sizeofTable: number;
  totalRecords: number;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getIncentives(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public createIncentives(): void {
    let dialogRef = this.dialog.open(IncentiveCreateComponent, {
      width: "650px",
      data: { projectId: this.projectId, projectName: this.projectName },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getIncentives(this.offsetdb);
    });
  }

  public deleteIncentive(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this Incentive?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.onDelete(id);
      }
    });
  }

  public editIncentive(location): void {
    let dialogRef = this.dialog.open(IncentiveCreateComponent, {
      width: "650px",
      data: {
        projectId: this.projectId,
        projectName: this.projectName,
        location: location,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getIncentives(this.offsetdb);
    });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.getIncentives(this.offsetdb);
  }

  public preview(location): void {
    let dialogRef = this.dialog.open(IncentiveViewComponent, {
      width: "650px",
      data: { projectId: this.projectId, location: location },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  private getIncentives(page): void {
    const inputData = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    let url = "user/projectIncentive";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.incentivesList = res.content;
        this.projectName = res.projectName;
        this.totalRecords = res.totalElements;
      });
  }

  private onDelete(id) {
    this.apiService
      .postDataNotJSON("sales/projectIncentive/delete?id=" + id, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getIncentives(this.offset);
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
