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
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-add-ladder",
  templateUrl: "./add-ladder.component.html",
  styleUrls: ["./add-ladder.component.css"],
})
export class AddLadderComponent implements OnInit {
  groups: any;
  ladGroupId: any;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddLadderComponent>,
    private datePipe: DatePipe
  ) {}

  addLadderForm: FormGroup;

  submitted = false;
  returnUrl: string;
  error = "";
  ladStartDate: any;
  ladEndDate: any;
  isDisabled;
  ladderId: any;
  isEndDateError: boolean = false;
  isStartDateError: boolean = false;
  isEndDateDisable: boolean = true;
  ngOnInit() {
    // this.isDisabled = (date: NgbDate) => {
    // 	const currentDate = new Date();
    // 	const year = currentDate.getFullYear();
    // 	const day = currentDate.getDate();
    // 	const month = currentDate.getMonth() + 1;
    // 	return ((date.day < day && date.year === year && date.month === month)
    // 		|| (date.year <= year && date.month < month))
    // }
    this.addLadderForm = this.formBuilder.group({
      ladName: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")],
      ],
      ladStartDate: ["", Validators.required],
      ladEndDate: ["", Validators.required],
      groupDetails: [
        null,
        [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")],
      ],
    });
    // this.customerForm.get('customer').setValue("(new customer)");
    if (this.data.groupId) {
      this.addLadderForm.controls["groupDetails"].setValue(this.data.groupId);
      this.ladGroupId = this.data.groupId;
    }

    if (this.data) {
      this.ladderId = this.data.ladId;
      this.ladStartDate = this.data.ladStartDate;
      this.ladEndDate = this.data.ladEndDate;
      // this.addLadderForm.patchValue(this.data);
      this.addLadderForm.controls["ladName"].setValue(this.data.ladName);

      const endYear = Number(this.datePipe.transform(this.ladEndDate, "yyyy"));
      const endMonth = Number(this.datePipe.transform(this.ladEndDate, "MM"));
      const endDay = Number(this.datePipe.transform(this.ladEndDate, "dd"));
      this.addLadderForm.controls["ladEndDate"].setValue({
        year: endYear,
        month: endMonth,
        day: endDay,
      });

      const startYear = Number(
        this.datePipe.transform(this.ladStartDate, "yyyy")
      );
      const startMonth = Number(
        this.datePipe.transform(this.ladStartDate, "MM")
      );
      const startDay = Number(this.datePipe.transform(this.ladStartDate, "dd"));
      this.addLadderForm.controls["ladStartDate"].setValue({
        year: startYear,
        month: startMonth,
        day: startDay,
      });
    } else {
      this.ladderId = 0;
    }
    this.getGroups();

    // console.log(this.addLadderForm.controls.ladEndDate,"ladderForm");
    if (this.addLadderForm.controls.ladEndDate.status == "VALID") {
      this.isEndDateDisable = false;
    } else if (this.addLadderForm.controls.ladEndDate.status == "INVALID") {
      this.isEndDateDisable = true;
    }
  }

  // selectChangeHandler(event: any) {
  // 	//update the ui
  // 	this.ladGroupId = event.target.value;
  // }

  get f() {
    return this.addLadderForm.controls;
  }

  onSubmit() {
    this.ladGroupId = this.addLadderForm.get("groupDetails").value;
    this.submitted = true;
    if (
      this.addLadderForm.valid == true &&
      this.isEndDateError == false &&
      this.isStartDateError == false
    ) {
      let formData: FormData = new FormData();

      if (!this.ladderId) {
        this.ladderId = 0;
      }
      // console.log(this.f,"form",this.ladEndDate,"end date");
      let startDate = this.f.ladStartDate.value;
      startDate = startDate.year + "-" + startDate.month + "-" + startDate.day;
      let endDate = this.f.ladEndDate.value;
      endDate = endDate.year + "-" + endDate.month + "-" + endDate.day;
      let groupId = this.f.groupDetails.value;
      formData.append("ladId", this.ladderId);
      formData.append("ladName", this.f.ladName.value);
      formData.append("ladStartDate", startDate);
      formData.append("ladEndDate", endDate);
      formData.append("ladProjectId", this.data.projectId);
      formData.append("ladGroupId", groupId);

      this.apiService
        .postDataMultipartRaw("brokerage/addorUpdateLadder", formData)
        .subscribe((res) => {
          if (res["status"] == 1) {
            this.dialogRef.close();
          } else {
            AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(
              (result) => {}
            );
          }
        });
    } else {
      return;
    }
  }
  close() {
    this.dialogRef.close();
  }

  getGroups() {
    let body = new URLSearchParams();
    body.append("projectId", this.data.projectId);
    this.apiService
      .postDataNotJSON("project/groupList", body.toString())
      .subscribe((res) => {
        this.groups = res["result"].groupList;
        // console.log(this.groups);
      });
  }

  datechange() {
    this.isEndDateDisable = false;
    this.isEndDateError = false;
    if (this.ladEndDate == undefined) {
      let year = this.f.ladStartDate.value.year;
      let month = this.f.ladStartDate.value.month;
      let dt = this.f.ladStartDate.value.day;
      this.ladStartDate = year + "-" + month + "-" + dt;
    } else {
      let ladEnd = this.f.ladEndDate.value;
      let ladStart = this.f.ladStartDate.value;
      if (
        ladStart.year <= ladEnd.year &&
        ladStart.month <= ladEnd.month &&
        ladStart.day <= ladEnd.day
      ) {
        this.isStartDateError = false;
        this.ladStartDate =
          ladStart.year + "-" + ladStart.month + "-" + ladStart.day;
      } else {
        this.isStartDateError = true;
        // console.log(ev,"event");
      }
    }
  }

  datechange1() {
    let ladEnd = this.f.ladEndDate.value;
    let ladStart = this.f.ladStartDate.value;
    this.isStartDateError = false;
    if (
      ladStart.year <= ladEnd.year &&
      ladStart.month <= ladEnd.month &&
      ladStart.day <= ladEnd.day
    ) {
      this.isEndDateError = false;
      this.ladEndDate =
        ladStart.year + "-" + ladStart.month + "-" + ladStart.day;
    } else {
      this.isEndDateError = true;
    }
  }
}
