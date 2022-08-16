import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-slab-create",
  templateUrl: "./slab-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class SlabCreateComponent implements OnInit, OnDestroy {
  brokerageSlabTypes: any;
  brokerageTypes: any;
  brokerageSlabBase: string[];
  form: FormGroup;
  isUpdate: any;
  ladderTypes: any;
  ladder: any;
  ladderData: any;
  ladderType: any;
  ladderId: number;
  newSlabs: any;
  rangeTypes: any;
  slabForm: FormGroup;
  sampleJson: {}[];
  slabData: any;
  submitted: boolean;
  slabs: any = [];
  userTypes: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.ladderId = +params["id"] || 0;
    });
    this.route.queryParams.subscribe((params) => {
      this.isUpdate = params["isUpdate"];
    });
    this.form = this.createFormGroup();
    this.getBrokerageSlabTypes();
    this.getBrokerageTypes();
    this.getRangeTypes();
    if (this.ladderId != 0) this.getLadderType(this.ladderId);
    if (this.isUpdate) this.getSlabDetails(this.ladderId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSlabDetails(id): void {
    const inputData = {
      ladderId: id,
      pageNumber: 0,
      pageSize: 100000,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/brokerage-slab/by-ladder-id";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.slabData = res.content;
        this.addSlabsGroup(this.slabData);
      });
  }

  private getLadderType(id) {
    let url = "admin/ladder/";
    this.apiService
      .getData(url + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ladderType = res.type;
      });
  }

  public addSlabsGroup(slabData): void {
    slabData.forEach((slab) => {
      (<FormArray>this.form.get(["slabs"])).push(
        this.formBuilder.group({
          id: [slab.id],
          brokerageType: [slab.brokerageType, [Validators.required]],
          brokerageValue: [slab.brokerageValue, [Validators.required]],
          rangeType: [slab.rangeType],
          rangeStart: [slab.rangeStart],
          type: [slab.name, [Validators.required]],
        })
      );
    });
  }

  private getBrokerageSlabTypes(): void {
    let url = "no-auth/enum/brokerage-slab-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.brokerageSlabTypes = res.filter((item) => item !== "BASE");
        this.brokerageSlabBase = ["BASE"];
      });
  }

  private getBrokerageTypes(): void {
    let url = "no-auth/enum/brokerage-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.brokerageTypes = res;
        this.brokerageTypes.splice(-1); // added for removing gift,it can be removed in future//
      });
  }

  private getRangeTypes(): void {
    let url = "no-auth/enum/brokerage-slab-range-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.rangeTypes = res;
      });
  }

  public addNewSlabGroup(): void {
    const add = this.form.get("slabs") as FormArray;
    add.push(
      this.formBuilder.group({
        id: [""],
        brokerageType: ["", [Validators.required]],
        brokerageValue: ["", [Validators.required]],
        rangeType: [""],
        rangeStart: [""],
        type: [
          this.ladderType == "BASE" && add.value.length == 0 ? "BASE" : "",
          [Validators.required],
        ],
      })
    );
  }

  public deleteSlabGroup(index: number): void {
    const add = this.form.get("slabs") as FormArray;
    add.removeAt(index);
  }

  public onBack(): void {
    this.router.navigate(["/ladders"]);
  }

  private createFormGroup(): FormGroup {
    return this.formBuilder.group({
      slabs: this.formBuilder.array([]),
    });
  }

  public onFinish(): void {
    this.submitted = true;
    if (this.form.value.slabs.length > 0) {
      this.form.value.slabs.forEach((element, index) => {
        let data = {
          brokerageType: element.brokerageType,
          brokerageValue: element.brokerageValue,
          name: element.type,
          type: "SPECIAL",
        };
        if (element.rangeType !== "" && element.rangeStart !== "") {
          data["rangeType"] = element.rangeType;
          data["rangeStart"] = element.rangeStart;
        }
        if (element.id) {
          let url = "admin/brokerage-slab/update/";
          this.apiService
            .postData(url + element.id, data)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.showMessage(index, "Update");
            });
        } else {
          let url = "admin/brokerage-slab?";
          this.apiService
            .postData(url + "ladderId=" + this.ladderId, data)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
              this.showMessage(index, "Create");
            });
        }
      });
    } else {
      AlertComponent.showAlert(
        this.dialog,
        "",
        "Please create atleast one Slab!"
      ).subscribe((result) => {});
    }
  }

  private showMessage(index, type) {
    AlertComponent.showAlert(
      this.dialog,
      "",
      "Brokerage Slab " + (index + 1) + " " + type + "d Successfully!"
    ).subscribe((result) => {
      if (this.form.value.slabs.length == index + 1) this.onBack();
    });
  }
}
