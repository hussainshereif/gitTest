import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { AddProjectComponent } from "../../../../dialogs/add-project/add-project.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @Input("id") smId;

  public cpId;
  public offset: number = 0;
  public projectCP: boolean = false;
  public projectList: any = [];
  public recordsPerPage: number = 10;
  public selectedProject: any;
  public sizeofTable;

  private destroy$: Subject<void> = new Subject<void>();
  private offsetdb: number = 0;

  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProject(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addSMProject(): void {
    let dialogRef = this.dialog.open(AddProjectComponent, {
      width: "450px",
      data: { id: this.smId },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Project has been added successfully"
        ).subscribe((result) => {
          this.getProject(this.offsetdb);
        });
      }
    });
  }

  backAction(ev: any): void {
    this.projectCP = ev.result;
  }

  getProject(page: number): void {
    let url = "admin/project/sm";
    let data = {
      smId: this.smId,
      pageNumber: page,
      pageSize: 80,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue(url, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectList = res.content;
        this.sizeofTable = res.totalPages * 10;
      });
  }

  paginatedSearch(e: any): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getProject(this.offsetdb);
    } else {
      let init = 0;
      this.getProject(init);
    }
  }

  projectNameClicked(project: any): void {
    this.projectCP = true;
    this.cpId = project.id;
    this.selectedProject = project;
  }

  projectRemoveClicked(id: string): void {
    let url: string =
      "admin/sales-manager/un-assign-projects/" +
      this.smId +
      "?projectIds=" +
      id;
    this.apiService
      .postData(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res.status == "PARTIAL SUCCESS") {
          AlertComponent.showAlert(this.dialog, "", res.message).subscribe(
            (result) => {}
          );
        }
        this.getProject(this.offsetdb);
      });
  }
}
