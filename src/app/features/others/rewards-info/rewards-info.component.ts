import { Component, OnInit } from '@angular/core';
import { RemoteApisService } from 'src/app/commonservice/remote-apis.service';

@Component({
  selector: 'app-rewards-info',
  templateUrl: './rewards-info.component.html',
  styleUrls: ['./rewards-info.component.css']
})
export class RewardsInfoComponent implements OnInit {

  constructor(private apiService:RemoteApisService) { }

  rewardsInfo= {
    "rewardFaq": [
      {
        "faqId": null,
        "projectId": null,
        "question": null,
        "answer": null,
        "faqStatus": 1
      }
    ],
    "redeem": null,
    "upgrade": null
  }

  ngOnInit() {
    this.getRewardsInfo();
    this.tabActivation(1);
  }
 
  rewardsList:any=[];
  redeem;
  tabId;
  tabActivation(i) {
    this.tabId = i;
  }


  getRewardsInfo(){
    // let id="super";
  
    let body = new URLSearchParams();
    // body.append('cpSfdcid',id);
      this.apiService.postDataNotJSON("edel/rewardInfoForWeb",body.toString())
      .subscribe(res=>{
        if(res["status"]==1)
        {
          this.rewardsInfo=res["result"];
          this.rewardsList=res["result"].rewardFaq;
          this.redeem=res["result"].redeem;
        }
      })
    
     }
}
