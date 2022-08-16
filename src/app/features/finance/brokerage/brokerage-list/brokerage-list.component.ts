import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-brokerage-list",
  templateUrl: "./brokerage-list.component.html",
  styleUrls: ["./brokerage-list.component.css"],
})
export class BrokerageListComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  sizeofTable;
  curr_gst;
  brokerageList = [];
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getBrokerageDetails(this.offset);
  }

  getBrokerageDetails(page) {
    // let body = new URLSearchParams();
    // body.append('offset', page);
    // body.append('recordsPerPage', this.recordsPerPage);
    // ba
    let body = {
      projectId: "",
      bookedYear: "",
      pageNumber: page,
      pageSize: 10,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("finance/booking/parent-user-brokerage", body)
      .subscribe((res) => {
        // console.log(res,"res");
        this.brokerageList = res.content;
        this.sizeofTable = res.totalPages * 10;
      });
  }

  detailedBrokerage(brokCpId) {
    let navigationExtras: NavigationExtras = {
      queryParams: { brokCpId: brokCpId },
    };
    this.router.navigate([
      "/brokerage-details/detailed-brokerage-view",
      brokCpId,
    ]);
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getBrokerageDetails(this.offsetdb);
    } else {
      let init = 0;
      this.getBrokerageDetails(init);
    }
  }
}
