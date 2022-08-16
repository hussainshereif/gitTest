import { Component, OnDestroy, OnInit } from "@angular/core";

import { RemoteApisService } from "../commonservice/remote-apis.service";
import { ConfirmationComponent } from "../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../dialogs/view-log/view-log.component";
import { AlertComponent } from "../dialogs/alert/alert.component";
import { environment } from "../../environments/environment";

import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-leads",
  templateUrl: "./manage-leads.component.html",
  styleUrls: ["./manage-leads.component.css"],
})
export class ManageLeadsComponent implements OnInit, OnDestroy {
  bgValidation = { valid: true, insize: true };
  currentFile: any;
  isProcessingVisible: boolean = false;
  leadOptions: any = [];
  leadList: any = [];
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  sizeofTable;
  showManageCustomers: boolean = environment.showManageCustomers;
  uploadStatus: string = "";

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getLeadList(this.offset, this.recordsPerPage, "", "");

    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  httpErrorController() {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") == "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }

  getLeadList(page, pageSize, key, keyValue) {
    let data = {
      pageNumber: page,
      pageSize: pageSize,
      sortBy: "",
      isAscending: true,
      searchBy: key,
      value: keyValue,
    };
    this.apiService
      .getDataInputValue("finance/enquiry", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        // console.log(res,"result");
        this.leadList = res.content;
        this.sizeofTable = res.totalPages * 10;
        // console.log(this.LeadList,"res",this.LeadList[9].activities[0].date)
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getLeadList(this.offsetdb, this.recordsPerPage, "", "");
    } else {
      let init = 0;
      this.getLeadList(init, this.recordsPerPage, "", "");
    }
  }

  async uploadExcel(fileInput: any = null) {
    // console.log("0");
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "xlsx" || file == "xls") {
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
      // console.log("2");
      this.bgValidation = this.apiService.getExcellValidation(
        fileInput.target.files[0]
      );
      if (this.bgValidation.valid == true) {
        // console.log("3");
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        //   formData.append("createdBy", localStorage.getItem('userName'));
        formData.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        let url = "finance/enquiry/uploadExcel";
        this.apiService
          .uploadExcel(formData, url)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (event) => {
              // console.log("4");
              this.isProcessingVisible = false;
              //  console.log(event,"event");
              if (event.status == "SUCCESS") {
                this.uploadStatus = "Upload Done";
                this.getLeadList(this.offsetdb, this.recordsPerPage, "", "");
              } else {
                // this.uploadStatus = 'File Upload Failed';
                // console.log(event,"event");
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
              // AlertComponent.showAlert(this.dialog,'',error.message);
              // console.log("5");
            }
          );
      } else {
        // console.log("6");
        if (this.bgValidation.insize == false)
          this.uploadStatus = "File size cannot exceed 1 MB";
        else this.uploadStatus = "File Format is invalid!";
      }
    }
  }

  openFailedList(
    sfdcs: any[],
    phoneNoes: any[],
    incorrectFormat: any[],
    failedvalidation: any[] = [],
    type: any
  ) {
    // if(sfdcs.length>0||phoneNoes.length>0||incorrectFormat.length>0 || failedvalidation.length>0){
    this.dialog.open(FailedExcelListComponent, {
      width: "380px",
      data: {
        excelType: type,
        FCPSfdcArray: sfdcs,
        FCPPhoneArray: phoneNoes,
        FIncorrectFormat: incorrectFormat,
        failedvalidation: failedvalidation,
      },
    });
    // }
  }

  viewLog() {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: {
        type: "Lead",
        offset: 0,
        recordsPerPage: 10,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  getLeadOptions() {
    let url = "no-auth/enum/lead-search-by";
    this.apiService.getData(url).subscribe((res) => {
      // console.log(res,"res opt");
      this.leadOptions = res.slice(1, 20);
    });
  }
  downloadExcel(sort, key, keyValue) {
    let source: string = this.showManageCustomers
      ? "REFERRAL"
      : "CHANNEL_PARTNER";
    let data = {
      sortBy: sort,
      isAscending: true,
      searchBy: key,
      source: source,
      value: keyValue,
    };
    let url = "finance/enquiry/download";
    this.apiService
      .getDataInputValue(url, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.status == "SUCCESS") {
          let link = document.createElement("a");
          link.href = res.message;
          link.click();
        } else {
          AlertComponent.showAlert(this.dialog, "", "Download Failed");
        }
      });
  }
}
