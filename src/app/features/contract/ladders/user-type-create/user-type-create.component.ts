import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-user-type-create",
  templateUrl: "./user-type-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class UserTypeCreateComponent implements OnInit, OnDestroy {
  selectedValue: any;
  userTypes: any;
  userTyp: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialogRef: MatDialogRef<UserTypeCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getUserTypes();
    if (this.data.userType) {
      this.userTyp = this.data.userType;
      this.selectedValue = this.userTyp;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getUserTypes(): void {
    let url = "no-auth/enum/user-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.userTypes = res;
      });
  }

  public onChange(e): void {
    this.selectedValue = this.userTyp;
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    this.dialogRef.close(this.userTyp);
  }
}
