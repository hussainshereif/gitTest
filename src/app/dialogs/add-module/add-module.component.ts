import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

@Component({
  selector: "app-add-module",
  templateUrl: "./add-module.component.html",
  styleUrls: ["./add-module.component.css"],
})
export class AddModuleComponent implements OnInit {
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddModuleComponent>
  ) {}

  newModule;
  showEModule: boolean;
  moduleThumb;

  ngOnInit() {
    this.showEModule = true;

    this.newModule = {
      moduleId: 0,
      moduleName: null,
      description: null,
    };
  }
  bgValidation = { valid: true, insize: true };
  bodyFormdata: FormData = new FormData();

  addModuleThumb(fileInput: any = null) {
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
    this.moduleThumb = fileInput.target.files[0].name;
  }

  saveModuleDetails() {
    // this.showEModule=true;
    if (this.bgValidation.valid == true) {
      let formData: FormData = new FormData();
      if (this.bodyFormdata.has("moduleImage"))
        formData.append("file", this.bodyFormdata.get("moduleImage"));
      //  formData.append('moduleId',"0");
      //  formData.append('moduleName', this.newModule.moduleName);
      //  formData.append('moduleDescription', this.newModule.description);
      this.apiService
        .postDataMultipartRaw(
          "sales/trainingModule?name=" +
            this.newModule.moduleName +
            "&description=" +
            this.newModule.description,
          formData
        )
        .subscribe((res) => {
          //shoud check return condition here
          //  console.log(res,"res");
          //  if (res["status"] == 1) {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Module saved successfully!"
          ).subscribe((result) => {});

          //clear fields need to check
          //  this.newModule={
          //    "moduleId":0,
          //    "moduleName":null,
          //    "description":null
          //  }
          this.moduleThumb = "";
          this.dialogRef.close();

          //  } else {
          //    AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
          //  }
        });
    }
  }
}
