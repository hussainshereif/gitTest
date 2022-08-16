import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { CPGroupCreateComponent } from "../cp-group-create/cp-group-create.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-cp-group-list",
  templateUrl: "./cp-group-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class CPGroupListComponent implements OnInit, OnDestroy {
  cpGroupList: any;
  ladderData: any;
  ladderlist: any;
  offset: number = 0;
  offsetdb;
  recordsPerPage: number = 10;
  sizeofTable: any;
  sort: any = "";
  sortingAcending: boolean = true;
  searchValue: any = "";
  totalRecords: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCpGroup(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addLadderData(data): void {
    data.forEach((element) => {
      const inputData = {
        groupId: element.id,
        pageNumber: 0,
        pageSize: 100000,
        sortBy: "",
        isAscending: true,
      };
      let url = "admin/ladder/by-group-id";
      let laddrNames = [];
      this.apiService
        .getDataInputValue(url, inputData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          res.content.forEach((element) => {
            laddrNames.push(element.name);
          });
          element["ladders"] = laddrNames.toString();
        });
    });
    return data;
  }

  public createCpGroup(): void {
    let dialogRef = this.dialog.open(CPGroupCreateComponent, {
      width: "490px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCpGroup(this.offsetdb);
    });
  }

  public deleteCpGroup(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the Group?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("admin/group/delete/" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Group has been deleted"
            ).subscribe((result) => {});
            this.getCpGroup(this.offsetdb);
          });
      }
    });
  }

  public editCpGroup(id): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { isEdit: true },
    };
    this.router.navigate(["/cp-group/details", id], navigationExtras);
  }

  private getCpGroup(page): void {
    const inputData = {
      name: this.searchValue,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: this.sort,
      isAscending: this.sortingAcending,
    };
    let url = "admin/group";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        let cplist = this.addLadderData(res.content);
        this.cpGroupList = cplist;
        this.totalRecords = res.totalElements;
      });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.sort = e.sortField != undefined ? e.sortField : "";
    this.sortingAcending = e.sortOrder === 1 ? true : false;
    this.searchValue = e.globalFilter != undefined ? e.globalFilter : "";
    if (this.offsetdb > 0) {
      this.getCpGroup(this.offsetdb);
    } else {
      let init = 0;
      this.getCpGroup(init);
    }
  }

  public showDetails(id): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { isEdit: false },
    };
    this.router.navigate(["/cp-group/details", id], navigationExtras);
  }
}
