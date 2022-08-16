import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../commonservice/remote-apis.service";
import { AlertComponent } from "../../dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-add-amenities",
  templateUrl: "./add-amenities.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AddAmenitiesComponent implements OnInit, OnDestroy {
  addAmenitiesForm: FormGroup;
  amenitiesList: any = [];
  defAmenities = [];
  headingText: string = "Add Amenities";
  submitted: boolean = false;
  showInput: boolean = false;
  subText: string = "Create new Amenities";

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAmenitiesComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDefaultAmenities();
    if (this.data.type == 2) {
      this.headingText = "Edit Amenities";
      this.showInput = true;
      this.setData(this.data.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.addAmenitiesForm.controls;
  }

  createForm(): void {
    this.addAmenitiesForm = this.fb.group({
      title: ["", [Validators.required]],
      input: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern("[a-zA-Z0-9. ]+"),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern("[a-zA-Z0-9. ]+"),
        ],
      ],
    });
  }

  getDefaultAmenities(): void {
    this.apiService
      .getData("user/projectAmenity/defaults")
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        var defData = resp;
        let result = defData.filter(
          (o1) => !this.amenitiesList.some((o2) => o1 === o2.title)
        );
        for (let res of result) {
          this.defAmenities.push({ id: 1, title: res });
        }
        this.defAmenities.push({ id: 1, title: "Other" });
      });
  }

  setData(id): void {
    let formData = this.data.content;
    this.addAmenitiesForm.controls.title.setValue(formData.title);
    this.addAmenitiesForm.controls.input.setValue(formData.title);
    this.addAmenitiesForm.controls["title"].clearValidators();
    this.addAmenitiesForm.controls["title"].updateValueAndValidity();
    this.addAmenitiesForm.controls.description.setValue(formData.description);
  }

  onCancel(): void {
    this.dialogRef.close({ result: false });
  }

  onAmenityChange(e): void {
    if (e.value === "Other") {
      this.showInput = true;
      this.addAmenitiesForm.controls["input"].setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.pattern("[a-zA-Z0-9. ]+"),
      ]);
      this.addAmenitiesForm.controls["input"].updateValueAndValidity();
    } else {
      this.showInput = false;
      this.addAmenitiesForm.controls["input"].clearValidators();
      this.addAmenitiesForm.controls["input"].updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.addAmenitiesForm.valid) return;

    let title =
      this.showInput == true
        ? this.addAmenitiesForm.controls.input.value
        : this.addAmenitiesForm.controls.title.value;
    let inputData = {
      title: title,
      description: this.addAmenitiesForm.controls.description.value,
    };
    let url =
      this.data.type === 1
        ? "sales/projectAmenity?projectId=" + this.data.projectId
        : "sales/projectAmenity/update/" + this.data.id;
    this.apiService
      .postData(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Amenities saved successfully!"
        ).subscribe((result) => {
          this.dialogRef.close({ result: true });
        });
      });
  }
}
