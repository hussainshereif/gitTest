import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-manage-contact-list",
  templateUrl: "./manage-contact-list.component.html",
  styleUrls: ["./manage-contact-list.component.css"],
})
export class ManageContactListComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  contactList = [];
  showIndex;
  sizeofTable;
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;

    this.getContactList(this.offset);
  }

  getContactList(page) {
    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("apiCommon/contactList", body.toString())
      .subscribe((res) => {
        this.sizeofTable = res["result"].totalRecords;
        this.contactList = res["result"].contactlist;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getContactList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getContactList(init);
    }
  }

  //  downLoadContactList(){
  //   let body = new URLSearchParams();
  //     this.apiService.postDataNotJSON("apiCommon/contactListExcel",body.toString())
  //     .subscribe(res=>{

  //     })
  //  }
}
