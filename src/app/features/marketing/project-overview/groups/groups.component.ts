import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Input } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { FailedExcelListComponent } from "src/app/dialogs/failed-excel-list/failed-excel-list.component";
import { AddGroupsComponent } from "src/app/dialogs/add-groups/add-groups.component";

@Component({
  selector: "app-groups",
  templateUrl: "./groups.component.html",
  styleUrls: ["./groups.component.css"],
})
export class GroupsComponent implements OnInit {
  @Input("projectId") projectId;
  groups: any;
  groupCPList: any;
  groupIds: any;
  userCount: any;
  groupName: any;
  showIndex: number;
  uploadStatus: string;
  bgValidation: { valid: boolean; insize: boolean };
  isProcessingVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getGroups();
    this.showIndex = 0;
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

  getGroups() {
    // let body = new URLSearchParams();
    // body.append('projectId', this.projectId);
    let data = {
      projectId: this.projectId,
      pageNumber: 0,
      pageSize: 10,
    };
    this.apiService
      .getDataInputValue("user/projectGroup", data)
      .subscribe((res) => {
        // console.log(res)
        this.groups = res.content;
        // console.log(this.groups);
      });
  }
  backTo() {
    this.showIndex = 0;
  }
  getGroupDetails(groupId, groupName, userCount) {
    let body = new URLSearchParams();
    body.append("groupId", groupId);
    this.apiService
      .postDataNotJSON("project/groupCPList", body.toString())
      .subscribe((res) => {
        this.showIndex = 1;
        this.groupCPList = res["result"].groupList;
        this.groupName = groupName;
        this.userCount = userCount;
        this.groupIds = groupId;
        // console.log(this.groupName);
      });
  }

  addGroups(groupIds, groupName) {
    let dialogRef = this.dialog.open(AddGroupsComponent, {
      width: "600px",
      data: {
        projectId: this.projectId,
        groupId: groupIds,
        groupName: groupName,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getGroups();
    });
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
          formData.append("projectId", this.projectId);
          formData.append("groupId", this.groupIds);
          formData.append("excelCreatedBy", localStorage.getItem("userName"));
          formData.append(
            "cpGroupExcelFile",
            fileInput.target.files[0],
            fileInput.target.files[0].name
          );
          let url = "brokerage/uploadCPGroupExcel";
          this.apiService.uploadExcel(formData, url).subscribe((event) => {
            // console.log(event);
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
              this.getGroups();
              this.getGroupDetails(
                this.groupIds,
                this.groupName,
                this.userCount
              );
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

  deleteDetails(mapId, groupIds, groupName, userCount) {
    let body = new URLSearchParams();
    body.append("mapId", mapId);
    body.append("mapStatus", "3");
    this.apiService
      .postDataNotJSON("project/changeStatusCPGroup", body.toString())
      .subscribe((res) => {
        if (res["status"] == 1) {
          this.getGroupDetails(groupIds, groupName, userCount);
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Deleted successfully!"
          ).subscribe((result) => {});
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }
}
