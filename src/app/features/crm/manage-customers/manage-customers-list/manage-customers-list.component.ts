import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";

import { environment } from "../../../../../environments/environment";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";

@Component({
  selector: "app-manage-customers",
  templateUrl: "./manage-customers-list.component.html",
  styleUrls: ["./manage-customers-list.component.css"],
})
export class ManageCustomersComponent implements OnInit {
  activationList = [];
  activationStatus;
  approvalStatus: any;
  bgValidation = { valid: true, insize: true };
  customerExcel: string = environment.COMMON_FILES.CUSTOMER;
  currentFile: any;
  cType: any = 1;
  customerList: any = [];
  isProcessingVisible: boolean = false;
  offset;
  offsetdb;
  recordsPerPage;
  showIndex;
  sizeofTable; //need from api side for listing or cal length
  searchValue: any = "";
  searchIn: any = "";
  uploadStatus;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.uploadStatus = "";
    this.offset = 0;
    this.recordsPerPage = 10;
    this.searchValue = "";
    this.searchIn = "";
    this.getCustomerList(this.offset, this.searchValue, this.searchIn);
    this.activationList = [
      { Value: 0, Text: "Pending" },
      { Value: 1, Text: "Active" },
      { Value: 3, Text: "Inactive" },
    ];
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  private httpErrorController(): void {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") == "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }

  public getCustomerList(page, searchValue, searchIn): void {
    if (searchValue) {
      this.searchValue = searchValue;
    }
    this.searchIn = searchIn;
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
      key: searchValue,
      value: searchIn,
      role: "CUSTOMER",
    };
    this.apiService
      .getDataInputValue("admin/user", data)
      .subscribe((res: any) => {
        this.sizeofTable = res.totalPages * 10;
        this.customerList = res.content;
      });
  }

  public searchValueOffset(page, searchValue, searchIn): void {
    this.offset = 1;
    this.getCustomerList(page, searchValue, searchIn);
  }

  public paginatedSearch(e): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCustomerList(this.offsetdb, this.searchValue, this.searchIn);
    } else {
      let init = 0;
      this.getCustomerList(init, this.searchValue, this.searchIn);
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
        let url = "admin/customer/uploadExcel";
        this.apiService.uploadExcel(formData, url).subscribe(
          (event) => {
            this.isProcessingVisible = false;
            if (event.status == "SUCCESS") {
              this.uploadStatus = "Upload Done";
              this.getCustomerList(
                this.offsetdb,
                this.searchValue,
                this.searchIn
              );
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

  public activationStatusChange(cpID, e): void {
    this.apiService
      .postDataNotJSON(
        "admin/user/changeActiveStatus?userId=" +
          cpID +
          "&isActive=" +
          e.target.value,
        ""
      )
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getCustomerList(this.offsetdb, this.searchValue, this.searchIn);
        } else {
          let init = 0;
          this.getCustomerList(init, this.searchValue, this.searchIn);
        }
      });
  }

  openFailedList(
    sfdcs: any[],
    phoneNoes: any[],
    incorrectFormat: any[],
    type: any
  ) {
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

  public cpProfile(cpid): void {
    if (cpid != undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: { cpid: cpid },
      };
      this.router.navigate(["/manage-customers/customer-details", cpid]);
    }
  }

  public viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: { type: "CUSTOMER", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
