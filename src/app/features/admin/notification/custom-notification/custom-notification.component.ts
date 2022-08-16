import { Component, OnInit, ViewChild } from "@angular/core";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { CustomNotificationCreateComponent } from "./custom-notificaton-create/custom-notification-create.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-custom-notification",
  templateUrl: "./custom-notification.component.html",
  styleUrls: ["./custom-notification.component.css"],
})
export class CustomNotificationListComponent implements OnInit {
  @ViewChild(CustomNotificationCreateComponent)
  customNotificationCreateComponent: CustomNotificationCreateComponent;

  edit: boolean;
  notificationList: any = [];
  offsetdb: number;
  offset: number = 0;
  pageSize: number;
  selectedData: any;

  private destroy$: Subject<void> = new Subject();

  constructor(private apiService: RemoteApisService) {}

  ngOnInit(): void {
    this.getNotification(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public hideDetails(event): void {
    this.selectedData = {};
    this.edit = false;
    this.getNotification(this.offset == 0 ? 0 : this.offset - 1);
  }

  public paginatedSearch(e): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getNotification(this.offsetdb);
    } else {
      let init = 0;
      this.getNotification(init);
    }
  }

  private getNotification(page): void {
    const data = {
      isAscending: true,
      notificationType: "",
      pageNumber: page,
      pageSize: 10,
      sortBy: "",
    };
    this.apiService
      .getDataInputValue("admin/audit-notification", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.notificationList = res.content;
        this.pageSize = res.totalPages * 10;
      });
  }
}
