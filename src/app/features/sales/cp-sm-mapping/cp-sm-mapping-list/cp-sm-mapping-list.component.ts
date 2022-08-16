import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "../../../../../environments/environment";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { SelectedSMComponent } from "../../../../dialogs/selected-sm/selected-sm.component";

import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { Table } from "primeng/table";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-cp-sm-mapping-list",
  templateUrl: "./cp-sm-mapping-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class CpSmMappingListComponent implements OnInit, OnDestroy {
  @ViewChild("dt") tt: Table;

  public arrObj: any = [];
  public cityList: any = [];
  public cities: any = [];
  private cityName: string = "";
  public cpList: any = [];
  public filterForm: FormGroup;
  public filterList: boolean;
  public isProcessingVisible: boolean = false;
  public microMarketList: any = [];
  public numberOfElements: any;
  public offset: number = 0;
  private offsetdb: number = 0;
  public recordsPerPage: number = 10;
  public showFilter: boolean;
  public sizeofTable: number;
  public SMList: any = [];
  public smExcel: string = environment.COMMON_FILES.CP_SM_EXCEL;
  public sortingAcending: boolean = true;
  public sort: string = "";
  public startIndex: any;
  public status: any[] = [
    { name: "status", value: "REGISTERED" },
    { name: "status", value: "PENDING_APPROVAL" },
    { name: "status", value: "AWAITING_DOCUMENTATION" },
    { name: "status", value: "AWAITING_AGREEMENT_SIGNING" },
  ];
  public submitted: boolean = false;
  public subRegion: string = "";
  public subRegionList: any = [];
  public totalRecords: any;
  public userName: any;
  public uploadStatus: string;

  private bgValidation = { valid: true, insize: true };
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.cityList = this.apiService.indianCitiesNameList;
    this.cities = this.getCollectionList(this.cityList);
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem("userName");
    this.getCPSM(this.offset, "", "", "", "");
    this.getSM(this.offset, "", "");
    this.formValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.filterForm.get("market").clearValidators();
    this.filterForm.get("region").clearValidators();
    this.filterForm.controls["market"].updateValueAndValidity();
    this.filterForm.controls["region"].updateValueAndValidity();
    this.showFilter = false;
    this.filterList = false;
    this.offsetdb = 0;
    this.getCPSM(this.offsetdb, "", "", "", "");
  }

  closeNav(): void {
    this.showFilter = false;
  }

  get f() {
    return this.filterForm.controls;
  }

  filterFormSubmit(page: any = 0) {
    this.submitted = true;
    if (!this.filterForm.valid) return;

    this.filterList = true;
    let value = "";
    let key = "";

    if (this.filterForm.controls.market.value) {
      key = "MICRO_MARKET";
      value = this.filterForm.controls.market.value;
    } else if (this.filterForm.controls.region.value) {
      key = "SUB_REGION";
      value = this.filterForm.controls.region.value;
    } else if (this.filterForm.controls.city.value) {
      key = "CITY";
      value = this.filterForm.controls.city.value;
    }

    this.getCPSM(
      page,
      key,
      value,
      this.filterForm.controls.status.value,
      this.filterForm.controls.salesM.value
    );
  }

  formValidation(): void {
    this.filterForm = this.fb.group({
      city: [""],
      market: [""],
      region: [""],
      status: [""],
      salesM: [""],
    });
  }

  getCollectionList(collectionArray: any[]): any[] {
    let collection: any[] = [];
    for (let value of collectionArray) {
      collection.push({ label: "name", value: value });
    }
    return collection;
  }

  getCPSM(page: number, key: string, value: any, status: any, smID: any): void {
    let url = "admin/channelPartner/sm-filter";
    if (status == undefined) {
      status = "";
    }
    if (smID == undefined) {
      smID = "";
    }
    if (value == undefined || value == "") {
      value = "";
      key = "";
    }

    let data = {
      isAscending: this.sortingAcending,
      key: key,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      smId: smID,
      status: status,
      sortBy: this.sort,
      value: value,
    };
    this.apiService
      .getDataInputValue(url, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpList = res.content;
        this.sizeofTable = res.totalPages * 10;
        this.totalRecords = res.totalElements;
        this.numberOfElements = res.numberOfElements;
        this.startIndex = res.pageable.offset;
      });
  }

  getFilterMicroMarket(subregion: string): void {
    let url =
      "user/city-region/micromarket?city=" +
      this.cityName +
      "&subregion=" +
      subregion;
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.length > 0) {
          this.microMarketList = this.getCollectionList(res);
        } else {
          this.microMarketList = [];
        }
      });
  }

  getFilterSubRegion(city: string): void {
    this.cityName = city;
    let url = "user/city-region/micromarket?city=" + city;
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.length > 0) {
          this.subRegionList = this.getCollectionList(res);
        } else {
          this.subRegionList = [];
        }
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
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.SMList = res.content;
      });
  }

  openNav(): void {
    this.showFilter = true;
  }

  paginatedSearch(e: any): void {
    this.offsetdb = e.first / 10;
    this.sort = e.sortField != undefined ? e.sortField : "";
    this.sortingAcending = e.sortOrder === 1 ? true : false;
    if (this.filterList === true) {
      this.filterFormSubmit(this.offsetdb);
    } else {
      this.getCPSM(this.offsetdb, "", "", "", "");
    }
    this.arrObj = [];
  }
  async uploadExcel(fileInput: any = null) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file === "xlsx" || file === "xls") {
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
          let url = "/admin/sales-manager/assign-users/excel";
          this.apiService
            .uploadExcel(formData, url)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (event) => {
                this.isProcessingVisible = false;
                if (event.status == "SUCCESS") {
                  this.uploadStatus = "Upload Done";
                  this.clearFilter();
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
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.xlsx and *.xls"
      );
    }
  }

  selectedSM(): void {
    let dialogRef = this.dialog.open(SelectedSMComponent, {
      width: "900px",
      data: this.arrObj,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
