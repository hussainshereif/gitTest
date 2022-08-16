import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AddSmComponent } from "../../../../dialogs/add-sm/add-sm.component";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";
import { environment } from "../../../../../environments/environment";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-sm-list",
  templateUrl: "./manage-sm-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ManageSmListComponent implements OnInit, OnDestroy {
  public isProcessingVisible: boolean = false;
  public offset: number = 0;
  public recordsPerPage: number = 10;
  public sizeofTable: number;
  public smExcel: string = environment.COMMON_FILES.SM_EXCEL;
  public smList: any = [];
  public totalRecords: any;
  public uploadStatus: string;

  private bgValidation = { valid: true, insize: true };
  private offsetdb: any = 0;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getSMList(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addSM(): void {
    let dialogRef = this.dialog.open(AddSmComponent, {
      width: "400px",
      data: {
        type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        this.getSMList(0);
      }
    });
  }

  getSMList(page: number): void {
    let url =
      "admin/sales-manager?pageNumber=" +
      page +
      "&pageSize=" +
      this.recordsPerPage +
      "&sortBy=&isAscending=true";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.smList = res.content;
        this.sizeofTable = res.totalPages * 10;
        this.totalRecords = res.totalElements;
      });
  }

  onClickSMId(id: string, crmid: string, name: string): void {
    var data = { Id: id, crmId: crmid, Name: name };
    this.route.navigate(["/manage-sm/manage-sm-details", data]);
  }

  onDeleteSM(id: string): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete this SM?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        let url = "admin/sales-manager/delete/" + id;
        this.apiService
          .postData(url, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully"
            ).subscribe((result) => {});
          });
      }
    });
  }

  onEditSM(smId: string, sm: any): void {
    let dataObj = sm;
    let dialogRef = this.dialog.open(AddSmComponent, {
      width: "400px",
      data: {
        type: 2,
        id: smId,
        content: dataObj,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        this.getSMList(0);
      }
    });
  }

  paginatedSearch(e: any): void {
    this.offsetdb = e.first / 10;
    if (this.offsetdb > 0) {
      this.getSMList(this.offsetdb);
    } else {
      let init = 0;
      this.getSMList(init);
    }
  }

  async uploadExcel(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "xlsx" || file == "xls") {
      this.isProcessingVisible = true;
      this.uploadStatus = "";
      if (fileInput.target.files && fileInput.target.files[0]) {
        this.bgValidation = this.apiService.getExcellValidation(
          fileInput.target.files[0]
        );
        if (this.bgValidation.valid == true) {
          let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest();

          formData.append(
            "file",
            fileInput.target.files[0],
            fileInput.target.files[0].name
          );
          let url = "/admin/sales-manager/excel";
          this.apiService
            .uploadExcel(formData, url)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (event) => {
                this.isProcessingVisible = false;
                if (event.status == "SUCCESS") {
                  this.uploadStatus = "Upload Done";
                  this.getSMList(this.offsetdb);
                } else {
                  AlertComponent.showAlert(
                    this.dialog,
                    event.status,
                    event.excelErrorDetailList[0].reason
                  );
                }
              },
              (error) => {
                this.uploadStatus = "File Upload Failed";
                this.isProcessingVisible = false;
              }
            );
        } else {
          if (this.bgValidation.insize == false)
            this.uploadStatus = "File size cannot exceed 1 MB";
          else this.uploadStatus = "File Format is invalid!";
        }
      }
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.xlsx and *.xls"
      );
    }
  }

  viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "800px",
      data: { type: "User", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
