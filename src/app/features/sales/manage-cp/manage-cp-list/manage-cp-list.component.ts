import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";
import { environment } from "../../../../../environments/environment";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-cp-list",
  templateUrl: "./manage-cp-list.component.html",
  styleUrls: ["./manage-cp-list.component.css"],
})
export class ManageCPComponent implements OnInit {
  activationList = [];
  activationStatus;
  approvalStatus: any;
  baseUrl: string;
  bgValidation = { valid: true, insize: true };
  cpExcel: string = environment.COMMON_FILES.CP_EXCEL;
  cpList: any = [];
  cType: any = 1;
  cpStatusList: any[];
  currentFile: any;
  isProcessingVisible: boolean = false;
  offset;
  offsetdb;
  recordsPerPage;
  showIndex;
  searchValue: any = "";
  searchIn: any = "";
  statusval: any = "All";
  sortVal: any;
  sizeofTable; //need from api side for listing or cal length
  uploadStatus;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private _http: HttpClient,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.baseUrl = this.apiService.url;
    this.uploadStatus = "";
    this.offset = 0;
    this.recordsPerPage = 10;
    this.searchValue = "";
    this.searchIn = "";
    this.getCPList(this.offset, this.searchValue, this.searchIn);
    this.getCpStatus();
    this.activationList = [
      { Value: 0, Text: "Pending" },
      { Value: 1, Text: "Active" },
      { Value: 3, Text: "Inactive" },
    ];
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public activationStatusChange(cpID, e): void {
    this.apiService
      .postDataNotJSON(
        "admin/channelPartner/changeActiveStatus?cpId=" +
          cpID +
          "&isActive=" +
          e.target.value,
        ""
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getCPList(this.offsetdb, this.searchValue, this.searchIn);
        } else {
          let init = 0;
          this.getCPList(init, this.searchValue, this.searchIn);
        }
      });
  }

  public cpProfile(cpid): void {
    if (cpid != undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: { cpid: cpid },
      };
      this.router.navigate(["/manage-CPList/cp-profile", cpid]);
    }
  }
  public getCpStatus(): void {
    let url = "no-auth/enum/cp-statuses";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpStatusList = res;
        this.cpStatusList.unshift("All");
      });
  }

  public getCPList(page, searchValue, searchIn): void {
    this.searchIn = searchValue === "status" ? this.statusval : this.sortVal;
    if (searchValue) this.searchValue = searchValue;
    if (this.searchIn === "All") this.searchIn = "";
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
      key: searchValue,
      value: this.searchIn,
    };
    this.apiService
      .getDataInputValue("admin/channelPartner", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.sizeofTable = res.totalPages * 10;
        this.cpList = res.content;
      });
  }

  public httpErrorController(): void {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") === "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }
  public onChangeStatus(e): void {
    this.getCPList(0, "status", e.target.data);
  }

  public onChangeSearch(page, searchValue, searchIn): void {
    this.sortVal = "";
    this.statusval = "All";
    this.getCPList(page, searchValue, searchIn);
  }

  public openFailedList(
    sfdcs: any[],
    phoneNoes: any[],
    incorrectFormat: any[],
    type: any
  ): void {
    this.dialog.open(FailedExcelListComponent, {
      width: "380px",
      data: {
        excelType: type,
        FCPSfdcArray: sfdcs,
        FCPPhoneArray: phoneNoes,
        FIncorrectFormat: incorrectFormat,
      },
    });
  }

  public onStatusChange(id, status): void {
    let url =
      "admin/channelPartner/changeCPStatus?cpId=" + id + "&cpStatus=" + status;
    this.apiService
      .postDataNotJSON(url, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getCPList(this.offsetdb, this.searchValue, this.searchIn);
        } else {
          let init = 0;
          this.getCPList(init, this.searchValue, this.searchIn);
        }
      });
  }

  public paginatedSearch(e): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCPList(this.offsetdb, this.searchValue, this.searchIn);
    } else {
      let init = 0;
      this.getCPList(init, this.searchValue, this.searchIn);
    }
  }

  async uploadExcel(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file === "xlsx" || file === "xls") {
      ConfirmationComponent.showConfirmation(
        this.dialog,
        "Confirmation",
        "Please note that this action cannot be reversed. Are you sure you want to continue with the data upload?",
        "Continue",
        "Cancel Upload"
      ).subscribe((result) => {
        if (result.result) {
          this.fileUpload(fileInput);
        } else {
          this.currentFile = null;
        }
      });
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.xlsx and *.xls"
      );
    }
  }

  public fileUpload(fileInput: any): void {
    this.isProcessingVisible = true;
    this.uploadStatus = "";
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.bgValidation = this.apiService.getExcellValidation(
        fileInput.target.files[0]
      );
      if (this.bgValidation.valid === true) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

        formData.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        let url = "admin/channelPartner/uploadExcel";
        this.apiService.uploadExcel(formData, url).subscribe(
          (event) => {
            this.isProcessingVisible = false;
            if (event.status === "SUCCESS") {
              this.uploadStatus = "Upload Done";
              this.getCPList(this.offsetdb, this.searchValue, this.searchIn);
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
        if (this.bgValidation.insize === false)
          this.uploadStatus = "File size cannot exceed 1 MB";
        else this.uploadStatus = "File Format is invalid!";
      }
    }
  }

  public viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "800px",
      data: { type: "Channel Partner", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
