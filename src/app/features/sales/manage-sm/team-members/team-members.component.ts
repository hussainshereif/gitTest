import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-team-members",
  templateUrl: "./team-members.component.html",
  styleUrls: ["./team-members.component.css"],
})
export class TeamMembersComponent implements OnInit, OnDestroy {
  @Input("id") smId;
  private destroy$: Subject<void> = new Subject<void>();
  offset: number = 0;
  offsetdb: number = 0;
  recordsPerPage: number = 10;
  teamMemberList: any = [];
  totalRecords: any;

  constructor(private apiService: RemoteApisService) {}

  ngOnInit(): void {
    this.getTeamMember(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTeamMember(page) {
    let url = "admin/teamMember";
    let queryData = { parentId: this.smId, pageNumber: page, pageSize: 10 };
    this.apiService
      .getDataInputValue(url, queryData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.teamMemberList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = e / 10;
    if (this.offsetdb > 0) {
      this.getTeamMember(this.offsetdb);
    } else {
      let init = 0;
      this.getTeamMember(init);
    }
  }
}
