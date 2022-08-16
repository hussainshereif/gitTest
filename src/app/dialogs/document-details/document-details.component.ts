import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
@Component({
  selector: "app-document-details",
  templateUrl: "./document-details.component.html",
  styleUrls: ["./document-details.component.css"],
})
export class DocumentDetailsComponent implements OnInit {
  isRera: boolean = true;
  reraForm: FormGroup;
  bankForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DocumentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private apiService: RemoteApisService
  ) {}

  ngOnInit() {
    this.formController();
    this.reraFormValidation();
    this.bankFormValidation();
    this.getDocumentDetails();
  }
  formController() {
    if (this.data.docType == "bank") {
      this.isRera = false;
    } else if (this.data.docType == "rera") {
      this.isRera = true;
    }
  }
  get e() {
    return this.reraForm.controls;
  }
  get f() {
    return this.bankForm.controls;
  }
  reraFormValidation() {
    this.reraForm = this.fb.group({
      state: ["", [Validators.required]],
      number: ["", [Validators.required]],
      expiry: ["", [Validators.required]],
    });
  }
  bankFormValidation() {
    this.bankForm = this.fb.group({
      name: ["", [Validators.required]],
      bank: ["", [Validators.required]],
      account: ["", [Validators.required]],
      ifsc: ["", [Validators.required]],
    });
  }
  getDocumentDetails() {
    let url;
    if (this.data.docType == "bank") {
      url = "user/bank-account/document?documentId=" + this.data.docId;
    } else if (this.data.docType == "rera") {
      url = "cp/rera/document?documentId=" + this.data.docId;
    }
    this.apiService.getData(url).subscribe(
      (res) => {
        // let res=JSON.parse(result);
        // console.log(res,"res");
        if (this.data.docType == "bank") {
          let BankDetails = this.bankForm.controls;
          BankDetails.name.setValue(res.beneficiaryName);
          BankDetails.bank.setValue(res.bankName);
          BankDetails.account.setValue(res.accountNumber);
          BankDetails.ifsc.setValue(res.ifscCode);
        } else if (this.data.docType == "rera") {
          let reraDetails = this.reraForm.controls;
          reraDetails.state.setValue(res.state);
          reraDetails.number.setValue(res.reraNumber);
          let date = new Date(res.expiryDate);
          let month=date.getMonth()+1;
          let expiry =date.getDate() + "-" +month+ "-" + date.getFullYear();
          reraDetails.expiry.setValue(expiry);
        }
      },
      (err) => {
        this.dialogRef.close();
      }
    );
  }
}
