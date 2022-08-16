import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { RemoteApisService } from 'src/app/commonservice/remote-apis.service';

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent implements OnInit {
  @Input('cpId') cpId;
  teamList: any;
  offset;
  offsetdb;
  recordsPerPage;
  sizeofTable;

  constructor(private apiService: RemoteApisService) { }

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getTeamList(this.offset);
  }

  getTeamList(page) {
    // let body = new URLSearchParams();
    // body.append('offset', page);
    // body.append('recordsPerPage', this.recordsPerPage);
    // body.append('cpId', this.cpId);
    let data={
      'cpId':this.cpId,
      'pageNumber':page,
      'pageSize':this.recordsPerPage
    }
    this.apiService.getDataInputValue("admin/teamMember",data)
      .subscribe(res => {
        // console.log(res,"res");
        if (res.content) {
          this.teamList = res.content;
          this.sizeofTable = res.totalPages*10;
          // console.log(this.teamList);
        }
      })
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getTeamList(this.offsetdb);
    }
    else {
      let init = 0;
      this.getTeamList(init);
    }
  }
}