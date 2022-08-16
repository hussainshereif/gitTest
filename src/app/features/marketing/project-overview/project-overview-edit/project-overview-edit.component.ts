import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { HelperService } from "../../../../../app/commonservice/common/helper.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-projects-overview-edit",
  templateUrl: "./project-overview-edit.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ProjectsOverviewEditComponent implements OnInit {
  bodyFormdata: FormData = new FormData();
  backgroundImage = "";
  backgroundImageValidation = { valid: true, insize: true };
  constructionStatusList: any;
  developerLogoValidation = { valid: true, insize: true };
  developerLogo = "";
  editForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  onConstructionStatusList: any;
  projectLogoValidation = { valid: true, insize: true };
  projectLogo = "";
  projectDetails: any;
  projectId: number;
  sub: any;
  private destroy$: Subject<void> = new Subject();

  public apartmentList: any[] = [
    { Value: "0", Text: "1 RK", Type: "_0_RK", selected: false },
    { Value: "1", Text: "1 BHK", Type: "_1_BHK", selected: false },
    { Value: "1.5", Text: "1.5 BHK", Type: "_1_5_BHK", selected: false },
    { Value: "2", Text: "2 BHK", Type: "_2_BHK", selected: false },
    { Value: "2.5", Text: "2.5 BHK", Type: "_2_5_BHK", selected: false },
    { Value: "3", Text: "3 BHK", Type: "_3_BHK", selected: false },
    { Value: "3.5", Text: "3.5 BHK", Type: "_3_5_BHK", selected: false },
    { Value: "4", Text: "4 BHK", Type: "_4_BHK", selected: false },
    { Value: "4.5", Text: "4.5 BHK", Type: "_4_5_BHK", selected: false },
    { Value: "5", Text: "5 BHK", Type: "_5_BHK", selected: false },
  ];

  public offerList: any[] = [
    { value: 0, Text: "No offer Available" },
    { value: 1, Text: "Special offer Available" },
  ];

  constructor(
    private apiService: RemoteApisService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private helperService: HelperService
  ) {
    this.minDate = new Date();
    this.minDate.setMonth(1);
    this.minDate.setFullYear(2000);
    this.maxDate = new Date();
    this.maxDate.setMonth(12);
    this.maxDate.setFullYear(2050);
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.projectId = +params["id"] || 0;
    });
    this.onConstructionStatus();
    this.editForm = this.createFormGroup();
    if (this.projectId != 0) {
      this.getProjectDetails();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onConstructionStatus(): void {
    let url = "no-auth/enum/project-statuses";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.constructionStatusList = res;
      });
  }

  public uploadFile(fileParam, fileInput: any = null): void {
    let file = fileInput.target.files[0].name.split(".").pop();
    if (file == "png" || file == "jpg" || file == "jpeg" || file == "svg") {
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
        this.apiService
          .getImageValidation(fileInput.target.files[0])
          .then((message: { valid: boolean; insize: boolean }) => {
            this[fileParam + "Validation"] = message;
          });
      }
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "File format allowed *.png, *.jpg, *.jpeg and *.svg "
      );
    }
  }

  public getProjectDetails(): void {
    this.apiService
      .getData("user/project/" + this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectDetails = res;
        this.projectDetails.possessionDate = new Date(
          this.projectDetails.possessionDate
        );
        this.projectDetails.rate = this.projectDetails.price;
        let cityData = this.projectDetails.city.split(",");
        this.projectDetails.city = cityData[0];
        this.projectDetails.state = cityData[1];
        this.imagesController(
          "developerLogo",
          this.projectDetails.developerLogo
        );
        this.imagesController(
          "backgroundImage",
          this.projectDetails.projectBgImage
        );
        this.imagesController("projectLogo", this.projectDetails.projectLogo);
        this.editForm.patchValue(this.projectDetails);
      });
  }

  private imagesController(fileparam, fileurl): void {
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

  public addDetails(): void {
    this.editForm.value.submitted = true;
    const data = {
      aboutDeveloper: this.editForm.value.aboutDeveloper,
      address: this.editForm.value.address + this.editForm.value.address1,
      city: this.editForm.value.city + "," + this.editForm.value.state,
      apartment: this.editForm.value.apartment.toString(),
      area: this.editForm.value.area.toString(),
      crmId: this.editForm.value.crmId,
      developedBy: this.editForm.value.developedBy,
      disclaimer: this.editForm.value.disclaimer,
      leadExpiry: this.editForm.value.leadExpiry,
      offerStatus: this.editForm.value.offerStatus.toString(),
      possessionDate: this.datepipe.transform(
        this.editForm.value.possessionDate,
        "yyyy-MM-dd"
      ),
      status: this.editForm.value.status,
      projectDescription: this.editForm.value.projectDescription,
      projectName: this.editForm.value.projectName,
      projectTitle: this.editForm.value.projectTitle,
      rate: this.editForm.value.rate.toString(),
      reraNumber: this.editForm.value.reraNumber,
      reraWebsite: this.editForm.value.reraWebsite,
      websiteUrl: this.editForm.value.websiteUrl,
      tower: this.editForm.value.tower,
      salesTeamEmail: this.editForm.value.salesTeamEmail,
      priority: this.editForm.value.priority.toString(),
    };
    if (this.editForm.valid) {
      if (this.projectId == 0) {
        this.apiService
          .postData("sales/project", data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            let Id = res.id;
            this.projectId = res.id;
            this.apiService
              .postDataMultipartRaw(
                "sales/project/updateDocument?id=" + Id,
                this.createFormData()
              )
              .subscribe((result) => {
                AlertComponent.showAlert(
                  this.dialog,
                  "",
                  "Your project details have been saved!"
                );
              });
          });
      } else {
        this.apiService
          .postData("sales/project/update?id=" + this.projectId, data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            let Id = res.id;
            this.projectId = res.id;
            this.apiService
              .postDataMultipartRaw(
                "sales/project/updateDocument?id=" + Id,
                this.createFormData()
              )
              .subscribe((result) => {
                AlertComponent.showAlert(
                  this.dialog,
                  "",
                  "Your project details have been updated!"
                );
              });
          });
      }
    }
  }

  private createFormData(): FormData {
    let formData: FormData = new FormData();
    if (this.bodyFormdata.has("projectLogo"))
      formData.append("projectLogo", this.bodyFormdata.get("projectLogo"));
    if (this.bodyFormdata.has("backgroundImage"))
      formData.append(
        "backgroundImage",
        this.bodyFormdata.get("backgroundImage")
      );
    if (this.bodyFormdata.has("developerLogo"))
      formData.append("developerLogo", this.bodyFormdata.get("developerLogo"));
    return formData;
  }

  createFormGroup() {
    return this.formBuilder.group({
      aboutDeveloper: ["", [Validators.required]],
      address: ["", [Validators.required]],
      address1: [""],
      city: ["", [Validators.required]],
      apartment: ["", [Validators.required]],
      area: ["", [Validators.required]],
      crmId: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      developedBy: ["", [Validators.required]],
      disclaimer: ["", [Validators.required]],
      leadExpiry: ["", [Validators.required]],
      offerStatus: ["", [Validators.required]],
      possessionDate: ["", [Validators.required]],
      status: ["", [Validators.required]],
      state: [""],
      projectDescription: ["", [Validators.required]],
      projectName: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      projectTitle: [
        "",
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      rate: ["", [Validators.required]],
      reraNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      reraWebsite: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
          ),
        ],
      ],
      websiteUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
          ),
        ],
      ],
      tower: ["", [Validators.required]],
      salesTeamEmail: ["", [Validators.required, Validators.email]],
      priority: ["", [Validators.required]],
      submitted: [""],
    });
  }
}
