import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { AddFAQComponent } from "../../../../dialogs/add-faq/add-faq.component";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";
import { ConfirmationComponent } from "../../../../dialogs/confirmation/confirmation.component";
import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { DeleteConfirmationComponent } from "../../../../shared/delete-confirmation/delete-confirmation.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class FaqComponent implements OnInit, OnDestroy {
  @Input("projectId") projectId;

  public fAQList: any;
  public faqActive: any = 0;
  public offset: number = 0;
  public offsetdb: number = 0;
  public recordsPerPage: number = 400;
  public showFAQIndex: any;
  public sizeofTable: number = 0;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.showFAQIndex = -1;
    this.fAQList = [];
    this.getFAQ(this.offset, this.recordsPerPage);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addnewFAQ() {
    let dialogRef = this.dialog.open(AddFAQComponent, {
      width: "600px",
      data: { projectId: this.projectId, type: 1 },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getFAQ(this.offsetdb, this.recordsPerPage);
    });
  }

  cancelEditFAQ() {
    this.showFAQIndex = -1;
    this.getFAQ(this.offsetdb, this.recordsPerPage);
  }

  deleteFAQ(faqid) {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this FAQ?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        let body = new URLSearchParams();
        body.append("id", faqid);
        this.apiService
          .postDataNotJSON("sales/projectFaq/delete?id=" + faqid, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.getFAQ(this.offset, this.recordsPerPage);
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {});
          });
      }
    });
  }

  faqClicked(index) {
    this.faqActive = index === this.faqActive ? "" : index;
  }

  onEditFaq(smId: string, index: number): void {
    let dataObj = this.fAQList[index];
    let dialogRef = this.dialog.open(AddFAQComponent, {
      width: "600px",
      data: {
        type: 2,
        id: smId,
        content: dataObj,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.result) {
        this.getFAQ(this.offsetdb, this.recordsPerPage);
      }
    });
  }

  getFAQ(page, pagesize) {
    this.showFAQIndex = -1;
    let data = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: pagesize,
    };
    this.apiService
      .getDataInputValue("user/projectFaq", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.fAQList = res.content;
        this.sizeofTable = res.totalPages * 10;
      });
  }

  paginatedSearch(e) {
    this.offsetdb = this.offset - 1;
    if (this.offsetdb > 0) {
      this.getFAQ(this.offsetdb, this.recordsPerPage);
    } else {
      let init = 0;
      this.getFAQ(init, this.recordsPerPage);
    }
  }

  saveFAQ(faq) {
    let fid = faq.id;
    let faqData = {
      question: faq.question,
      answer: faq.answer,
    };
    this.apiService
      .postData("user/projectFaq/update?id=" + fid, faqData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getFAQ(this.offsetdb, this.recordsPerPage);
      });
  }
}
