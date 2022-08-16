import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-brokerage-view",
  templateUrl: "./brokerage-view.component.html",
  styleUrls: ["./brokerage-view.component.css"],
})
export class BrokerageViewComponent implements OnInit {
  constructor(
    private apiService: RemoteApisService,
    private router: ActivatedRoute
  ) {}
  brokCpId: any;
  sizeofTable: any;
  auditTrialData: any;
  offset: any;
  recordsPerPage: any;
  offsetdb: any;
  curr_gst: any;
  detailedBrokerageList = [];

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.router.params.subscribe((params) => {
      this.brokCpId = params["id"];
    });
    this.getDetailedBrokerage(this.offset);
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getDetailedBrokerage(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getDetailedBrokerage(init);
    }
  }

  getDetailedBrokerage(page) {
    //
    let body = {
      userId: this.brokCpId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };

    this.apiService
      .getDataInputValue("finance/booking/by-user", body)
      .subscribe((res) => {
        // console.log(res,"res");
        this.detailedBrokerageList = res.content;
        this.sizeofTable = res.totalPages;
        // this.curr_gst=res["result"].GST;
      });
  }
}
