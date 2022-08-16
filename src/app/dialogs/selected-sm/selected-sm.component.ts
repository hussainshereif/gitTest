import { Component, Inject, OnInit } from "@angular/core";

import { AlertComponent } from "../alert/alert.component";
import { RemoteApisService } from "../../commonservice/remote-apis.service";

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-selected-sm",
  templateUrl: "./selected-sm.component.html",
  styleUrls: ["../../css/style.css"],
})
export class SelectedSMComponent implements OnInit {
  public dataList: any = [];
  public errorMessage: string = "";
  public isError: boolean = false;
  public offset: number = 0;
  public projectList: any = [];
  public recordsPerPage: number = 10;
  public selectObj: any;
  public selectedProject: any;
  public SMList: any = [];
  public SMNotSelected: boolean = true;
  public sizeofTable: number;

  private destroy$: Subject<void> = new Subject();
  private offsetdb: number = 0;
  private SMId: any = "";
  private userIds: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SelectedSMComponent>
  ) {}

  ngOnInit(): void {
    this.dataList = this.data;
    this.userIds = this.dataList.map((e) => {
      return e.id;
    });

    this.getProjectList();
    this.getSM(this.offset, "", "");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectList(): void {
    let url = "user/project/names";
    this.apiService.getData(url).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.projectList = res;
    });
  }

  getSM(page, key, keyValue): void {
    let url = "admin/sales-manager";
    let inputData = {
      isAscending: true,
      pageNumber: page,
      pageSize: 1000,
      sortBy: "",
      searchBy: key,
      value: keyValue,
    };
    this.apiService.getDataInputValue(url, inputData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.SMList = res.content;
      this.sizeofTable = res.totalPages * 10;
    });
  }

  onAssign(): void {
    this.isError = false;
    let userId = "";
    if (this.selectObj.crmId != null) {
      userId = this.selectObj.crmId;
    }
    let url =
      "admin/sales-manager/assign-users/" +
      this.SMId +
      "?userIds=" +
      this.userIds;
    this.apiService.postData(url, "").pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Assigned successfully"
        ).subscribe((result) => {
          this.dialogRef.close();
        });
      },
      (error) => {
        this.isError = true;
        this.errorMessage = error.message;
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelectSM(id): void {
    this.SMNotSelected = false;
    this.SMId = id;
  }

  paginatedSearch(e): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getSM(this.offsetdb, "", "");
    } else {
      let init = 0;
      this.getSM(init, "", "");
    }
  }
}
