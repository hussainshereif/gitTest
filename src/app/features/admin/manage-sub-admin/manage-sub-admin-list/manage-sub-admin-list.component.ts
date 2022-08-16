import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AddSubAdminComponent } from "src/app/dialogs/add-sub-admin/add-sub-admin.component";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { ConfirmationComponent } from "src/app/dialogs/confirmation/confirmation.component";
import { EditSubAdminComponent } from "src/app/dialogs/edit-sub-admin/edit-sub-admin.component";

@Component({
  selector: "app-manage-sub-admin",
  templateUrl: "./manage-sub-admin-list.component.html",
  styleUrls: ["./manage-sub-admin-list.component.css"],
})
export class ManageSubAdminComponent implements OnInit {
  subAdminList: any = [];
  sizeofTable: number;
  recordsPerPage: number = 10;
  offset: number = 0;
  offsetdb;
  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getSubAdmin(this.offset);
  }
  getSubAdmin(page) {
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/employee";
    this.apiService.getDataInputValue(url, data).subscribe((res) => {
      this.subAdminList = res.content;
      this.sizeofTable = res.totalPages * 10;
      // console.log( this.subAdminList," this.subAdminList",this.sizeofTable);
    });
  }

  addSubAdmin() {
    let dialogRef = this.dialog.open(AddSubAdminComponent, {
      width: "900px",
      data: { type: "Channel Partner", offset: 0, recordsPerPage: 10 },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getSubAdmin(0);
    });
  }
  paginatedSearch(offset) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getSubAdmin(this.offsetdb);
    } else {
      let init = 0;
      this.getSubAdmin(init);
    }
  }
  editSubAdmin(id, index) {
    let jsonData = this.subAdminList[index];
    // let jsonData=this.subAdminList;
    let dialogRef = this.dialog.open(EditSubAdminComponent, {
      width: "900px",
      data: jsonData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.result) {
        this.getSubAdmin(0);
      }
    });
  }

  subAdminDelete(id) {
    ConfirmationComponent.showConfirmation(
      this.dialog,
      "Delete Sub-Admin",
      "Are you sure you want to delete this sub-admin?"
    ).subscribe((result) => {
      if (result.result) {
        let url = "admin/employee/delete?id=" + id;
        this.apiService.postDataNotJSON(url, "").subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Sub-admin has been deleted"
          ).subscribe((result) => {});
          this.getSubAdmin(0);
        });
      }
    });
  }
}
