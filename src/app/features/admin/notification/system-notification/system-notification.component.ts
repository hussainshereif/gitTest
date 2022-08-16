import { Component, OnInit } from "@angular/core";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";

@Component({
  selector: "app-system-notification",
  templateUrl: "./system-notification.component.html",
  styleUrls: ["./system-notification.component.css"],
})
export class SystemNotificationListComponent implements OnInit {
  active = 1;
  edit: boolean;
  notificationData: any;
  offsetdb: number;
  offset: number = 0;
  recordsPerPage: number = 6;
  selectedData: any;
  showDetails: boolean = false;
  sizeofTable;

  constructor(private apiService: RemoteApisService) {}

  ngOnInit(): void {
    this.edit = false;
    this.getSysNotification(this.offset);
  }

  private getSysNotification(page): void {
    const data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: "true",
    };
    let url = "admin/notificationMessage";
    this.apiService.getDataInputValue(url, data).subscribe((resp) => {
      this.notificationData = resp.content;
      this.sizeofTable = resp.totalPages * 6;
    });
  }

  public paginatedSearch(): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getSysNotification(this.offsetdb);
    } else {
      let init = 0;
      this.getSysNotification(init);
    }
  }
  public onEdit(data): void {
    this.edit = true;
    this.selectedData = data;
  }

  public hideDetails(e): void {
    this.edit = false;
    this.paginatedSearch();
  }
}
