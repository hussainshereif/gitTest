import { Component, OnInit } from "@angular/core";

import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { environment } from "../../../../../environments/environment";
import { RejectInvoiceComponent } from "../../../../dialogs/reject-invoice/reject-invoice.component";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { ViewLogComponent } from "../../../../dialogs/view-log/view-log.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.css"],
})
export class InvoiceComponent implements OnInit {
  public bgValidation = { valid: true, insize: true };
  public invoiceExcel: string = environment.COMMON_FILES.INVOICE_EXCEL;
  public InvoiceList = [];
  public invoiceStatusList: any = [];
  public invStatus: string = "";
  public keyName: string = "";
  public keyValue: string = "";
  public offset: number = 0;
  public offsetdb: number = 0;
  public recordsPerPage: number = 10;
  public showIndex: any;
  public sizeofTable: number = 0;
  public sortValue: string = "";
  public uploadStatus: string;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getInvoiceList(
      this.offset,
      this.recordsPerPage,
      this.sortValue,
      this.keyName,
      this.keyValue
    );
    this.invoiceStatus();
  }

  activationChange(invoId: string, e: any): void {
    if (e.target.value == "REJECTED") {
      let dialogRef = this.dialog.open(RejectInvoiceComponent, {
        width: "400px",
        data: {
          invoId: invoId,
          type: "1",
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.offsetdb = this.offset - 1;
        if (this.offsetdb > 0) {
          this.getInvoiceList(
            this.offsetdb,
            this.recordsPerPage,
            this.sortValue,
            this.keyName,
            this.keyValue
          );
        } else {
          let init = 0;
          this.getInvoiceList(
            init,
            this.recordsPerPage,
            this.sortValue,
            this.keyName,
            this.keyValue
          );
        }
      });
    } else {
      let data = {
        status: e.target.value,
        statusComments: "",
      };
      this.apiService
        .postDataNotJSON(
          "finance/invoice/changeStatus/" +
            invoId +
            "?status=" +
            e.target.value +
            "&statusComments=" +
            "",
          ""
        )
        .subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Invoice approved successfully!!"
          ).subscribe((result) => {});
          this.offsetdb = this.offset - 1;
          if (this.offsetdb > 0) {
            this.getInvoiceList(
              this.offsetdb,
              this.recordsPerPage,
              this.sortValue,
              this.keyName,
              this.keyValue
            );
          } else {
            let init = 0;
            this.getInvoiceList(
              init,
              this.recordsPerPage,
              this.sortValue,
              this.keyName,
              this.keyValue
            );
          }
        });
    }
  }

  getInvoiceList(
    page: number,
    pageSize: number,
    sortValue: string,
    keyName: string,
    keyValue: any
  ): void {
    let data = {
      key: keyName,
      value: keyValue,
      pageNumber: page,
      pageSize: pageSize,
      sortBy: sortValue,
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("finance/invoice", data)
      .subscribe((res) => {
        this.sizeofTable = res.totalPages * 10;
        this.InvoiceList = res.content;
      });
  }

  invoiceStatus(): void {
    this.apiService
      .getData("no-auth/enum/invoice-statuses")
      .subscribe((res) => {
        let index = res.indexOf("PENDING_SIGNATURE");
        res.splice(index, 1);
        this.invoiceStatusList = res;
      });
  }

  paginatedSearch(e: any): void {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getInvoiceList(
        this.offsetdb,
        this.recordsPerPage,
        this.sortValue,
        this.keyName,
        this.keyValue
      );
    } else {
      let init = 0;
      this.getInvoiceList(
        init,
        this.recordsPerPage,
        this.sortValue,
        this.keyName,
        this.keyValue
      );
    }
  }

  async uploadExcel(fileInput: any = null) {
    this.uploadStatus = "Processing...";
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.bgValidation = this.apiService.getExcellValidation(
        fileInput.target.files[0]
      );
      if (this.bgValidation.valid == true) {
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        formData.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        let url = "admin/invoice/uploadExcel";
        this.apiService.uploadExcel(formData, url).subscribe(
          (res) => {
            if (res.status == "SUCCESS") {
              fileInput.target.value = "";
              //failed
              this.uploadStatus = "Upload Done";
              this.offsetdb = this.offset - 1;
              if (this.offsetdb > 0) {
                this.getInvoiceList(this.offsetdb, 10, "", "", "");
              } else {
                let init = 0;
                this.getInvoiceList(init, 10, "", "", "");
              }
            } else {
              this.uploadStatus = "Partial success";
              AlertComponent.showAlert(this.dialog, res.status, res.message);
            }
          },
          (error) => {
            this.uploadStatus = "Upload Failed";
          }
        );
      } else {
        if (this.bgValidation.insize == false)
          this.uploadStatus = "File size cannot exceed 1 MB";
        else this.uploadStatus = "File Format is invalid!";
      }
    }
  }

  viewLog(): void {
    let dialogRef = this.dialog.open(ViewLogComponent, {
      width: "800px;",
      data: {
        type: "Invoice",
        offset: this.offset,
        recordsPerPage: this.recordsPerPage,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.offsetdb > 0) {
        this.getInvoiceList(
          this.offsetdb,
          this.recordsPerPage,
          this.sortValue,
          this.keyName,
          this.keyValue
        );
      } else {
        let init = 0;
        this.getInvoiceList(
          init,
          this.recordsPerPage,
          this.sortValue,
          this.keyName,
          this.keyValue
        );
      }
    });
  }
}
