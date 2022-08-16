import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";

import { RemoteApisService } from "../../commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-add-tower",
  templateUrl: "./add-tower.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AddTowerComponent implements OnInit, OnDestroy {
  addTowerForm: FormGroup;
  headingText: string = "Add Tower";
  submitted: boolean = false;
  subText: string = "Add Tower Details";
  phaseList: any[] = [
    { id: 1, value: "Phase 1" },
    { id: 2, value: "Phase 2" },
  ];

  private destroy$: Subject<void> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: RemoteApisService,
    public dialogRef: MatDialogRef<AddTowerComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formValidation();
    if (this.data.type == 2) {
      this.headingText = "Edit Tower";
      this.geTowerData(this.data.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.addTowerForm.controls;
  }

  formValidation() {
    this.addTowerForm = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.minLength(2)],
        Validators.maxLength(125),
        Validators.pattern("[a-zA-Z0-9. ]+"),
      ],
      phase: ["", [Validators.required]],
      // dialCode:["",[Validators.required]],
      reraNumber: ["", [Validators.required, Validators.maxLength(125)]],
    });
  }

  geTowerData(id) {
    let formData = this.data.content;
    this.addTowerForm.controls.phase.setValue(formData.phase);
    this.addTowerForm.controls.reraNumber.setValue(formData.reraNumber);
    this.addTowerForm.controls.name.setValue(formData.name);
  }

  onCancel() {
    this.dialogRef.close({ result: false });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.addTowerForm.valid) return;

    let inputData = {
      name: this.addTowerForm.controls.name.value,
      phase: this.addTowerForm.controls.phase.value,
      reraNumber: this.addTowerForm.controls.reraNumber.value,
    };
    /*   let url =
      this.data.type === 1
        ? "admin/sales-manager"
        : "admin/sales-manager/update/" + this.data.id; */
    /*    this.apiService
      .postData(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "Tower saved successfully!"
        ).subscribe((result) => {
          this.dialogRef.close({ result: true });
        });
      }); */
  }
}
