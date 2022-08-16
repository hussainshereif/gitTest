import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { MatDialog } from "@angular/material/dialog";

import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-manage-leads",
  templateUrl: "./manage-leads-list.component.html",
  styleUrls: ["./manage-leads-list.component.css"],
})
export class ManageLeadsComponent implements OnInit {
  bgValidation = { valid: true, insize: true };
  currentFile: any;
  isProcessingVisible: boolean = false;
  leadExcel: string = environment.COMMON_FILES.LEAD_EXCEL;
  LeadList: any = [];
  leadOptions: any = [];
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  showManageCustomers: boolean = environment.showManageCustomers;
  sizeofTable: number;
  uploadStatus: string = "";

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getLeadList(this.offset, this.recordsPerPage, "", "");
    this.getLeadOptions();
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  public downloadExcel(sort, key, keyValue): void {
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
    this.apiService.getDataInputValue(url, data).subscribe((res) => {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "The excel report is being processed. It will be emailed to your email address as an attachment once it is ready. Thank you!"
      );
      // if (res.status == "SUCCESS") {
      //   let link = document.createElement("a");
      //   link.href = res.message;
      //   link.click();
      // } else {
      //   AlertComponent.showAlert(this.dialog, "", "Download Failed");
      // }
    });
  }

  public getLeadList(page, pageSize, key, keyValue): void {
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
      .subscribe((res) => {
        this.LeadList = res.content;
        this.sizeofTable = res.totalPages * 10;
      });
  }

  public openFailedList(
    sfdcs: any[],
    phoneNoes: any[],
    incorrectFormat: any[],
    failedvalidation: any[] = [],
    type: any
  ): void {
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

  public paginatedSearch(e): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getLeadList(this.offsetdb, this.recordsPerPage, "", "");
    } else {
      let init = 0;
      this.getLeadList(init, this.recordsPerPage, "", "");
    }
  }

  async uploadExcel(fileInput: any = null) {
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
        let url = "finance/enquiry/uploadExcel";
        this.apiService.uploadExcel(formData, url).subscribe(
          (event) => {
            this.isProcessingVisible = false;
            if (event.status == "SUCCESS") {
              this.uploadStatus = "Upload Done";
              this.getLeadList(this.offsetdb, this.recordsPerPage, "", "");
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
  }

  public viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "800px",
      data: {
        type: "Lead",
        offset: 0,
        recordsPerPage: 10,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  private getLeadOptions(): void {
    let url = "no-auth/enum/lead-search-by";
    this.apiService.getData(url).subscribe((res) => {
      this.leadOptions = res.slice(1, 20);
    });
  }

  private httpErrorController(): void {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") == "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }
}
