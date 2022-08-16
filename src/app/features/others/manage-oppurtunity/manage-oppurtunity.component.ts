import { Component, OnInit } from '@angular/core';
import { RemoteApisService } from 'src/app/commonservice/remote-apis.service';

@Component({
  selector: 'app-manage-oppurtunity',
  templateUrl: './manage-oppurtunity.component.html',
  styleUrls: ['./manage-oppurtunity.component.css']
})
export class ManageOppurtunityComponent implements OnInit {

  offset;
  offsetdb;
  recordsPerPage;
  OppurtunityList:any=[];
  sizeofTable;
  constructor(private apiService:RemoteApisService) { }

  ngOnInit() {

  this.offset=0;
  this.recordsPerPage=10;

  this.getOppurtunityList(this.offset);
  }


  getOppurtunityList(page){
  
    let body = new URLSearchParams();
    body.append('offset', page);
    body.append('recordsPerPage', this.recordsPerPage);
      this.apiService.postDataNotJSON("edel/opportunityListForAdmin",body.toString())
      .subscribe(res=>{
      this.OppurtunityList=res["result"].OpportunityList;
     this.sizeofTable=res["result"].totalRecords;
      })
    
     }


     paginatedSearch(e) {
      this.offsetdb=this.offset-1;
      if(this.offsetdb>0){
       this.getOppurtunityList(this.offsetdb*10);
      }
      else{
        let init=0;
        this.getOppurtunityList(init);
      }
     }


}
