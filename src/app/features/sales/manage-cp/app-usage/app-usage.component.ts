import { Component, OnInit } from "@angular/core";
import { Input } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";

@Component({
  selector: "app-app-usage",
  templateUrl: "./app-usage.component.html",
  styleUrls: ["./app-usage.component.css"],
})
export class AppUsageComponent implements OnInit {
  panelOpenState = false;
  @Input("cpId") cpId;
  trainingData: any = [];
  projectData: any = [];
  timeSpendArr: any = [];

  constructor(private apiService: RemoteApisService) {}

  ngOnInit() {
    this.getTrainingDetails();
    this.getAppUsageDetails();
  }

  getAppUsageDetails() {
    let body = { userId: this.cpId };

    this.apiService
      .getDataInputValue("admin/usage/project/by-user", body)
      .subscribe((res) => {
        // console.log(res);
        this.projectData = res;
      });
  }

  getTrainingDetails() {
    let data = {
      cpId: this.cpId,
      pageNumber: 0,
      pageSize: 50,
    };
    this.apiService
      .getDataInputValue("admin/teamMember", data)
      .subscribe((res) => {
        // console.log("result is:", res);
        this.trainingData = res.content;
      });
  }
}
