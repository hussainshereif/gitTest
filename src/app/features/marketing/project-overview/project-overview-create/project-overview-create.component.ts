import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { SuccessConfirmationComponent } from "../../../../../app/shared/success-alert/success-alert.component";

@Component({
  selector: "app-projects-overview-create",
  templateUrl: "./project-overview-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ProjectsOverviewCreateComponent implements OnInit {
  addForm: FormGroup;
  submitted: boolean;

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

  constructor(
    private apiService: RemoteApisService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addForm = this.createFormGroup();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public addDetails(): void {
    const data = {
      address: this.addForm.value.address1 + this.addForm.value.address2,
      city: this.addForm.value.city + "," + this.addForm.value.state,
      apartment: this.addForm.value.apartment.toString(),
      crmId: this.addForm.value.crmId,
      disclaimer: this.addForm.value.disclaimer,
      projectDescription: this.addForm.value.description,
      projectName: this.addForm.value.projectName,
      projectTitle: this.addForm.value.title,
      rate: this.addForm.value.rate.toString(),
      reraNumber: this.addForm.value.reraNo,
      salesTeamEmail: this.addForm.value.salesTeamEmail,
    };
    this.submitted = true;
    if (this.addForm.valid) {
      this.apiService
        .postData("sales/project", data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          SuccessConfirmationComponent.showConfirmation(
            this.dialog,
            "Successful",
            "The Project added successfully!",
            "Add more details",
            "Back to projects"
          ).subscribe((result) => {
            if (result.result) {
              this.router.navigate([
                "/project-overview/project-details",
                res.id,
              ]);
            } else {
              this.router.navigate(["/project-overview"]);
            }
          });
        });
    }
  }

  public onBack() {
    this.router.navigate(["/project-overview"]);
  }

  createFormGroup() {
    return this.formBuilder.group({
      title: [
        "",
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      crmId: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      projectName: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      description: ["", [Validators.required]],
      apartment: ["", [Validators.required]],
      address1: ["", [Validators.required]],
      address2: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      reraNo: [
        "",
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$"),
        ],
      ],
      disclaimer: ["", [Validators.required]],
      rate: ["", [Validators.required]],
      salesTeamEmail: ["", [Validators.required, Validators.email]],
    });
  }
}
