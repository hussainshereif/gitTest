import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { MatDialog } from "@angular/material/dialog";
import { AlertComponent } from "../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../dialogs/confirmation/confirmation.component";

@Component({
  selector: "app-mail-list",
  templateUrl: "./mail-list.component.html",
  styleUrls: ["./mail-list.component.css"],
})
export class MailListComponent implements OnInit {
  emailAddForm: FormGroup;
  submitted = false;
  emailid: any = 2;
  emailDataArr: any = [];
  email: any;
  offset: any = 0;
  recordsPerPage: any = 10;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {
    this.emailAddForm = this.formBuilder.group({
      Email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.getMail();
  }
  get validation() {
    return this.emailAddForm.controls;
  }

  addMail(ev: any) {
    this.submitted = true;
    if (this.emailAddForm.invalid) {
      return;
    } else {
      var isAlreadyData = [];
      this.emailDataArr.forEach((element) => {
        if (
          element.emailToAddress == this.emailAddForm.value.Email &&
          element.emailId != ev.target[0].name
        ) {
          isAlreadyData.push(element);
        }
      });
      if (isAlreadyData.length == 0) {
        let body = new URLSearchParams();
        body.append("emailId", ev.target[0].name);
        body.append("emailToAddress", this.emailAddForm.value.Email);
        this.apiService
          .postDataNotJSON("apiCommon/addEmailToAddress", body.toString())
          .subscribe((res: any) => {
            if (res.message == "Success") {
              if (ev.target[0].name == 0) {
                AlertComponent.showAlert(
                  this.dialog,
                  "",
                  "Mail address added successfully!"
                );
              } else {
                AlertComponent.showAlert(
                  this.dialog,
                  "",
                  "Mail address edited successfully!"
                );
                this.email = "";
                document.getElementById("email").setAttribute("name", "0");
                document.getElementById("addBtn").innerHTML = "Add";
              }
              this.emailAddForm.reset();
              this.submitted = false;
              this.getMail();
            }
          });
      } else {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "This email is already Added"
        );
      }
    }
  }
  getMail() {
    let body = new URLSearchParams();
    body.append("offset", this.offset);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("apiCommon/EmailToAddressList", body.toString())
      .subscribe((res: any) => {
        this.emailDataArr = res.result.EmailToList;
      });
  }
  deleteMail(ev: any) {
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: "650px",
      data: {
        title: "Delete",
        message: "Are you sure you want to delete this email address?",
        negativelabel: "No",
        positivelabel: "Yes",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.result == true) {
        let body = new URLSearchParams();
        body.append("emailId", ev.target.id);
        this.apiService
          .postDataNotJSON("apiCommon/deleteEmailToAddress", body.toString())
          .subscribe((res: any) => {
            if (res.message == "Success") {
              AlertComponent.showAlert(
                this.dialog,
                "",
                "Mail address deleted successfully!"
              );
              //   this.emailAddForm.reset();
              // this.submitted=false;
              this.getMail();
            }
          });
      }
    });
    document.getElementById("email").setAttribute("name", "0");
    document.getElementById("addBtn").innerHTML = "Add";
    this.emailAddForm.reset();
    this.submitted = false;
  }
  editMail(ev: any) {
    let eId = ev.target.id;
    let eAddress = ev.target.title;
    this.email = eAddress;
    document.getElementById("email").setAttribute("name", eId);
    document.getElementById("addBtn").innerHTML = "Save";
  }
}
