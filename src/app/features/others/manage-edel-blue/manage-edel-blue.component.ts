import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { MatDialog } from "@angular/material/dialog";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { FailedExcelListComponent } from "../../../dialogs/failed-excel-list/failed-excel-list.component";

@Component({
  selector: "app-manage-edel-blue",
  templateUrl: "./manage-edel-blue.component.html",
  styleUrls: ["./manage-edel-blue.component.css"],
})
export class ManageEdelBlueComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  EdelBlueList: any = [];
  activationList: any = [];
  uploadStatus;
  sizeofTable; //need from api side for listing or cal length
  isProcessingVisible: boolean = false;
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.uploadStatus = "";
    this.offset = 0;
    this.recordsPerPage = 10;

    this.getEdelBlueList(this.offset);
    this.activationList = [
      { Value: 0, Text: "Pending" },
      { Value: 1, Text: "Active" },
      { Value: 3, Text: "Inactive" },
    ];
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

  bgValidation = { valid: true, insize: true };

  getEdelBlueList(page) {
    //  let input={
    //     "offset":this.offset,
    //     "recordsPerPage":this.recordsPerPage
    //   }

    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("cpUser/edelBlueList", body.toString())
      .subscribe((res) => {
        this.EdelBlueList = res["result"].cpList;
        this.sizeofTable = res["result"].totalRecords;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getEdelBlueList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getEdelBlueList(init);
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
          formData.append("createdBy", localStorage.getItem("userName"));
          formData.append(
            "edelBlueUserExcelFile",
            fileInput.target.files[0],
            fileInput.target.files[0].name
          );
          let url = "cpUser/uploadEdelBlueUser";

          this.apiService.uploadExcel(formData, url).subscribe((event) => {
            this.isProcessingVisible = false;

            // // Via this API, you get access to the raw event stream.
            // // Look for upload progress events.
            // if (event.type === HttpEventType.UploadProgress) {
            //   // This is an upload progress event. Compute and show the % done:
            //   const percentDone = Math.round(100 * event.loaded / event.total);
            //   console.log(`File is ${percentDone}% uploaded.`);
            // } else if (event instanceof HttpResponse) {
            //   console.log(event);
            //   if (event.status == 200) {
            if (event["status"] == 0) {
              // this.getEmployees();
              // Notifications.pageLoader(false);
              fileInput.target.value = "";
              this.uploadStatus = "File upload failed!";

              let failedSFDC = event["result"].failedSfdcCps;
              let failedPhoneNo = event["result"].failedPhoneNumberCps;
              let failedFormat = event["result"].incorrectFormat;
              this.openFailedList(failedSFDC, failedPhoneNo, failedFormat);
            } else if (event["status"] == 1) {
              this.uploadStatus = "Upload Done";

              let failedSFDC = event["result"].failedSfdcCps;
              let failedPhoneNo = event["result"].failedPhoneNumberCps;
              let failedFormat = event["result"].incorrectFormat;
              this.openFailedList(failedSFDC, failedPhoneNo, failedFormat);

              this.offsetdb = this.offset - 1;
              if (this.offsetdb > 0) {
                this.getEdelBlueList(this.offsetdb * 10);
              } else {
                let init = 0;
                this.getEdelBlueList(init);
              }
            }

            //     else if (event.body[ "status" ] == 3) {
            //       // Notifications.pageLoader(false);
            //       fileInput.target.value = '';
            //    //   ConfirmDialog.showConfirmation(this._dialog, "Data Processing Failed !", event.body[ "message" ], null, "OK");
            //     }
            //     else {
            //       // Notifications.showWarning(event.body[ "message" ]);
            //       // Notifications.pageLoader(false);
            //       fileInput.target.value = '';
            //     }
            //   }
            //   else {
            //     alert("Sorry, Server returned an unexpected error !, Please try again !");
            //   }
            // }
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

  activationStatusChange(cpID, e) {
    let body = new URLSearchParams();
    body.append("cpId", cpID);
    body.append("cpStatus", e.target.value);
    this.apiService
      .postDataNotJSON("cpUser/cpActiveInactive", body.toString())
      .subscribe((res) => {
        //show notification
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Status changed successfully!!"
        ).subscribe((result) => {});
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getEdelBlueList(this.offsetdb * 10);
        } else {
          let init = 0;
          this.getEdelBlueList(init);
        }
      });
  }

  openFailedList(sfdcs: any[], phoneNoes: any[], incorrectFormat: any[]) {
    if (
      sfdcs.length > 0 ||
      phoneNoes.length > 0 ||
      incorrectFormat.length > 0
    ) {
      this.dialog.open(FailedExcelListComponent, {
        width: "380px",
        data: {
          FCPSfdcArray: sfdcs,
          FCPPhoneArray: phoneNoes,
          FIncorrectFormat: incorrectFormat,
        },
      });
    }
  }
}
