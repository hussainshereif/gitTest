import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { MatDialog } from "@angular/material/dialog";
import { FailedExcelListComponent } from "src/app/dialogs/failed-excel-list/failed-excel-list.component";
import { ActivatedRoute } from "@angular/router";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
@Component({
  selector: "app-tiers-details",
  templateUrl: "./tiers-details.component.html",
  styleUrls: ["./tiers-details.component.css"],
})
export class TiersDetailsComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  uploadStatus;
  cpTierList = [];
  sizeofTable;
  loyalty: any;
  user: any;
  label: any;
  isProcessingVisible: boolean = false;

  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.loyalty = params["loyalty"];
      this.user = params["user"];
      this.label = params["label"];
    });
  }

  bgValidation = { valid: true, insize: true };

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.uploadStatus = "";
    this.getCPTierList(this.offset);
    setInterval(() => {
      this.httpErrorController();
    }, 1000);
  }
  httpErrorController() {
    if (localStorage.getItem("httpError") != undefined) {
      if (localStorage.getItem("httpError") == "error") {
        this.isProcessingVisible = false;
        localStorage.removeItem("httpError");
      }
    }
  }

  getCPTierList(page) {
    let body = new URLSearchParams();
    body.append("loyaltyId", this.loyalty);
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("brokerage/getTierCpList", body.toString())
      .subscribe((res: any) => {
        this.cpTierList = res.result.cpmasters;
        this.sizeofTable = res.result.totalRecords;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCPTierList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getCPTierList(init);
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
            "cpTierExcel",
            fileInput.target.files[0],
            fileInput.target.files[0].name
          );
          formData.append("tierId", this.loyalty);
          let url = "brokerage/uploadCpTierExcel";
          this.apiService.uploadExcel(formData, url).subscribe((event) => {
            this.isProcessingVisible = false;
            if (event["status"] == 0) {
              // this.getEmployees();
              // Notifications.pageLoader(false);
              fileInput.target.value = "";
              //failed
              this.uploadStatus = "File upload failed!!";
              let failedSFDC = event["result"].failedSfdcCps;
              let failedPhoneNo = [];
              let failedFormat = event["result"].incorrectFormat;
              let failedvalidation = event["result"].failedvalidation;
              let excelType = "";
              this.openFailedList(
                failedSFDC,
                failedPhoneNo,
                failedFormat,
                failedvalidation,
                excelType
              );
            } else if (event["status"] == 1) {
              //  if((event:any)=>event.result.successsfdccps.length!=0){
              this.uploadStatus = "Upload Done";
              //  }else{
              //   this.uploadStatus="File upload failed!!";
              //  }

              let failedSFDC = event["result"].failedSfdcCps;
              let failedPhoneNo = [];
              let failedFormat = event["result"].incorrectFormat;
              let failedvalidation = event["result"].failedvalidation;
              let excelType = "lead";
              this.openFailedList(
                failedSFDC,
                failedPhoneNo,
                failedFormat,
                failedvalidation,
                excelType
              );
              this.offsetdb = this.offset - 1;
              if (this.offsetdb > 0) {
                this.getCPTierList(this.offsetdb * 10);
              } else {
                let init = 0;
                this.getCPTierList(init);
              }
            }
          });
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
}
