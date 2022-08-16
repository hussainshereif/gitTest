import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { DocumentDetailsComponent } from "../../../../../app/dialogs/document-details/document-details.component";
import { RejectComponent } from "../../../../../app/dialogs/reject/reject.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.css"],
})
export class DocumentsComponent implements OnInit {
  @Input("cpId") cpId;

  documentsArr: any = [];
  statusArr: any = [];

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDocuments();
    this.getStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public activationChange(id, status): void {
    if (status == "REJECTED") {
      let dialogRef = this.dialog.open(RejectComponent, {
        width: "650px",
        data: { id: id },
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.getDocuments();
      });
    } else {
      this.apiService
        .postData(
          "admin/document/change-status/" +
            id +
            "?status=" +
            status +
            "&rejectionReason=",
          ""
        )
        .subscribe((res) => {
          this.getDocuments();
        });
    }
  }

  public documentDetails(id, type): void {
    let dialogRef = this.dialog.open(DocumentDetailsComponent, {
      width: "650px",
      data: { docId: id, docType: type },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  public onClickDocument(doc): void {
    if (doc.link) {
      let link = document.createElement("a");
      link.href = doc.link;
      link.target = "_blank";
      link.click();
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Document not uploaded/available"
      );
    }
  }

  private getStatus(): void {
    let url = "no-auth/enum/document-statuses";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.statusArr = res;
      });
  }

  private getDocuments(): void {
    let url = "admin/document?cpId=" + this.cpId;
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.documentsArr = res;
      });
  }
}
