import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-invoice-template-list",
  templateUrl: "./invoice-template-list.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class InvoiceTemplateListComponent implements OnInit, OnDestroy {
  invoiceId: number;
  invoiceList: any = [];
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  showIndex;
  sizeofTable;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getinvoiceList(this.offset);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addInvoice(): void {
    this.invoiceId = 0;
    this.router.navigate(["/invoice-template/create"]);
  }

  deleteinvoiceList(id, event): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the Invoice Template?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.deleteInvoice(id);
      }
    });
    event.stopPropagation();
  }

  deleteInvoice(id: number): void {
    this.apiService
      .postDataNotJSON("admin/invoice-template/delete/" + id, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Deleted successfully!!"
        ).subscribe((result) => {});
        this.getinvoiceList(this.offsetdb);
      });
  }

  editinvoiceList(pid, event): void {
    this.invoiceId = pid;
    this.router.navigate(["/invoice-template/create", this.invoiceId]);
    event.stopPropagation();
  }

  //Invoice listing start
  getinvoiceList(page): void {
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("admin/invoice-template", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.invoiceList = res.content;
        console.log(this.invoiceList);
        this.sizeofTable = res.totalPages * 10;
        this.totalRecords = res.totalElements;
      });
  }

  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    this.getinvoiceList(this.offsetdb);
  }
}
