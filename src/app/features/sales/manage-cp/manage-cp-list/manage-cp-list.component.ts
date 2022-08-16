import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

import { environment } from "../../../../../environments/environment";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { FailedExcelListComponent } from "../../../../dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";
import { HelperService } from "../../../../../app/commonservice/common/helper.service";

import { Table } from "primeng/table";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-cp-list",
  templateUrl: "./manage-cp-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ManageCPComponent implements OnInit, OnDestroy {
  @ViewChild("dt") tt: Table;

  activationList: { Value: boolean; Text: string }[];
  bgValidation = { valid: true, insize: true };
  cpExcel: string = environment.COMMON_FILES.CP_EXCEL;
  cpList: any = [];
  cpStatusList: any[];
  currentFile: any;
  filterForm: FormGroup;
  filterList: boolean;
  isProcessingVisible: boolean = false;
  isLoggedIn: boolean = false;
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  searchIn: string = "";
  statusval: string = "All";
  sortVal: string;
  sort: string = "";
  showFilter: boolean;
  searchValues: string = "";
  statusList: { Value: string; Text: string }[];
  sortingAcending: boolean = true;
  searchValue: string = "";
  totalRecords: number;
  uploadStatus: string;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private helperService: HelperService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCPList(this.offset);
    this.getCpStatus();
    this.formCreation();
    this.statusList = [
      { Value: "REGISTERED", Text: "REGISTERED" },
      { Value: "PENDING_APPROVAL", Text: "PENDING_APPROVAL" },
      { Value: "AWAITING_DOCUMENTATION", Text: "AWAITING_DOCUMENTATION" },
      {
        Value: "AWAITING_AGREEMENT_SIGNING",
        Text: "AWAITING_AGREEMENT_SIGNING",
      },
    ];
    this.activationList = [
      { Value: true, Text: "Active" },
      { Value: false, Text: "Inactive" },
    ];
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
          e.value,
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
        this.getCPList(this.offsetdb);
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

  public clearFilter(): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.getCPList(this.offsetdb);
  }

  public downloadExcel() {
    const data = {
      sortBy: "",
      isAscending: true,
      searchValue: this.searchValues,
      statuses: "",
      loggedIn: "",
      loginCutOffDate: "",
      registeredOnApp: "",
    };
    if (this.filterList === true) {
      data.statuses =
        this.filterForm.value.status != null
          ? this.filterForm.value.status
          : "";
      data.loggedIn =
        this.filterForm.value.loggedIn != null
          ? this.filterForm.value.loggedIn
          : "";
      if (this.filterForm.value.loggedIn) {
        data.loginCutOffDate =
          this.filterForm.value.loginCutOffDate != null
            ? this.helperService.formatDate(
                this.filterForm.value.loginCutOffDate,
                "yyyy-MM-dd"
              ) + "T00:00:00.000Z"
            : "";
      }
      data.registeredOnApp =
        this.filterForm.value.registeredOnApp != null
          ? this.filterForm.value.registeredOnApp
          : "";
    }
    const url = "admin/channelPartner/filter/download";
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

  public newLoginExcel(): void {
    const data = {
      sortBy: "",
      isAscending: true,
      appType: "WINNRE",
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

  public filterFormSubmit(page: any = 0): void {
    this.filterList = true;
    this.tt._first = 0;
    this.searchValue = "";
    this.getCPList(this.offsetdb);
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
        const url = "admin/channelPartner/uploadExcel";
        this.apiService.uploadExcel(formData, url).subscribe(
          (event) => {
            this.isProcessingVisible = false;
            if (event.status === "SUCCESS") {
              this.uploadStatus = "Upload Done";
              this.getCPList(this.offsetdb);
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

  get f() {
    return this.filterForm.controls;
  }

  private formCreation(): void {
    this.filterForm = this.fb.group({
      status: [""],
      loggedIn: [""],
      loginCutOffDate: [""],
      registeredOnApp: [""],
    });
  }
  public getCpStatus(): void {
    const url = "no-auth/enum/cp-statuses";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpStatusList = res;
        this.cpStatusList.unshift("All");
      });
  }

  public getCPList(page): void {
    const inputData = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: this.sort,
      isAscending: this.sortingAcending,
      searchValue: this.searchValues,
      statuses: "",
      loggedIn: "",
      loginCutOffDate: "",
      registeredOnApp: "",
    };
    if (this.filterList === true) {
      inputData.statuses =
        this.filterForm.value.status != null
          ? this.filterForm.value.status
          : "";
      inputData.loggedIn =
        this.filterForm.value.loggedIn != null
          ? this.filterForm.value.loggedIn
          : "";
      if (this.filterForm.value.loggedIn) {
        inputData.loginCutOffDate =
          this.filterForm.value.loginCutOffDate != null
            ? this.helperService.formatDate(
                this.filterForm.value.loginCutOffDate,
                "yyyy-MM-dd"
              ) + "T00:00:00.000Z"
            : "";
      }
      inputData.registeredOnApp =
        this.filterForm.value.registeredOnApp != null
          ? this.filterForm.value.registeredOnApp
          : "";
    }
    const url = "admin/channelPartner/filter";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.cpList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  public openNav(): void {
    this.showFilter = true;
  }

  public onChangeValue(event): void {
    this.isLoggedIn = event.checked;
  }

  public onChangeStatus(e): void {
    this.getCPList(0);
  }

  public onChangeSearch(page, searchValue, searchIn): void {
    this.sortVal = "";
    this.statusval = "All";
    this.getCPList(page);
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
    const url =
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
        this.getCPList(this.offsetdb);
      });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.sort = e.sortField != undefined ? e.sortField : "";
    this.sortingAcending = e.sortOrder === 1 ? true : false;
    this.searchValue = e.globalFilter != undefined ? e.globalFilter : "";
    this.getCPList(this.offsetdb);
  }

  public searchValueOffset(page, pageSize, keyValue): void {
    this.filterForm.reset();
    this.showFilter = false;
    this.filterList = false;
    this.tt._first = 0;
    this.searchValues = keyValue;
    this.getCPList(this.offsetdb);
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

  public viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "800px",
      data: { type: "Channel Partner", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  private showAlert(values: any, message: string): void {
    AlertComponent.showAlert(this.dialog, values, message);
  }
}
