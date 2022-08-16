import {MatDialogRef,MAT_DIALOG_DATA,MatDialog } from "@angular/material/dialog";
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "../alert/alert.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: 'app-edit-sub-admin',
  templateUrl: './edit-sub-admin.component.html',
  styleUrls: ['./edit-sub-admin.component.css']
})
export class EditSubAdminComponent implements OnInit {
  editSubAdminForm:FormGroup;
  submitted:boolean=false;
  countries:any=[];
  userRoles:any=[];
  
  constructor(private fb:FormBuilder, public dialogRef: MatDialogRef<EditSubAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService:RemoteApisService, public dialog: MatDialog) { 
      this.getUserRole();
    }

  ngOnInit(): void {
    this.countries=this.apiService.countryList;
    this.formValidation();
    
    let dialCode="+"+this.data.mobileCountryCode;
    this.editSubAdminForm.controls.dialCode.setValue(dialCode);
    this.editSubAdminForm.controls.name.setValue(this.data.name);
    this.editSubAdminForm.controls.email.setValue(this.data.email);
    this.editSubAdminForm.controls.mobile.setValue(this.data.mobileNumber);
    
  }
  get f(){return this.editSubAdminForm.controls}

  formValidation(){
    this.editSubAdminForm=this.fb.group({
      name:["",[Validators.required,Validators.minLength(2)]],
      email:["",[Validators.required,Validators.email]],
      dialCode:["",[Validators.required]],
      mobile:["",[Validators.required,Validators.min(1111111111),Validators.max(9999999999)]],
      userRole:["",[Validators.required]]
    })
  }

  getUserRole(){
    this.apiService.getData("admin/enum/employee-roles").subscribe(res=>{
      this.userRoles=res;
      this.editSubAdminForm.controls.userRole.setValue(this.data.eligibleRoles[0]);
    })
  }

  onSubmit(){
    this.submitted=true;
    if(this.editSubAdminForm.invalid) return;
    let formData=this.editSubAdminForm.controls;
    let countryCode=""+formData.dialCode.value;
    let code =countryCode.split("+")[1];
    let data={
      "active": true,
      "crmId": "",
      "email":formData.email.value,
      "mobileCountryCode": code,
      "mobileNumber": formData.mobile.value,
      "name": formData.name.value,
      "relationWithParent": "",
      "userRole": formData.userRole.value
    }
    
    let url="admin/employee/update?id="+this.data.id;
    this.apiService.postData(url,data).subscribe(res=>{
      AlertComponent.showAlert(this.dialog, "", "Sub-admin has been updated").subscribe(result=>{
        this.dialogRef.close({result:true});
    })
  })
  }
  onCancel(){
    this.dialogRef.close({result:false});
  }

  resetPassword(){
    this.dialogRef.close({result:false});
    let dialogRef=this.dialog.open(ResetPasswordComponent,{
      width:'600px',
      data: this.data
    })
    dialogRef.afterClosed().subscribe(result => {
     
   });
  }

}
