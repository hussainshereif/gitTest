import { Component, OnInit, ViewChild } from "@angular/core";
import { Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { MessageComponent } from "../../../../../app/dialogs/message/message.component";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { environment } from "../../../../../environments/environment";
import { CollateralViewComponent } from "./collateral-view/collateral-view.component";
import { CollateralCreateComponent } from "./collateral-create/collateral-create.component";
import { TemplateSelectComponent } from "./template-select/template-select.component";

import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-downloads",
  templateUrl: "./downloads.component.html",
  styleUrls: ["./downloads.component.css"],
})
export class DownloadsComponent implements OnInit {
  @Input("projectId") projectId;
  collateralStatus: any;
  collateralType: number;
  BName;
  bgValidation = { valid: true, insize: true };
  downloadList: any = [];
  docUrl: any = "";
  docId: any;
  docType: any;
  isCustomCollateral = environment.enableCustomCollateral;
  isCollateral: boolean = false;
  offset: number = 0;
  offsetdb: number;
  pdfUrl: any = null;
  recordsPerPage: number = 10;
  sizeofTable;
  submitted = false;
  totalRecords;
  viewURL: any = null;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getDownloads(this.offset);
    this.collateralType = 0;
    this.collateralStatus = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    this.getDownloads(this.offsetdb);
  }

  public addBrochure(fileInput: any = null): void {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "pdf") {
      this.submitted = true;
      this.bgValidation = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        this.bgValidation = this.apiService.getPDFValidation(
          fileInput.target.files[0]
        );
        this.BName = fileInput.target.files[0].name;
        let formData: FormData = new FormData(),
          xhr: XMLHttpRequest = new XMLHttpRequest();
        formData.append("projectId", this.projectId);
        formData.append("isCustomizable", this.collateralStatus);
        formData.append("name", fileInput.target.files[0].name);
        formData.append(
          "file",
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        let url = "sales/projectBrochure?projectId=" + this.projectId;

        if (formData.has("file")) {
          if (this.bgValidation.valid == true) {
            this.apiService
              .uploadBrochure(formData, url)
              .pipe(takeUntil(this.destroy$))
              .subscribe((event) => {
                this.docId = event.id;
                this.BName = "";
                this.getDownloads(this.offset);
              });
          }
        }
      }
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Only file format *.pdf allowed"
      );
    }
  }

  public addCollateral(): void {
    this.viewURL = null;
    let dialogRef = this.dialog.open(CollateralCreateComponent, {
      width: "650px",
      data: {
        id: this.projectId,
        status: "new",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status == 1) {
        this.getDownloads(this.offsetdb);
      } else if (result.status == 3) {
        this.docId = result.id;
        this.isCollateral = true;
        this.docType = result.type;
        this.docUrl = result.url;
        if (this.isCollateral) {
          this.addTemplate(this.docId, this.docType, this.docUrl);
        }
      }
    });
  }

  public customizeDoc(docId): void {
    this.collateralType = 1;
    this.docId = 1;
  }

  public changeActiveStatus(value, id) {
    this.apiService
      .postData(
        "sales/ProjectBrochure/publish?id=" + id + "&isPublished=" + value,
        ""
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getDownloads(this.offsetdb);
      });
  }

  public deleteBrochure(bid): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure you want to delete this brochure?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postDataNotJSON("sales/projectBrochure/delete?id=" + bid, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Deleted successfully!!"
            ).subscribe((result) => {
              this.getDownloads(this.offsetdb);
            });
          });
      }
    });
  }

  public editCollateral(id): void {
    this.viewURL = null;
    let dialogRef = this.dialog.open(CollateralCreateComponent, {
      width: "650px",
      data: {
        id: id,
        status: "update",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.status == 1) {
        this.getDownloads(this.offsetdb);
      } else if (result.status == 3) {
        this.docId = result.id;
        this.isCollateral = true;
        this.docType = result.type;
        this.docUrl = result.url;
        if (this.isCollateral) {
          this.addTemplate(this.docId, this.docType, this.docUrl);
        }
      }
    });
  }

  public openView(collateral): void {
    if (collateral.type == "TEXT") {
      let message = collateral.shareMessage;
      MessageComponent.showMessage(this.dialog, "Message", message).subscribe(
        (result) => {}
      );
    } else {
      let dialogRef = this.dialog.open(CollateralViewComponent, {
        width: "650px",
        data: {
          projectId: this.projectId,
          collateral: collateral,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  private addTemplate(docId, docType, docUrl): void {
    let dialogRef = this.dialog.open(TemplateSelectComponent, {
      width: "100%",
      data: {
        docId: docId,
        docType: docType,
        docUrl: docUrl,
        downloadList: this.downloadList,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  private getDownloads(page): void {
    let data = {
      projectId: this.projectId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("sales/projectBrochure", data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.downloadList = res.content;
        this.totalRecords = res.totalElements;
      });
  }
}
