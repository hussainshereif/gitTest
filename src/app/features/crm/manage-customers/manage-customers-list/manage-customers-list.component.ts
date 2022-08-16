import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";

import { environment } from "../../../../../environments/environment";
import { HelperService } from "../../../../commonservice/common/helper.service";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";

import { Table } from "primeng/table";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-manage-customers",
  templateUrl: "./manage-customers-list.component.html",
  styleUrls: ["./manage-customers-list.component.css"],
})
export class ManageCustomersComponent implements OnInit, OnDestroy {
  @ViewChild("dt") tt: Table;

  approvalStatus: any;
  bgValidation = { valid: true, insize: true };
  customerExcel: string = environment.COMMON_FILES.CUSTOMER;
  currentFile: any;
  cpStatus: any[] = [
    { name: "Active", value: true },
    { name: "Inactive", value: false },
  ];
  customerList: any = [];
  filterForm: FormGroup;
  filterList: boolean = false;
  isProcessingVisible: boolean = false;
  isLoggedIn: boolean = false;
  offset: number = 0;
  offsetdb: number;
  project: any = [];
  recordsPerPage: number = 10;
  searchValue: any = "";
  searchIn: any = "";
  selectedDate: string = "";
  showFilter: boolean = false;
  status: any[] = [
    { name: "NEW USER", value: "NEW_USER" },
    { name: "PENDING APPROVAL", value: "PENDING_APPROVAL" },
    { name: "REGISTERED", value: " REGISTERED" },
  ];
  totalRecords: any;
  uploadStatus: string = "";

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private helperService: HelperService,
    private router: Router
  ) {}

  ngOnInit() {
    this.formCreation();
    this.getCustomerList();
    this.getProjectList();
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private httpErrorController(): void {
    if (localStorage.getItem("httpError") !== undefined) {
      if (localStorage.getItem("httpError") === "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }

  activationStatusChange(cpID, e): void {
    this.apiService
      .postDataNotJSON(
        "admin/user/changeActiveStatus?userId=" + cpID + "&isActive=" + e.value,
        ""
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showAlert("", "Status changed successfully!!");
        this.getCustomerList(this.offsetdb > 0 ? this.offsetdb : 0);
      });
  }

  checkValue(e) {
    this.isLoggedIn = e.checked;
  }

  changeDate(e) {
    this.selectedDate = new Date(
      e.toString().replace(/GMT.*$/, "GMT+0000")
    ).toISOString();
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.offset = 0;
    this.searchValue = "";
    this.getCustomerList(this.offset);
  }

  cpProfile(cpid): void {
    if (cpid !== undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: { cpid: cpid },
      };
      this.router.navigate(["/manage-customers/customer-details", cpid]);
    }
  }

  formCreation(): void {
    this.filterForm = this.fb.group({
      status: [""],
      project: [""],
      loggedIn: [false],
      cutOffDate: [""],
    });
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
        let url = "admin/customer/uploadExcel";
        this.apiService
          .uploadExcel(formData, url)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (event) => {
              this.isProcessingVisible = false;
              if (event.status === "SUCCESS") {
                this.uploadStatus = "Upload Done";
                this.getCustomerList(this.offsetdb);
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
    this.offset = 0;
    this.searchValue = "";
    this.getCustomerList(this.offset);
  }

  get f() {
    return this.filterForm.controls;
  }

  getCustomerList(page: number = 0): void {
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
      searchValue: this.searchValue,
      statuses: "",
      projectIds: "",
      loggedIn: "",
      loginCutOffDate: "",
    };
    if (this.filterList) {
      data.statuses =
        this.filterForm.value.status != null
          ? this.filterForm.value.status
          : "";
      data.projectIds =
        this.filterForm.value.project != null
          ? this.filterForm.value.project
          : "";
      data.loggedIn =
        this.filterForm.value.loggedIn === true
          ? this.filterForm.value.loggedIn
          : "";
      data.loginCutOffDate =
        this.filterForm.value.cutOffDate != null &&
        this.filterForm.value.loggedIn === true
          ? this.helperService.formatDate(
              this.filterForm.value.cutOffDate,
              "yyyy-MM-dd"
            ) + "T00:00:00.000Z"
          : "";
    }
    this.apiService
      .getDataInputValue("admin/customer/filter", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.customerList = res.content;
        this.totalRecords = res.totalElements;
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

  openNav(): void {
    this.showFilter = true;
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

  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    this.getCustomerList(this.offsetdb > 0 ? this.offsetdb : 0);
  }

  searchValueOffset(searchIn: string): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.offset = 0;
    this.searchValue = searchIn;
    this.getCustomerList(0);
  }

  showAlert(value: any, message: string): void {
    AlertComponent.showAlert(this.dialog, value, message);
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
      this.showAlert("", "File format allowed *.xlsx and *.xls");
    }
  }

  public viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: { type: "CUSTOMER", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public newLoginExcel(): void {
    const data = {
      sortBy: "",
      isAscending: true,
      appType: "CONNECTRE",
    };
    const url = "admin/user/download/new-users";
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
}
