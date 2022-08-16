import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { HelperService } from "../../../../../app/commonservice/common/helper.service";

@Component({
  selector: "app-helps-and-documents",
  templateUrl: "./helps-and-documents.component.html",
  styleUrls: ["./helps-and-documents.component.css"],
})
export class HelpsDocumentsComponent implements OnInit {
  agreementDocument: string;
  bodyFormdata: FormData = new FormData();
  documentData: any;
  email: string;
  faqDocument: string;
  helperData: any;
  phoneNumber: string;
  privacyPolicy: string;
  showEdit: Boolean = true;
  showEditDoc: Boolean = true;
  termsOfService: any;

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private helperService: HelperService
  ) {}

  ngOnInit(): void {
    this.getHelplineDetails();
    this.getDocumentDetails();
  }

  private getHelplineDetails(): void {
    let url = "user/about/help";
    this.apiService.getData(url).subscribe(
      (res) => {
        this.helperData = res;
        this.phoneNumber = this.helperData?.helplineNumber.slice(3);
        this.email = this.helperData?.supportEmail;
      },
      (error) => {
        this.helperData = "";
      }
    );
  }

  private getDocumentDetails(): void {
    let url = "user/about/documentAndLegal";
    this.apiService.getData(url).subscribe(
      (res) => {
        this.documentData = res;
        if (res) {
          this.agreementDocument = this.helperService.getFileName(
            res.agreementDocument
          );
          this.faqDocument = this.helperService.getFileName(res.faqDocument);
          this.privacyPolicy = this.helperService.getFileName(
            res.privacyPolicy
          );
          this.termsOfService = this.helperService.getFileName(
            res.termsOfService
          );
        }
      },
      (error) => {
        this.documentData = "";
      }
    );
  }

  public saveHelpData(): void {
    let body = new URLSearchParams();
    body.append("helpEmail", this.email);
    body.append("helpPhoneCountryCode", "91");
    body.append("helpPhone", this.phoneNumber);
    let url = "user/about/help";
    this.apiService.postDataNotJSON(url, body.toString()).subscribe((res) => {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Help Data Saved Successfully!"
      ).subscribe(() => {
        this.getHelplineDetails();
      });
    });
  }

  public saveDocumentData(): void {
    let formData: FormData = new FormData();
    if (this.bodyFormdata.has("agreementDocument"))
      formData.append("agreement", this.bodyFormdata.get("agreementDocument"));
    if (this.bodyFormdata.has("faqDocument"))
      formData.append("faq", this.bodyFormdata.get("faqDocument"));
    if (this.bodyFormdata.has("privacyPolicy"))
      formData.append("privacy", this.bodyFormdata.get("privacyPolicy"));
    if (this.bodyFormdata.has("termsOfService"))
      formData.append(
        "termsOfService",
        this.bodyFormdata.get("termsOfService")
      );
    let url = "user/about/documentAndLegal";
    this.apiService.postDataMultipartRaw(url, formData).subscribe((res) => {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Document Data Saved Successfully!"
      ).subscribe(() => {
        this.getDocumentDetails();
      });
    });
  }

  public onEdit(showEdit): void {
    this.showEdit = showEdit;
    if (showEdit) this.saveHelpData();
  }

  public onEditDoc(showEditDoc): void {
    this.showEditDoc = showEditDoc;
    if (showEditDoc) this.saveDocumentData();
  }

  public addFile(fileInput: any = null, fileType): void {
    if (this.bodyFormdata.has(fileType)) this.bodyFormdata.delete(fileType);
    this.bodyFormdata.append(
      fileType,
      fileInput.target.files[0],
      fileInput.target.files[0].name
    );
  }
}
