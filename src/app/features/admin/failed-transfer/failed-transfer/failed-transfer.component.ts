import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-failed-transfer",
  templateUrl: "./failed-transfer.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class FailedTransferComponent implements OnInit, OnDestroy {
  failedTransferId: number;
  failedTransferList: any = [];
  filterForm: FormGroup;
  filterList: boolean = false;
  offset: number = 0;
  offsetdb: number;
  recordsPerPage: number = 10;
  showFilter: boolean;
  status: any[] = [
    { name: "Resolved", value: true },
    { name: "UnResolved", value: false },
  ];
  totalRecords: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getfailedTransferList(this.offset);
    this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createForm(): void {
    this.filterForm = this.fb.group({
      status: [""],
    });
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.filterList = false;
    this.getfailedTransferList(this.offset);
  }

  deleteFailedTransferList(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete this log?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.deleteFailedTransfer(id);
      }
    });
  }

  deleteFailedTransfer(id: number): void {
    this.apiService
      .postData("admin/lead-transfer-failure/delete/" + id, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.showAlert("Deleted successfully!");
        this.getfailedTransferList(this.offsetdb);
      });
  }

  filterFormSubmit(): void {
    this.filterList = true;
    this.getfailedTransferList(0);
  }

  //failedTransfer listing start
  getfailedTransferList(page): void {
    let data = {
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isResolved: "",
      isAscending: true,
    };
    if (this.filterList) {
      data.isResolved = this.filterForm.controls.status.value;
    }
    this.apiService
      .getDataInputValue("admin/lead-transfer-failure/", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.failedTransferList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  openNav(): void {
    this.showFilter = true;
  }

  retryNow(id: number): void {
    this.apiService
      .postData("admin/lead-transfer-failure/retry?failureId=" + id, "")
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.showAlert("Retried successfully!");
          this.getfailedTransferList(this.offsetdb);
        },
        (error) => {
          this.getfailedTransferList(this.offsetdb);
        }
      );
  }

  showAlert(message: string): void {
    AlertComponent.showAlert(this.dialog, "", message).subscribe();
  }

  paginatedSearch(e): void {
    this.offsetdb = e.first / 10;
    this.getfailedTransferList(this.offsetdb);
  }
}
