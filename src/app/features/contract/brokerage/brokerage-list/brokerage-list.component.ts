import { Component, OnInit } from "@angular/core";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-brokerage-list",
  templateUrl: "./brokerage-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class BrokerageListComponent implements OnInit {
  brokerageList: any;
  bookings: any;
  cpList: any;
  cpName: string;
  laddersList: any = [];
  offset: number = 0;
  offsetdb;
  projectList: any;
  projectId: any;
  recordsPerPage: number = 10;
  sizeofTable: any;
  totalBrokerage: any;
  totalRecords: any;
  uType: any;

  private destroy$: Subject<void> = new Subject();

  constructor(private apiService: RemoteApisService) {}

  ngOnInit() {
    this.getCpGroup();
    this.getprojectList();
    this.getBrokerageDetails(this.offset, "", "");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getCpGroup(): void {
    const inputData = {
      pageNumber: 0,
      pageSize: 100000,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/channelPartner";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpList = res.content;
        this.cpList.unshift({ name: "All", id: "" });
      });
  }

  private getprojectList(): void {
    let url = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectList = res;
        this.projectList.unshift({ projectName: "All", id: "" });
      });
  }

  private getBrokerageDetails(page, projectId = "", cpId = ""): void {
    let body = {
      projectId: projectId,
      parentUserId: cpId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("finance/booking/brokerage", body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.brokerageList = res.bookingBrokerageDtos.content;
        this.bookings = res.bookings;
        this.totalRecords = res.bookingBrokerageDtos.totalElements;
        this.totalBrokerage = res.totalBrokerage;
      });
  }

  public onSearch(): void {
    this.getBrokerageDetails(this.offset, this.projectId, this.cpName);
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    if (this.offsetdb > 0) {
      this.getBrokerageDetails(this.offsetdb, this.projectId, this.cpName);
    } else {
      let init = 0;
      this.getBrokerageDetails(init, this.projectId, this.cpName);
    }
  }
}
