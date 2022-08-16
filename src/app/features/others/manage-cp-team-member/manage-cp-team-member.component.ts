import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-manage-cp-team-member",
  templateUrl: "./manage-cp-team-member.component.html",
  styleUrls: ["./manage-cp-team-member.component.css"],
})
export class ManageCpTeamMemberComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  cpTeamList: any = [];
  showIndex;
  sizeofTable;
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;

    this.getCPTeamList(this.offset);
  }

  //check whether to convert a popup or not

  getCPTeamList(page) {
    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    body.append("cpId", "12"); //change here--popup data value
    this.apiService
      .postDataNotJSON("channelPartner/CPTeamMemListAdmin", body.toString())
      .subscribe((res) => {
        this.sizeofTable = res["result"].totalRecords;
        this.cpTeamList = res["result"].CPTeamMembersList;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getCPTeamList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getCPTeamList(init);
    }
  }
}
