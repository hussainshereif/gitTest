import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-mrp",
  templateUrl: "./mrp.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class MrpComponent implements OnInit, OnDestroy {
  @Input("projectId") projectId;

  mrpDetails: any;
  mrpId: any;
  mrpForm: FormGroup;
  submitted = false;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getMRP();
    this.mrpForm = this.formBuilder.group({
      mrpFlag: [""],
      mrpUrl: ["", Validators.required],
      mrpDescription: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("[a-zA-Z0-9., ]+"),
          Validators.pattern("[a-zA-Z0-9. ]*"),
        ],
      ],
      mrpId: [""],
    });

    // this.onChangeMrpFlag({ value: true })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMRP() {
    let data = {
      projectId: this.projectId,
    };
    this.apiService
      .getDataInputValue("user/projectMRP", data)
      .subscribe((res) => {
        if (res) {
          this.mrpDetails = res;
          this.mrpForm.controls["mrpUrl"].setValue(this.mrpDetails.url);
          this.mrpForm.controls["mrpFlag"].setValue(this.mrpDetails.active);
          this.mrpForm.controls["mrpId"].setValue(this.mrpDetails.id);
          this.mrpForm.controls["mrpDescription"].setValue(
            this.mrpDetails.description
          );
          // this.onChangeMrpFlag({ value: this.mrpDetails.mrpFlag == 0 ? true : false })
          this.onChangeMrpFlag({ value: this.mrpDetails.active });
        }
      });
  }

  get f() {
    return this.mrpForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.f.mrpId.value == "" || this.f.mrpId.value == null) {
      this.mrpId = 0;
    } else {
      this.mrpId = this.f.mrpId.value;
    }
    if (this.mrpForm.invalid) return;
    let formData: FormData = new FormData();
    // formData.append('mrpProjectId', this.projectId);
    // formData.append('mrpFlag', this.f.mrpFlag.value ? '0' : '1');
    // formData.append('active', this.f.mrpFlag.value);
    // formData.append('description', this.f.mrpDescription.value);
    // formData.append('url', this.f.mrpUrl.value);
    // formData.append('mrpId', this.mrpId);
    let data = {
      active: this.f.mrpFlag.value,
      description: this.f.mrpDescription.value,
      url: this.f.mrpUrl.value,
    };

    this.apiService
      .postData(
        "sales/projectMRP/saveOrUpdate?projectId=" + this.projectId,
        data
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "MRP details added successfully!"
        ).subscribe((result) => {});
        // if (res["status"] == 1) {
        //   if (this.f.mrpId.value == '' || this.f.mrpId.value == null) {
        //     AlertComponent.showAlert(this.dialog, "", "MRP details added successfully!").subscribe(result => { });
        //   } else {
        //     AlertComponent.showAlert(this.dialog, "", "MRP details edited successfully!").subscribe(result => { });
        //   }
        // } else {
        //   AlertComponent.showAlert(this.dialog, "", res["message"]).subscribe(result => { });
        // }
      });
  }

  onChangeMrpFlag(e) {
    if (this.f.mrpFlag.value) {
      this.f.mrpUrl.setValidators(Validators.required);
      this.f.mrpUrl.updateValueAndValidity();

      this.f.mrpDescription.setValidators(Validators.required);
      this.f.mrpDescription.updateValueAndValidity();
    } else {
      this.f.mrpUrl.setErrors(null);
      this.f.mrpUrl.clearValidators();

      this.f.mrpDescription.setErrors(null);
      this.f.mrpDescription.clearValidators();
    }
  }
}
