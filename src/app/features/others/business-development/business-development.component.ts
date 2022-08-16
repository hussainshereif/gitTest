import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  HttpResponse,
  HttpEventType,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { RejectInvoiceComponent } from "src/app/dialogs/reject-invoice/reject-invoice.component";
import { DomSanitizer } from "@angular/platform-browser";
import { BdMapComponent } from "src/app/dialogs/bd-map/bd-map.component";

@Component({
  selector: "app-business-development",
  templateUrl: "./business-development.component.html",
  styleUrls: ["./business-development.component.css"],
})
export class BusinessDevelopmentComponent implements OnInit {
  offset;
  offsetdb;
  recordsPerPage;
  businessList = [];
  showIndex;
  sizeofTable;
  mapUrl: string;
  busStatusVal: any;
  cpSFDCID: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.recordsPerPage = 10;
    this.busStatusVal = 3;
    this.cpSFDCID = "";
    this.getBusinessList(this.offset, this.busStatusVal, this.cpSFDCID);
  }

  getBusinessList(page, busStatusVal, cpSFDCID) {
    if (busStatusVal) {
      this.busStatusVal = busStatusVal;
    } else {
      this.busStatusVal = "";
    }
    if (cpSFDCID) {
      this.cpSFDCID = cpSFDCID;
    } else {
      this.cpSFDCID = "";
    }
    let body = new URLSearchParams();
    body.append("busStatus", this.busStatusVal);
    body.append("cpSFDCID", this.cpSFDCID);
    body.append("offset", page);
    body.append("recordsPerPage", this.recordsPerPage);
    this.apiService
      .postDataNotJSON("business/businessListAdmin", body.toString())
      .subscribe((res) => {
        this.sizeofTable = res["result"].totalRecords;
        this.businessList = res["result"].businessList;
        if (this.businessList) {
          this.businessList.forEach((valueData, index) => {
            if (valueData.buslatitude && valueData.buslongitude) {
              this.businessList[index].mapUrl =
                "https://maps.google.com/maps?q=" +
                valueData.buslatitude +
                "," +
                valueData.buslongitude +
                "&hl=es;z=14&output=embed";
            }
          });
        }
      });
  }
  viewMap(latitude, longitude) {
    let mapUrl = "https://www.google.com/maps?q=" + latitude + "," + longitude;
    //  console.log(mapUrl)
    //  if(busUrl=="https://www.google.com/maps/d/viewer?"){
    window.open(mapUrl, "_blank");
    //  }
  }
  activationChange(busId, e) {
    if (e.target.value == 2) {
      let dialogRef = this.dialog.open(RejectInvoiceComponent, {
        width: "400px",
        data: {
          invoId: busId,
          type: "2",
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getBusinessList(
            this.offsetdb * 10,
            this.busStatusVal,
            this.cpSFDCID
          );
        } else {
          let init = 0;
          this.getBusinessList(init, this.busStatusVal, this.cpSFDCID);
        }
      });
    } else {
      let body = new URLSearchParams();
      body.append("busId", busId);
      body.append("busStatus", e.target.value);
      body.append("busStatusComment", "");
      this.apiService
        .postDataNotJSON("business/businessApproval", body.toString())
        .subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Approved successfully!!"
          ).subscribe((result) => {});
          this.offsetdb = this.offset - 1;
          if (this.offsetdb > 0) {
            this.getBusinessList(
              this.offsetdb * 10,
              this.busStatusVal,
              this.cpSFDCID
            );
          } else {
            let init = 0;
            this.getBusinessList(init, this.busStatusVal, this.cpSFDCID);
          }
        });
    }
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getBusinessList(
        this.offsetdb * 10,
        this.busStatusVal,
        this.cpSFDCID
      );
    } else {
      let init = 0;
      this.getBusinessList(init, this.busStatusVal, this.cpSFDCID);
    }
  }
}
