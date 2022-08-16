import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AlertComponent } from "../alert/alert.component";
import { RemoteApisService } from "../../commonservice/remote-apis.service";

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { takeUntil, Subject } from "rxjs";

@Component({
  selector: "app-add-sub-admin",
  templateUrl: "./add-sub-admin.component.html",
  styleUrls: ["./add-sub-admin.component.css"],
})
export class AddSubAdminComponent implements OnInit, OnDestroy {
  public addSubAdminForm: FormGroup;
  public countries: any = [];
  public isConfirmPasswordInvalid: boolean = false;
  public isPasswordInvalid: boolean = false;
  public submitted: boolean = false;
  public userRoles: any = [];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddSubAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formValidation();
    this.countries = this.apiService.countryList;
    this.addSubAdminForm.controls.dialCode.setValue("+91");
    this.getUserRole();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.addSubAdminForm.controls;
  }

  formValidation(): void {
    this.addSubAdminForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      dialCode: ["", [Validators.required]],
      mobile: [
        "",
        [
          Validators.required,
          Validators.min(1111111111),
          Validators.max(9999999999),
        ],
      ],
      userRole: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&]).{8,16}$/
          ),
        ],
      ],
      confirmPassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            /^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=.*[$@$!%*?&]).{8,16}$/
          ),
        ],
      ],
    });
  }

  getUserRole(): void {
    this.apiService
      .getData("no-auth/enum/sub-admin-roles")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.userRoles = res;
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    let formFields = this.addSubAdminForm.controls;
    if (formFields.password.value == formFields.confirmPassword.value) {
      this.isConfirmPasswordInvalid = false;
    } else {
      this.isConfirmPasswordInvalid = true;
    }
  }

  onSubmit() {
    this.submitted = true;
    if (!this.addSubAdminForm.valid) return;
    if (this.isConfirmPasswordInvalid) return;
    let formDatas = this.addSubAdminForm.controls;
    let url = "admin/employee";
    let data = {
      active: true,
      crmId: "",
      email: formDatas.email.value,
      mobileCountryCode: 91,
      mobileNumber: formDatas.mobile.value,
      name: formDatas.name.value,
      relationWithParent: "",
      userRole: formDatas.userRole.value,
      password: formDatas.password.value,
    };
    this.apiService
      .postData(url, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Sub-admin has been added successfully"
        ).subscribe((result) => {
          this.dialogRef.close();
        });
      });
  }
}
