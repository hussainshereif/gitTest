import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-rewards-overview",
  templateUrl: "./rewards-overview.component.html",
  styleUrls: ["./rewards-overview.component.css"],
})
export class RewardsOverviewComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  RewardsList: any = [];
  sizeofTable;

  constructor(private apiService: RemoteApisService, private router: Router) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;

    this.getRewardsList(this.offset);
  }

  getRewardsList(page) {
    let body = new URLSearchParams();
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("edel/rewardList", body.toString())
      .subscribe((res) => {
        this.RewardsList = res["result"].rewardInfo;
        this.sizeofTable = res["result"].totalRecords;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getRewardsList(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getRewardsList(init);
    }
  }

  auditTrial(cpid) {
    let navigationExtras: NavigationExtras = {
      queryParams: { cpid: cpid },
    };
    this.router.navigate(["/audit-trial"], navigationExtras);
  }
}
