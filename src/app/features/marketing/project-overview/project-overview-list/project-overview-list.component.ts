import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-projects-overview-list",
  templateUrl: "./project-overview-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ProjectsOverviewComponent implements OnInit, OnDestroy {
  actStatus;
  filterFields: any = ["projectName", "crmId", "developedBy"];
  offset: number = 0;
  offsetdb: number = 0;
  ProjectList: any = [];
  projectId: number;
  recordsPerPage: number = 500;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProjectList(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editProjectList(pid, event): void {
    this.projectId = pid;
    this.router.navigate(["/project-overview/project-details", this.projectId]);
    event.stopPropagation();
  }

  deleteProjectList(id, event): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the project?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postDataNotJSON("sales/project/delete?id=" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {});
            this.getProjectList(this.offset);
          });
      }
    });
    event.stopPropagation();
  }

  //Project listing start
  getProjectList(page): void {
    // let body = new URLSearchParams();
    // body.append('offset', page);
    // body.append('recordsPerPage', this.recordsPerPage);
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("sales/project", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ProjectList = res.content;
        this.totalRecords = res.totalElements;
        if (this.ProjectList.length > 0) {
          this.ProjectList = this.ProjectList.map((item) => {
            item.isActive = item.projectStatus == 1 ? true : false;
            return item;
          });
        }
      });
  }

  addProjects(): void {
    this.projectId = 0;
    this.router.navigate(["/project-overview/create"]);
    // this.router.navigate(["/project-overview/project-details", this.projectId]);
  }

  changeActiveStatus(i, pdata, currentStatus): void {
    let pid = pdata.id;
    let status = "launched";
    if (currentStatus == true) {
      this.actStatus = false;
      status = "deactivated";
    } else {
      this.actStatus = true;
    }
    this.apiService
      .postDataNotJSON(
        "sales/project/launch/" + pid + "?isLaunched=" + this.actStatus,
        ""
      )
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Project " + status + " successfully!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        this.getProjectList(this.offset);
      });
  }
}
