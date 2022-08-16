import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-ladder-list",
  templateUrl: "./ladders-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class LadderListComponent implements OnInit, OnDestroy {
  laddersList: any;
  offset: number = 0;
  offsetdb;
  recordsPerPage: number = 10;
  sizeofTable: any;
  searchValue: any;
  sort: any = "";
  sortingAcending: boolean = true;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getLadders(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public createLadder(): void {
    this.router.navigate(["/ladders/create", 0]);
  }

  public editLadder(id): void {
    this.router.navigate(["/ladders/create", id]);
  }

  private getLadders(page): void {
    const inputData = {
      name: this.searchValue,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: this.sort,
      isAscending: this.sortingAcending,
    };
    let url = "admin/ladder";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.laddersList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  public onDeleteLadder(id) {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the ladder?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("admin/ladder/delete/" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Ladder has been deleted"
            ).subscribe((result) => {});
            this.getLadders(this.offset);
          });
      }
    });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.searchValue = e.globalFilter != undefined ? e.globalFilter : "";
    this.sort = e.sortField != undefined ? e.sortField : "";
    this.sortingAcending = e.sortOrder === 1 ? true : false;
    if (this.offsetdb > 0) {
      this.getLadders(this.offsetdb);
    } else {
      let init = 0;
      this.getLadders(init);
    }
  }

  public showDetails(id): void {
    this.router.navigate(["/ladders/details", id]);
  }
}
