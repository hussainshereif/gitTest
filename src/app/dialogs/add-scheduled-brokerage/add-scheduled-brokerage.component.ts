import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";

@Component({
  selector: "app-add-scheduled-brokerage",
  templateUrl: "./add-scheduled-brokerage.component.html",
  styleUrls: ["./add-scheduled-brokerage.component.css"],
})
export class AddScheduledBrokerageComponent implements OnInit {
  groups: any;
  groupId: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddScheduledBrokerageComponent>
  ) {}

  addScheduledBrokerageForm: FormGroup;

  submitted = false;
  returnUrl: string;
  error = "";
  baseStartDate: any;
  baseEndDate: any;
  isDisabled;
  ngOnInit() {
    this.isDisabled = (date: NgbDate) => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      return (
        (date.day < day && date.year === year && date.month === month) ||
        (date.year <= year && date.month < month)
      );
    };

    this.addScheduledBrokerageForm = this.formBuilder.group({
      baseSchedPerc: [
        "",
        [
          Validators.required,
          Validators.max(100),
          Validators.min(0),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
      baseStartDate: ["", Validators.required],
      baseEndDate: ["", Validators.required],
      groupDetails: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")],
      ],
    });
    this.getGroups();
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.addScheduledBrokerageForm.controls;
  }

  onSubmit() {
    this.groupId = this.addScheduledBrokerageForm.get("groupDetails").value;
    this.submitted = true;
    if (this.addScheduledBrokerageForm.invalid) return;

    let formData: FormData = new FormData();
    formData.append("projectId", this.data.projectId);
    formData.append("baseId", "0");
    formData.append("baseNormalPerc", "0");
    formData.append("baseSchedPerc", this.f.baseSchedPerc.value);
    formData.append("baseStartDate", this.baseStartDate);
    formData.append("baseEndDate", this.baseEndDate);
    formData.append("baseType", "2");
    formData.append("groupId", this.groupId);

    this.apiService
      .postDataMultipartRaw("project/addProjectBaseBrokerage", formData)
      .subscribe((res) => {
        if (res["status"] == 1) {
          this.dialogRef.close();
        } else {
          AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
            (result) => {}
          );
        }
      });
  }

  // selectChangeHandler(event: any) {
  // 	//update the ui
  // 	this.groupId = event.target.value;
  // 	console.log(event.target);
  // }
  getGroups() {
    let body = new URLSearchParams();
    body.append("projectId", this.data.projectId);
    this.apiService
      .postDataNotJSON("project/groupList", body.toString())
      .subscribe((res) => {
        this.groups = res["result"].groupList;
      });
  }
  close() {
    this.dialogRef.close();
  }

  datechange() {
    let year = this.f.baseStartDate.value.year;
    let month = this.f.baseStartDate.value.month;
    let dt = this.f.baseStartDate.value.day;
    this.baseStartDate = year + "-" + month + "-" + dt;

    var GivenDate = this.baseStartDate;
    var CurrentDate = new Date();
    GivenDate = new Date(GivenDate);

    // if(GivenDate > CurrentDate){
    //     alert('Given date is greater than the current date.');

    // }else{
    //     alert('Given date is not greater than the current date.');
    // }
  }

  datechange1() {
    let year = this.f.baseEndDate.value.year;
    let month = this.f.baseEndDate.value.month;
    let dt = this.f.baseEndDate.value.day;
    this.baseEndDate = year + "-" + month + "-" + dt;
  }
}
