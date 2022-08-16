import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";
import { HelperService } from "../../../../commonservice/common/helper.service";
import { AlertComponent } from "../../../../dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-invoice-template-create",
  templateUrl: "./invoice-template-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class InvoiceTemplateCreateComponent implements OnInit, OnDestroy {
  bodyFormdata: FormData = new FormData();
  downloadableTemplate: string = "";
  downloadableTemplateValidation: any = { valid: true, insize: true };
  editForm: FormGroup;
  gst: any[] = [
    { id: 1, value: true },
    { id: 2, value: false },
  ];
  projectList: any = [];
  template: string = "";
  templateValidation: any = { valid: true, insize: true };
  templateID: number = 0;
  templateDetails: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.templateID = +params["id"] || 0;
    });
    this.editForm = this.createFormGroup();
    this.getProjectList();
    if (this.templateID !== 0) {
      this.getTemplateDetails();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get p() {
    return this.editForm.controls;
  }

  cancelEdit(): void {
    this.router.navigate(["/invoice-template"]);
  }

  public uploadTemplateFile(fileParam: string, fileInput: any = null): void {
    const file = fileInput.target.files[0].name.split(".").pop();
    if (file == "doc" || file == "pdf" || file == "docx") {
      this[fileParam + "Validation"] = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        if (this.bodyFormdata.has(fileParam))
          this.bodyFormdata.delete(fileParam);
        this.bodyFormdata.append(
          fileParam,
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this[fileParam] = fileInput.target.files[0].name;
        let message: { valid: boolean; insize: boolean };
        message.valid = true;
        message.insize = true;
        this[fileParam + "Validation"] = message;
      }
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.pdf, *doc, *docx"
      );
    }
  }

  public uploadFile(fileParam, fileInput: any = null): void {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "html") {
      this[fileParam + "Validation"] = { valid: true, insize: true };
      if (fileInput.target.files && fileInput.target.files[0]) {
        if (this.bodyFormdata.has(fileParam))
          this.bodyFormdata.delete(fileParam);
        this.bodyFormdata.append(
          fileParam,
          fileInput.target.files[0],
          fileInput.target.files[0].name
        );
        this[fileParam] = fileInput.target.files[0].name;
        let message: { valid: boolean; insize: boolean };
        message.valid = true;
        message.insize = true;
        this[fileParam + "Validation"] = message;
      }
    } else {
      AlertComponent.showAlert(this.dialog, "", "File format allowed *html ");
    }
  }

  getProjectList(): void {
    let url = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.projectList = res;
      });
  }

  getTemplateDetails(): void {
    this.apiService
      .getData("admin/invoice-template/" + this.templateID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.templateDetails = res;
        this.imagesController("template", this.templateDetails.htmlUrl);
        this.imagesController(
          "downloadableTemplate",
          this.templateDetails.invoiceUrl
        );
        this.editForm.patchValue(this.templateDetails);
      });
  }

  imagesController(fileparam, fileurl): void {
    if (fileurl) this[fileparam] = fileurl.split("/").pop();
    if (this.bodyFormdata.has(fileparam)) {
      this.bodyFormdata.append(fileparam, this.bodyFormdata.get(fileparam));
    } else {
      if (this[fileparam] != undefined) {
        this.helperService.urlToFile(fileurl).then((res) => {
          this.bodyFormdata.append(fileparam, res, res.name);
        });
      }
    }
  }

  addDetails(): void {
    this.editForm.value.submitted = true;
    let formData: FormData = new FormData();
    const invoiceTemplate = {
      addressLine1: this.editForm.value.addressLine1,
      addressLine2: this.editForm.value.addressLine2,
      cin: this.editForm.value.cin,
      gstNumber: this.editForm.value.gstNumber,
      panNumber: this.editForm.value.panNumber,
      state: this.editForm.value.state,
      stateCode: this.editForm.value.stateCode,
      subject: this.editForm.value.subject,
      sacCode: this.editForm.value.sacCode,
      withGst: this.editForm.value.withGst,
      projectName: this.editForm.value.projectName,
      companyName: this.editForm.value.companyName,
      reraNumber: this.editForm.value.reraNumber,
      height: this.editForm.value.height,
      width: this.editForm.value.width,
    };
    if (invoiceTemplate.width === 0) {
      invoiceTemplate.width = 930;
    }
    if (invoiceTemplate.height === 0) {
      invoiceTemplate.height = 1756;
    }
    formData.append("invoiceTemplate", JSON.stringify(invoiceTemplate));
    formData.append("htmlFile", this.bodyFormdata.get("template"));
    formData.append(
      "downloadableFile",
      this.bodyFormdata.get("downloadableTemplate")
    );
    if (this.editForm.valid) {
      if (this.templateID == 0) {
        this.apiService
          .postDataMultipartRaw("/admin/invoice-template", formData)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            this.templateID = res.id;
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Your template details have been saved!"
            );
          });
      } else {
        this.apiService
          .postDataMultipartRaw(
            "/admin/invoice-template/update/" + this.templateID,
            formData
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            let Id = res.id;
            this.templateID = res.id;

            AlertComponent.showAlert(
              this.dialog,
              "",
              "Your template details have been updated!"
            );
          });
      }
    }
  }

  createFormGroup() {
    return this.formBuilder.group({
      addressLine1: ["", [Validators.required]],
      addressLine2: [""],
      cin: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      withGst: [false, [Validators.required]],
      subject: [""],
      state: ["", [Validators.required]],
      stateCode: [""],
      sacCode: [""],
      panNumber: ["", [Validators.required]],
      projectName: [""],
      companyName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      reraNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      gstNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      submitted: [false],
      height: ["1756", [Validators.required, Validators.pattern("^[0-9]*$")]],
      width: ["930", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }
}
