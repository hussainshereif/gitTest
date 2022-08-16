import { Component, OnInit, Input } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MouseEvent } from "@agm/core";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { NgForm, FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-cp-profile",
  templateUrl: "./cp-profile.component.html",
  styleUrls: ["./cp-profile.component.css"],
  providers: [DatePipe],
})
export class CpProfileComponent implements OnInit {
  reraDetails: any;
  companyCategory: any;
  editdataVal: any;
  agreementStartDate: any;
  StartDate: any;
  reraRegistrationDate: string;
  agreementEndDate: any;
  uniqId: any;
  reraState: any;
  profileId: number;
  microMarket: any;
  cpMaster: any;
  isSMMobleNumberValid:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  cpId: any;
  tabId: any;
  showIndex: any;
  cpdetails: any = [];

  ngOnInit() {
    this.cpdetails = [
      {
        showUpdateEModule: false,
      },
    ];
    this.showIndex = -1;
    this.route.params.subscribe((params) => {
      this.cpId = params["id"];
    });

    this.tabId = 1;

    this.getCPProfileDetails(this.cpId);
  }

  tabActivation(i) {
    if (this.cpId > 0) {
      this.tabId = i;
      switch (i) {
        case 1:
          this.getCPProfileDetails(this.cpId);
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
      }
    }
  }

  editCpProfile(index) {
    this.showIndex = index;
  }

  cancelEdit(i) {
    this.showIndex = -1;
    this.cpdetails["showUpdateEModule"] = false;
    this.getCPProfileDetails(this.cpId);
  }

  getCPProfileDetails(cpId) {
    this.apiService
      .getData("admin/channelPartner/" + cpId + "")
      .subscribe((res) => {
        if(res.cpMaster.salesPersonMobileNumber!=undefined){
          this.isSMMobleNumberValid=true;
        }
        this.cpdetails = res;
        this.profileId = res.id;
        this.microMarket = res.cpMaster.microMarket;
        this.StartDate = res.cpMaster.agreementStartDate;
        res.cpMaster.agreementStartDate = this.dateSplit(this.StartDate);
        this.agreementEndDate = res.cpMaster.agreementEndDate;
        res.cpMaster.agreementEndDate = this.dateSplit(this.agreementEndDate);
        
      });
  }

  updateProfileData(profileDatas, i) {
    this.uniqId = this.cpId;
    this.reraState = "";
    let data;
    if (i == 1) {
      this.editdataVal = profileDatas.name.trim();
      data = { name: this.editdataVal };
    } else if (i == 2) {
      if (profileDatas.cpPhone == null) {
        this.editdataVal = "";
      } else {
        this.editdataVal = profileDatas.cpPhone;
        data = { mobileNumber: this.editdataVal };
      }
    } else if (i == 3) {
      this.editdataVal = profileDatas.cpEmailId.trim();
      data = { email: this.editdataVal };
    } else if (i == 4) {
      this.editdataVal = profileDatas.cpCompanyCategory.trim();
      data = {};
    } else if (i == 5) {
      this.editdataVal = profileDatas.cpBrokerType.trim();
    } else if (i == 6) {
      this.editdataVal = profileDatas.cpPANNo.trim();
    } else if (i == 7) {
      this.editdataVal = profileDatas.cpMaster.salesPersonName.trim();
      data = { salesPersonName: this.editdataVal };
    } else if (i == 8) {
      this.editdataVal = profileDatas.cpMaster.salesPersonMobileNumber;
      data = { salesPersonMobile: this.editdataVal };
    } else if (i == 9) {
      this.editdataVal = this.agreementStartDate;
      data = { agreementStartDate: this.agreementStartDate };
    } else if (i == 10) {
      this.editdataVal = this.agreementEndDate;
      data = { agreementEndDate: this.agreementEndDate };
    } else if (i == 13) {
      this.editdataVal = this.reraRegistrationDate;
    } else if (i == 14) {
      this.editdataVal = profileDatas.reraNumber.trim();
      this.uniqId = profileDatas.reraId.trim();
      this.reraState = profileDatas.reraState.trim();
      this.editdataVal = this.reraRegistrationDate;
    } else if (i == 11) {
      this.editdataVal = this.microMarket;
      data = { microMarket: this.editdataVal };
    }
    this.cpdetails["showUpdateEModule"] = true;
    this.apiService
      .postData("admin/channelPartner/update/" + this.profileId, data)
      .subscribe((result) => {
        
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Profile saved successfully!"
        ).subscribe((result) => {});
        this.cpdetails["showUpdateEModule"] = false;
        this.showIndex = -1;
        this.getCPProfileDetails(this.profileId);
      });
  }

  datechange(profileDatas) {
   
    let year = profileDatas.cpMaster.agreementStartDate.year;
    let month = ""+profileDatas.cpMaster.agreementStartDate.month;
    let dt = "" + profileDatas.cpMaster.agreementStartDate.day;
    if (dt.length == 1) {
      dt = 0 + dt;
    }
    if (month.length == 1) {
      month = 0 + month;
    }
    this.agreementStartDate = year + "-" + month + "-" + dt;
  }

  datechange1(profileDatas) {
    let year1 = profileDatas.cpMaster.agreementEndDate.year;
    let month1 = ""+profileDatas.cpMaster.agreementEndDate.month;
    let dt1 = "" + profileDatas.cpMaster.agreementEndDate.day;
    
    if (dt1.length == 1) {
      dt1 = 0 + dt1;
    }
    if (month1.length == 1) {
      month1 = 0 + month1;
    }
    this.agreementEndDate = year1 + "-" + month1 + "-" + dt1;
  }

  datechange2(profileDatas) {
    let year2 = profileDatas.cpReraRegistrationDate.year;
    let month2 = profileDatas.cpReraRegistrationDate.month;
    let dt2 = profileDatas.cpReraRegistrationDate.day;
    this.reraRegistrationDate = dt2 + "-" + month2 + "-" + year2;
  }

  dateSplit(date) {
    let split = date.split("-");
    let Year = parseInt(split[0]);
    let Month = parseInt(split[1]);
    let Day = parseInt(split[2]);
    let data = { year: Year, month: Month, day: Day };
    return data;
  }
}
