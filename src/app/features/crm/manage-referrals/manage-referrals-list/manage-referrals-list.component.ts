import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";

import { environment } from "../../../../../environments/environment";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";

import { Table } from "primeng/table";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-referrals",
  templateUrl: "./manage-referrals-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ManageReferralsComponent implements OnInit, OnDestroy {
  @ViewChild("dt") tt: Table;

  bgValidation = { valid: true, insize: true };
  customerList: any = [];
  customerLeadExcel: string = environment.COMMON_FILES.CUSTOMER_LEAD;
  currentFile: any;
  filterForm: FormGroup;
  filterList: boolean = false;
  first: number;
  isProcessingVisible: boolean = false;
  last: number;
  leadOptions: any = [];
  leadList: any = [];
  offset: number = 0;
  offsetdb: number;
  project: any = [];
  recordsPerPage: number = 10;
  searchValues: string = "";
  showManageCustomers: boolean = environment.showManageCustomers;
  public status: any[] = [
    { name: "Booking Cancelled", value: "BOOKING_CANCELLED" },
    { name: "Booking Done", value: "BOOKING_DONE" },
    { name: "Enquiry", value: " ENQUIRY" },
    { name: "Lost", value: " LOST" },
    { name: "Registration Done", value: " REGISTRATION_DONE" },
    { name: "Rejected", value: " REJECTED" },
    { name: "Site Visit Booked", value: " SITE_VISIT_BOOKED" },
    { name: "Site Visit Done", value: " SITE_VISIT_DONE" },
  ];
  sizeofTable: number;
  showFilter: boolean = false;
  totalRecords: any;
  uploadStatus: string = "";

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getLeadList(this.offset, this.recordsPerPage);
    this.createForm();
    this.getProjectList();
    this.getCustomerList();
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private httpErrorController(): void {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") === "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.getLeadList(0, this.recordsPerPage);
  }

  createForm(): void {
    this.filterForm = this.fb.group({
      status: [""],
      project: [""],
      customerID: [""],
    });
  }

  downloadExcel(): void {
    let source: string = this.showManageCustomers
      ? "REFERRAL"
      : "CHANNEL_PARTNER";
    let data = {
      sortBy: "",
      isAscending: true,
      searchValue: this.searchValues,
      source: source,
      statuses: "",
      projectIds: "",
      userIds: "",
    };
    if (this.filterList === true) {
      data.statuses =
        this.filterForm.value.status != null
          ? this.filterForm.value.status
          : "";
      data.projectIds =
        this.filterForm.value.project != null
          ? this.filterForm.value.project
          : "";
      data.userIds =
        this.filterForm.value.customerID != null
          ? this.filterForm.value.customerID
          : "";
    }
    let url = "finance/enquiry/filter/download";
    this.apiService
      .getDataInputValue(url, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.status === "SUCCESS") {
          this.showAlert(
            "",
            "The excel report is being processed. It will be emailed to your email address as an attachment once it is ready. Thank you!"
          );
        } else {
          this.showAlert("", "Download Failed ");
        }
      });
  }

  get f() {
    return this.filterForm.controls;
  }

  fileUpload(fileInput: any): void {
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
        let url = "finance/enquiry/uploadExcel";
        this.apiService
          .uploadExcel(formData, url)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (event) => {
              this.isProcessingVisible = false;
              if (event.status === "SUCCESS") {
                this.uploadStatus = "Upload Done";
                this.getLeadList(this.offsetdb, this.recordsPerPage);
              } else {
                this.showAlert(
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
        this.uploadStatus =
          this.bgValidation.insize === false
            ? "File size cannot exceed 1 MB"
            : "File Format is invalid!";
      }
    }
  }

  filterFormSubmit(): void {
    this.filterList = true;
    this.tt._first = 0;
    this.searchValues = "";
    this.getLeadList(0, this.recordsPerPage);
  }

  public getCustomerList(): void {
    const url = "/admin/user/names?userType=CUSTOMER";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.customerList = res;
      });
  }

  getLeadList(page, pageSize): void {
    const data = {
      pageNumber: page,
      pageSize: pageSize,
      sortBy: "",
      isAscending: true,
      searchValue: this.searchValues,
      statuses: "",
      projectIds: "",
      userIds: "",
    };
    if (this.filterList === true) {
      data.statuses =
        this.filterForm.value.status != null
          ? this.filterForm.value.status
          : "";
      data.projectIds =
        this.filterForm.value.project != null
          ? this.filterForm.value.project
          : "";
      data.userIds =
        this.filterForm.value.customerID != null
          ? this.filterForm.value.customerID
          : "";
    }
    this.apiService
      .getDataInputValue("finance/enquiry/filter", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.leadList = res.content;
        this.totalRecords = res.totalElements;
        this.sizeofTable = res.totalPages * 10;
      });
  }

  getProjectList(): void {
    const url = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.project = res;
      });
  }

  openFailedList(
    sfdcs: any[],
    phoneNoes: any[],
    incorrectFormat: any[],
    failedvalidation: any[] = [],
    type: any
  ): void {
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
  }
  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    this.getLeadList(
      this.offsetdb > 0 ? this.offsetdb : 0,
      this.recordsPerPage
    );
  }

  sidebarClicked(value: boolean): void {
    this.showFilter = value;
  }

  showAlert(values: any, message: string): void {
    AlertComponent.showAlert(this.dialog, values, message);
  }

  searchValueOffset(page, pageSize, keyValue): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.searchValues = keyValue;
    this.getLeadList(page, pageSize);
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

  viewLog(): void {
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
}
