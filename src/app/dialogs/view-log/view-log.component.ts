import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { RemoteApisService } from "../../../app/commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-view-log",
  templateUrl: "./view-log.component.html",
  styleUrls: ["./view-log.component.css"],
})
export class ViewLogComponent implements OnInit, OnDestroy {
  logList: any = [];
  offset: number = 0;
  offsetdb;
  recordsPerPage: number = 5;
  sizeofTable: any;
  uType: any;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject<void>();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewLogComponent>,
   
  ) {}

  ngOnInit() {
    this.getViewList(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onCancel() {
    this.dialogRef.close({ result: false });
  }

  private getViewList(page): void {
    const inputData = {
      excelErrorType: this.data.type,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("admin/auditExcelError", inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.sizeofTable = res.totalPages * 10;
        this.logList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    if (this.offsetdb > 0) {
      this.getViewList(this.offsetdb);
    } else {
      let init = 0;
      this.getViewList(init);
    }
  }
}
