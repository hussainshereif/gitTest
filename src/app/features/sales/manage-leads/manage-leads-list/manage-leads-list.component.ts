import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

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
  selector: "app-manage-leads",
  templateUrl: "./manage-leads-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ManageLeadsComponent implements OnInit, OnDestroy {
  @ViewChild("dt") tt: Table;

  bgValidation = { valid: true, insize: true };
  currentFile: any;
  cpList: any = [];
  filterForm: FormGroup;
  filterList: boolean = false;
  isProcessingVisible: boolean = false;
  leadExcel: string = environment.COMMON_FILES.LEAD_EXCEL;
  leadList: any = [];
  leadOptions: any = [];
  offset: number = 0;
  offsetdb: number;
  project: any = [];
  recordsPerPage: number = 10;
  searchValues: string = "";
  status: any[] = [
    { name: "Booking Cancelled", value: "BOOKING_CANCELLED" },
    { name: "Booking Done", value: "BOOKING_DONE" },
    { name: "Enquiry", value: " ENQUIRY" },
    { name: "Lost", value: " LOST" },
    { name: "Registration Done", value: " REGISTRATION_DONE" },
    { name: "Rejected", value: " REJECTED" },
    { name: "Site Visit Booked", value: " SITE_VISIT_BOOKED" },
    { name: "Site Visit Done", value: " SITE_VISIT_DONE" },
  ];
  showManageCustomers: boolean = environment.showManageCustomers;
  showFilter: boolean = false;
  sizeofTable: number;
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
    this.formCreation();
    this.getProjectList();
    this.getCPList();
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

  closeNav(): void {
    this.showFilter = false;
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
        this.filterForm.value.cpName != null
          ? this.filterForm.value.cpName
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

  filterFormSubmit(page: any = 0): void {
    this.filterList = true;
    this.tt._first = 0;
    this.searchValues = "";
    this.getLeadList(0, this.recordsPerPage);
  }

  fileUpload(fileInput: any): void {
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
        this.apiService
          .uploadExcel(formData, url)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (event) => {
              this.isProcessingVisible = false;
              if (event.status == "SUCCESS") {
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
        if (this.bgValidation.insize == false)
          this.uploadStatus = "File size cannot exceed 1 MB";
        else this.uploadStatus = "File Format is invalid!";
      }
    }
  }

  formCreation(): void {
    this.filterForm = this.fb.group({
      status: [""],
      cpName: [""],
      project: [""],
    });
  }

  getCPList(): void {
    let url = "/admin/user/names?userType=CHANNEL_PARTNER";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.cpList = res;
        console.log(this.cpList);
      });
  }

  get f() {
    return this.filterForm.controls;
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
        this.filterForm.value.cpName != null
          ? this.filterForm.value.cpName
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
    let url = "user/project/names";
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
  }

  openNav(): void {
    this.showFilter = true;
  }

  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    if (this.offsetdb > 0) {
      this.getLeadList(this.offsetdb, this.recordsPerPage);
    } else {
      this.getLeadList(0, this.recordsPerPage);
    }
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
      this.showAlert("", "File format allowed *.xlsx and *.xls");
    }
  }

  viewLog(): void {
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
}
