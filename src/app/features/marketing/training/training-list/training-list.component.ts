import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../../app/dialogs/confirmation/confirmation.component";
import { AddvideosComponent } from "../../../../../app/dialogs/addvideos/addvideos.component";
import { ViewTrainingComponent } from "../../../../../app/dialogs/view-training/view-training.component";
import { AddModuleComponent } from "../../../../../app/dialogs/add-module/add-module.component";

@Component({
  selector: "app-training-list",
  templateUrl: "./training-list.component.html",
  styleUrls: ["./training-list.component.css"],
})
export class TrainingComponent implements OnInit {
  abc;
  actStatus;
  bgValidation = { valid: true, insize: true };
  moduleList = [
    {
      id: null,
      name: null,
      thumbnailUrl: null, //need to change here for null image
      description: null,
      moduleStatus: null,
      moduleCreatedOn: null,
      moduleThumbEx: null,
      showUpdateEModule: false,
      isActive: null,
    },
  ];
  moduleEx;
  moduleThumb;
  moduleThumbEx;
  newModule;
  offset;
  offsetdb;
  recordsPerPage;
  showIndex;
  sizeofTable; //need from api side for listing or cal length
  // showUpdateEModule:boolean;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.showIndex = -1;
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getModuleList(this.offset);
    this.moduleEx = {
      moduleId: 0,
      moduleName: null,
      description: null,
    };
  }

  getModuleList(page) {
    // let body = new URLSearchParams();
    // body.append('offset',page);
    // body.append('recordsPerPage', this.recordsPerPage);
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
    };
    this.apiService
      .getDataInputValue("sales/trainingModule", data)
      .subscribe((res) => {
        this.sizeofTable = res.totalPages * 10;
        this.moduleList = res.content;
        if (this.moduleList.length > 0) {
          this.moduleList = this.moduleList.map((item) => {
            if (item.moduleStatus == 1) {
              item.isActive = true;
            } else {
              item.isActive = false;
            }
            return item;
          });
        }
      });
  }

  paginatedSearch(e) {
    this.offsetdb = e.first / 10;
    this.getModuleList(this.offsetdb);
  }

  addModules() {
    let dialogRef = this.dialog.open(AddModuleComponent, {
      width: "650px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getModuleList(this.offsetdb * 10);
      } else {
        let init = 0;
        this.getModuleList(init);
      }
    });
  }

  bodyFormdata: FormData = new FormData();

  updateModuleThumb(fileInput: any = null, i) {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
      this.bgValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();

        if (this.bodyFormdata.has("moduleImage"))
          this.bodyFormdata.delete("moduleImage");
        this.bodyFormdata.append(
          "moduleImage",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this.bgValidation = message;
          });
      }
      this.moduleList[i].moduleThumbEx = fileInput.target.files[0].name;
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  editModules(index) {
    this.showIndex = index;
  }

  cancelEdit(i) {
    this.showIndex = -1;
    this.moduleList[i].showUpdateEModule = false;
  }

  async updateModuleDetails(mdle, i) {
    // this.showUpdateEModule=true;

    this.moduleList[i].showUpdateEModule = true;
    if (this.bgValidation.valid == true) {
      let formData: FormData = new FormData();
      if (this.bodyFormdata.has("moduleImage")) {
        formData.append("file", this.bodyFormdata.get("moduleImage"));
      } else {
        let urlName = this.moduleList[i].thumbnailUrl.split("/").pop();
        let typeName =
          "image/" + this.moduleList[i].thumbnailUrl.split(".").pop();
        let fetchUrl = await fetch(this.moduleList[i].thumbnailUrl);
        let content = await fetchUrl.blob();
        let fileInput = new File([content], urlName, {
          type: typeName,
          lastModified: Date.now(),
        });
        formData.append("file", fileInput, fileInput.name);
      }
      this.apiService
        .postDataMultipartRaw(
          "sales/trainingModule/update/" +
            mdle.id +
            "?name=" +
            mdle.name +
            "&description=" +
            mdle.description,
          formData
        )
        .subscribe((res) => {
          //shoud check return condition here
          // if (res["status"] == 1) {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Module saved successfully!"
          ).subscribe((result) => {});
          this.moduleList[i].showUpdateEModule = false;
          this.showIndex = -1;
          this.offsetdb = this.offset - 1;
          if (this.offsetdb > 0) {
            this.getModuleList(this.offsetdb * 10);
          } else {
            let init = 0;
            this.getModuleList(init);
          }
          // } else {
          //   // AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
          // }
        });
    }
  }

  addVideoTrainingList(moduleID) {
    let dialogRef = this.dialog.open(AddvideosComponent, {
      width: "650px",
      data: { moduleID: moduleID },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  viewVideoTrainingList(moduleID) {
    let dialogRef = this.dialog.open(ViewTrainingComponent, {
      width: "760px",
      data: { moduleID: moduleID },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  //  changeActiveStatus(i,mdata){
  //   let mid=mdata.moduleId;
  //   if(this.moduleList[i].isActive){
  //     this.actStatus=1;
  //   }
  //   else{
  //     this.actStatus=0;
  //   }

  //   let body = new URLSearchParams();
  //   body.append('moduleId',mid);
  //   body.append('moduleStatus',this.actStatus);

  //   this.apiService.postDataNotJSON("training/activeInactiveModule", body.toString())
  //   .subscribe(res => {

  //     //shoud check return condition here
  //     if (res["status"] == 1) {

  //       AlertComponent.showAlert(this.dialog, "", "Status changed successfully!").subscribe(result => { });

  //     } else {
  //       AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
  //     }
  //   });
  // }

  changeActiveStatus(i, mdata, status) {
    let mid = mdata.id;
    this.actStatus = status;
    this.apiService
      .postDataNotJSON(
        "sales/trainingModule/changeStatus/" +
          mid +
          "?isActive=" +
          this.actStatus,
        ""
      )
      .subscribe((res) => {
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getModuleList(this.offsetdb * 10);
        } else {
          let init = 0;
          this.getModuleList(init);
        }
        if (res.active == true) {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Module launched successfully!"
          ).subscribe((result) => {});
        } else {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Module de-activated successfully!"
          ).subscribe((result) => {});
        }
      });
  }

  deleteModules(mdata, i) {
    let mid = mdata.id;

    let body = new URLSearchParams();
    body.append("moduleId", mid);
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "",
      "Are you sure you want to delete this Module?"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postDataNotJSON("sales/trainingModule/delete/" + mid, "")
          .subscribe((res) => {
            //shoud check return condition here
            this.offsetdb = this.offset - 1;
            if (this.offsetdb > 0) {
              this.getModuleList(this.offsetdb * 10);
            } else {
              let init = 0;
              this.getModuleList(init);
            }
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Module Deleted successfully!"
            ).subscribe((result) => {});
          });
      }
    });
  }
}
