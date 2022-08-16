import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "app-audit-trial",
  templateUrl: "./audit-trial.component.html",
  styleUrls: ["./audit-trial.component.css"],
})
export class AuditTrialComponent implements OnInit {
  constructor(
    private apiService: RemoteApisService,
    private router: ActivatedRoute
  ) {}
  cpid: any;
  sizeofTable: any;
  auditTrialData: any;
  offset: any;
  recordsPerPage: any;
  offsetdb: any;
  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;

    this.router.queryParams.subscribe((params) => {
      this.cpid = params["cpid"];
    });
    this.getauditDta(this.offset);
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getauditDta(this.offsetdb * 10);
    } else {
      let init = 0;
      this.getauditDta(init);
    }
  }

  getauditDta(page) {
    let body = new URLSearchParams();
    body.append("cpId", this.cpid);
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);

    this.apiService
      .postDataNotJSON("apiCommon/auditTrialList", body.toString())
      .subscribe((res) => {
        // console.log(res);
        this.auditTrialData = res["result"].auditList;
        this.sizeofTable = res["result"].totalRecords;
      });
  }
}
