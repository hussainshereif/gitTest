import {MatDialogRef,MAT_DIALOG_DATA,MatDialog } from "@angular/material/dialog";
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "../alert/alert.component";
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  submitted:boolean=false;
  isConfirmPasswordInvalid:boolean=false;
  constructor(private fb:FormBuilder,public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService:RemoteApisService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.validation();
    // console.log(this.data,"data");
  }
  get f(){return this.resetPasswordForm.controls}

  validation(){
    this.resetPasswordForm=this.fb.group({
     password:["",[Validators.required,Validators.minLength(8),Validators.maxLength(16)]],
     confirmPassword:["",[Validators.required,Validators.minLength(8),Validators.maxLength(16)]]
    })
  }

  resetPassword(){
    this.submitted=true;
    if(this.resetPasswordForm.invalid) return;
    if(this.isConfirmPasswordInvalid) return;
    let url="admin/employee/reset-password?id="+this.data.id+"&password="+this.resetPasswordForm.controls.password.value;
    this.apiService.postDataNotJSON(url,'').subscribe(res=>{
      AlertComponent.showAlert(this.dialog, "", "Password Changed").subscribe(result=>{
        this.dialogRef.close();
    })
    })
  }
  onCancel(){
    this.dialogRef.close();
  }

  onConfirm(){
    let formFields=this.resetPasswordForm.controls;
    if(formFields.password.value==formFields.confirmPassword.value){
      this.isConfirmPasswordInvalid=false;
    }else{
      this.isConfirmPasswordInvalid=true;
    }
  }
}
