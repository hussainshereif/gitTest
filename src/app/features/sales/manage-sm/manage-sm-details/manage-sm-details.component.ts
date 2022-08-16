import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-manage-sm-details",
  templateUrl: "./manage-sm-details.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ManageSmDetailsComponent implements OnInit, OnDestroy {
  public offset: number = 0;
  public paramData: any;
  public recordsPerPage: number = 10;
  public smDetails: any = [];
  public sizeofTable;
  public smId: string = "";
  public tabId: number = 1;

  private destroy$: Subject<void> = new Subject<void>();
  private offsetdb: number = 0;

  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.paramData = params;
      this.smId = params.Id;
      this.getSM(this.offset);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDeleteSM(): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete this SM?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        let url = "admin/sales-manager/delete/" + this.smId;
        this.apiService
          .postData(url, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully"
            ).subscribe((result) => {});
          });
        this.router.navigate(["/manage-sm"]);
      }
    });
  }

  getSM(page) {
    let url = "admin/sales-manager/" + this.smId;
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.smDetails = res;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getSM(this.offsetdb);
    } else {
      let init = 0;
      this.getSM(init);
    }
  }

  tabActivation(i) {
    this.tabId = i;
  }
}
