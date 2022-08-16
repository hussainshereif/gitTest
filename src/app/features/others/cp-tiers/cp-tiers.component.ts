import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "../../../commonservice/remote-apis.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-cp-tiers",
  templateUrl: "./cp-tiers.component.html",
  styleUrls: ["./cp-tiers.component.css"],
})
export class CpTiersComponent implements OnInit {
  tierList: any;
  sizeOfTable: any;
  date: any;
  labelArray = ["Knight", "Bishop", "Prince", "King", "Emperor"];
  constructor(private apiService: RemoteApisService) {}

  ngOnInit() {
    this.getTierList();
  }

  getTierList() {
    let body = new URLSearchParams();

    this.apiService
      .postDataNotJSON("brokerage/getTierList", body.toString())
      .subscribe((res: any) => {
        this.tierList = res.result.loyaltymaster;
        this.date = res.result.DealCountStartDate;
      });
  }
}
