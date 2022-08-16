import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { RemoteApisService } from 'src/app/commonservice/remote-apis.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  dealsList: any;
  @Input('cpId') cpId;
  @Input('cpSfdcId') cpSfdcId
  offset;
  offsetdb;
  recordsPerPage;
  sizeofTable;
  leadStatusList: any;
  filterProjectList: any;
  projectSfdcId: any;
  statusValue: any;
  leadName: any;
  leadOptions:any=[];
  statusArr:any=['BOOKING_DONE','CANCELLED','ENQUIRY','REGISTRATION_DONE','SITE_VISIT_BOOKED','SITE_VISIT_DONE'];
  leadStatus:any='';

  constructor(private apiService: RemoteApisService) { }

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.getDeals(this.offset,"","","");
    this.getLeadOptions();
    // this.getProjectList(this.cpSfdcId);
    // this.getLeadStatusList();
  }

  getDeals(page,status,key,keyValue) {
    this.leadStatus=status;
    let data={
      'cpId':this.cpId,
      'pageNumber':page,
      'pageSize':this.recordsPerPage,
      'sortBy':'',
      'isAscending':true,
      'searchBy':key,
      'value':keyValue,
      'status':status
    }

    this.apiService.getDataInputValue("admin/enquiry",data)
      .subscribe(res => {
        // console.log(res,"result");
        if (res.content) {
          this.dealsList = res.content;
          this.sizeofTable = res.totalPages*10;
        }
      })
  }

  sortBy(datas,type) { 
   this.leadName = '';
   this.statusValue = '';
   this.projectSfdcId = '';
   if(type==1){
    this.leadName = datas;
   } else if (type==2){
    this.statusValue = datas;
   } else if (type==3) {
    this.projectSfdcId = datas;
   }
   if (type==2 && datas==1) {
    this.statusValue = '';
   }
   if (type==3 && datas==1) {
    this.projectSfdcId = '';
   }
    this.offset = 0;
    this.recordsPerPage = 10;
    let body = new URLSearchParams();
    body.append('offset', this.offset);
    body.append('recordsPerPage', this.recordsPerPage);
    body.append('brokCpId', this.cpId);
    body.append('leadName', this.leadName);
    body.append('statusValue', this.statusValue);
    body.append('projectSfdcId', this.projectSfdcId);

    this.apiService.postDataNotJSON("brokerage/detailedBrokerage", body.toString())
      .subscribe(res => {
        if (res["result"].brokerageList) {
          this.dealsList = res["result"].brokerageList;
          //console.log(this.dealsList);
        }
      })
  }

  getLeadStatusList() {
    let body = new URLSearchParams();
    this.apiService.postDataNotJSON("edel/leadStatusListApi",'')
      .subscribe(res => {
        if (res["result"].leadStatusList) {
          this.leadStatusList = res["result"].leadStatusList;
          var removed = this.leadStatusList.splice(-1);
         // console.log(this.leadStatusList);
        }
      })
  }

  getProjectList(cpSfdcId) {
    let body = new URLSearchParams();
    body.append('cpSfdcId', cpSfdcId);
    this.apiService.postDataNotJSON("project/filterProjectList", body.toString())
      .subscribe(res => {
        if (res["result"].filterProjectList) {
          this.filterProjectList = res["result"].filterProjectList;
         // console.log(this.filterProjectList);
        }
      })
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getDeals(this.offsetdb,this.leadStatus,'','');
    }
    else {
      let init = 0;
      this.getDeals(init,this.leadStatus,'','');
    }
  }

  getLeadOptions(){
    let url="no-auth/enum/lead-search-by";
    this.apiService.getData(url).subscribe(res=>{
      // console.log(res,"res opt");
      this.leadOptions=res.slice(1,-1);
      // var removed = this.leadOptions.slice(1,-1);
      // this.leadOptions=res;
    })
  }
}