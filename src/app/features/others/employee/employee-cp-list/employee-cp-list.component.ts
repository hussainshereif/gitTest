import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-employee-cp-list",
  templateUrl: "./employee-cp-list.component.html",
  styleUrls: ["./employee-cp-list.component.css"],
})
export class EmployeeCpListComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  sizeofTable;
  empCpList = [];
  empId: any;
  cpsfdcId: any;
  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.cpsfdcId = "";
    this.router.queryParams.subscribe((params) => {
      this.empId = params["empId"];
    });
    this.getEmployeeCP(this.offset, this.cpsfdcId);
  }

  getEmployeeCP(page, cpsfdcId) {
    if (cpsfdcId) {
      this.cpsfdcId = cpsfdcId;
    }
    let body = new URLSearchParams();
    body.append("empId", this.empId);
    body.append("cpsfdcId", cpsfdcId);
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("employee/empCPList", body.toString())
      .subscribe((res) => {
        this.empCpList = res["result"].employeeList;
        this.sizeofTable = res["result"].totalRecords;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getEmployeeCP(this.offsetdb * 10, this.cpsfdcId);
    } else {
      let init = 0;
      this.getEmployeeCP(init, this.cpsfdcId);
    }
  }
}
