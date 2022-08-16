import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-add-member",
  templateUrl: "./add-member.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class AddMemberComponent implements OnInit, OnDestroy {
  cpList: any;
  cpIds: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    private apiService: RemoteApisService
  ) {}

  ngOnInit() {
    this.getCPList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getCPList(): void {
    let Data = {
      pageNumber: 0,
      pageSize: 10000,
      sortBy: "",
      isAscending: "true",
    };
    this.apiService
      .getDataInputValue("admin/channelPartner", Data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.cpList = res.content;
      });
  }

  public onClose(): void {
    this.dialogRef.close(this.cpIds);
  }

  public onSave(): void {
    this.dialogRef.close(this.cpIds);
  }
}
