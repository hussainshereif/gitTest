import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";
import { FailedExcelListComponent } from "src/app/dialogs/failed-excel-list/failed-excel-list.component";
import { ViewLogComponent } from "../../../dialogs/view-log/view-log.component";

@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  styleUrls: ["./employee.component.css"],
})
export class EmployeeComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  sizeofTable;
  employeeList = [];
  uploadStatus: string;
  bgValidation: { valid: boolean; insize: boolean };
  isProcessingVisible: boolean = false;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getEmployeeDetails(this.offset);
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
  getEmployeeDetails(page) {
    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("employee/employeeList", body.toString())
      .subscribe((res) => {
        this.employeeList = res["result"].employeeList;
        this.sizeofTable = res["result"].totalRecords;
      });
  }

  cpList(empId) {
    let navigationExtras: NavigationExtras = {
      queryParams: { empId: empId },
    };
    this.router.navigate(["/employee-cp-list"], navigationExtras);
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
            "empExcelFile",
            fileInput.target.files[0],
            fileInput.target.files[0].name
          );
          let url = "employee/uploadEmployeeExcel";
          this.apiService.uploadExcel(formData, url).subscribe((event) => {
            this.isProcessingVisible = false;
            if (event["status"] == 0) {
              fileInput.target.value = "";
              this.uploadStatus = "File upload failed!!";
              let failedSFDC = event["result"].failedSfdcCps;
              this.openFailedList(failedSFDC);
            } else if (event["status"] == 1) {
              this.uploadStatus = "Upload Done";
              let failedSFDC = event["result"].failedSfdcCps;
              this.openFailedList(failedSFDC);
              this.offsetdb = this.offset - 1;
              if (this.offsetdb > 0) {
                this.getEmployeeDetails(this.offsetdb * 10);
              } else {
                let init = 0;
                this.getEmployeeDetails(init);
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

  openFailedList(sfdcs: any[]) {
    if (sfdcs.length > 0) {
      this.dialog.open(FailedExcelListComponent, {
        width: "380px",
        data: {
          FCPSfdcArray: sfdcs,
          FCPPhoneArray: "",
          FIncorrectFormat: "",
        },
      });
    }
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getEmployeeDetails(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getEmployeeDetails(init);
    }
  }
  viewLog() {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "650px",
      data: { type: 3, offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
