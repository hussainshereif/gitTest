import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  HttpHeaders,
  HttpRequest,
  HttpClient,
  HttpParams,
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";
import { FailedExcelListComponent } from "src/app/dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "src/app/dialogs/view-log/view-log.component";

@Component({
  selector: "app-manage-campaigns",
  templateUrl: "./manage-campaigns-list.component.html",
  styleUrls: ["./manage-campaigns-list.component.css"],
})
export class ManageCampaignsComponent implements OnInit {
  cType: any = 1;
  offset;
  offsetdb;
  recordsPerPage;
  customerList: any = [];
  showIndex;
  sizeofTable; //need from api side for listing or cal length
  uploadStatus;
  activationList = [];
  activationStatus;
  baseUrl: string;
  searchValue: any = "";
  searchIn: any = "";
  isProcessingVisible: boolean = false;
  approvalStatus: any;
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
    this.getCustomerList(this.offset, this.searchValue, this.searchIn);
    this.activationList = [
      { Value: 0, Text: "Pending" },
      { Value: 1, Text: "Active" },
      { Value: 3, Text: "Inactive" },
    ];
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
    // setInterval(() => {
    //   this.refreshTokenCall();
    // }, 90000);
  }

  // refreshTokenCall(){
  //   if (localStorage.getItem("access_token")){
  //      this.apiService.refreshTokenFunction();
  //     }
  //   }

  httpErrorController() {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") == "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }
  bgValidation = { valid: true, insize: true };

  getCustomerList(page, searchValue, searchIn) {
    if (searchValue) {
      this.searchValue = searchValue;
    }
    // if (searchIn) {
    this.searchIn = searchIn;
    // }
    // console.log(searchIn,"searchIn");
    // let body = new URLSearchParams();
    // body.append('searchIn', searchIn);
    // body.append('searchValue', searchValue);
    // body.append('offset', page);
    // body.append('recordsPerPage', this.recordsPerPage);
    let Data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
      key: searchValue,
      value: searchIn,
      role: "CUSTOMER",
    };

    this.apiService
      .getDataInputValue("admin/user", Data)
      .subscribe((res: any) => {
        this.sizeofTable = res.totalPages * 10;
        this.customerList = res.content;
        // console.log(this.CPList,"cp")
      });
  }
  searchValueOffset(page, searchValue, searchIn) {
    this.offset = 1;
    this.getCustomerList(page, searchValue, searchIn);
  }
  paginatedSearch(e) {
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
          let url = "admin/user/uploadExcel";
          this.apiService.uploadExcel(formData, url).subscribe(
            (event) => {
              // console.log(event,"upload event");
              this.isProcessingVisible = false;
              if (event.status == "SUCCESS") {
                this.uploadStatus = "Upload Done";
                this.getCustomerList(
                  this.offsetdb,
                  this.searchValue,
                  this.searchIn
                );
              } else {
                // this.uploadStatus='File Upload Failed';
                AlertComponent.showAlert(
                  this.dialog,
                  event.status,
                  event.excelErrorDetailList[0].reason
                );
              }

              // if (event["status"] == 0) {
              //   fileInput.target.value = '';
              //   this.uploadStatus = "File upload failed!!"
              //   let failedSFDC = event["result"].failedSfdcCps;
              //   let failedPhoneNo = event["result"].failedPhoneNumberCps;
              //   let failedFormat = event["result"].incorrectFormat;
              //   let excelType='';
              //   this.openFailedList(failedSFDC, failedPhoneNo, failedFormat,excelType);
              // }
              // else if (event["status"] == 1) {
              //   this.uploadStatus = "File uploaded successfully!!";
              //   let failedSFDC = event["result"].failedSfdcCps;
              //   let failedPhoneNo = event["result"].failedPhoneNumberCps;
              //   let failedFormat = event["result"].incorrectFormat;
              //   let excelType='lead';
              //   this.openFailedList(failedSFDC, failedPhoneNo, failedFormat,excelType);
              //   this.offsetdb = this.offset - 1;
              //   if (this.offsetdb > 0) {
              //     this.getCPList(this.offsetdb * 10, this.searchValue, this.searchIn);
              //   }
              //   else {
              //     let init = 0;
              //     this.getCPList(init, this.searchValue, this.searchIn);
              //   }
              // }
            },
            (error) => {
              // console.log(error,"error");
              this.uploadStatus = "File Upload Failed";
              this.isProcessingVisible = false;
              // AlertComponent.showAlert(this.dialog,'',error.message);
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

  activationStatusChange(cpID, e) {
    // let cpStatus;
    // if(e.target.value=="AWAITING_DOCUMENTATION"){
    //   cpStatus=false;
    // }else if (e.target.value=="REGISTERED"){
    //   cpStatus=true;
    // }

    this.apiService
      .postDataNotJSON(
        "admin/user/changeActiveStatus?userId=" +
          cpID +
          "&isActive=" +
          e.target.value,
        ""
      )
      .subscribe((res) => {
        //show notification
        // console.log(res,"res activation")
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
    // if (sfdcs.length > 0 || phoneNoes.length > 0 || incorrectFormat.length > 0) {
    this.dialog.open(FailedExcelListComponent, {
      width: "600px",
      data: {
        excelType: type,
        FCPSfdcArray: sfdcs,
        FCPPhoneArray: phoneNoes,
        FIncorrectFormat: incorrectFormat,
      },
    });
    // }
  }

  cpProfile(cpid) {
    if (cpid != undefined) {
      let navigationExtras: NavigationExtras = {
        queryParams: { cpid: cpid },
      };
      this.router.navigate(["/manage-customers/customer-details", cpid]);
    }
  }

  viewLog() {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: { type: "Customers", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  // downloadXls(){
  //   this._http.get("https://s3-ap-southeast-1.amazonaws.com/mldlbucket1/about/23161189.xlsx").subscribe(res=>{

  //   });
  // }
}
