import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { HelperService } from "../../../../../app/commonservice/common/helper.service";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { AppToasterComponent } from "../../../../../app/shared/app-toaster/app-toaster.component";
import { UserTypeCreateComponent } from "../user-type-create/user-type-create.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-ladder-create",
  templateUrl: "./ladders-create.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class LadderCreateComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  cpGroupList: any;  
  isEdit: boolean;
  ladderId: number;
  ladderData: any;
  ladderTypes: any;
  projectList: any;
  selectedProjects: any[];
  submitted: boolean = false;
  userTypes: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private helperService: HelperService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.addForm = this.createFormGroup();
    this.getCpGroups();
    this.getprojectList();
    this.getladderTypes();
    this.route.params.subscribe((params) => {
      this.ladderId = +params["id"] || 0;
      if (this.ladderId != 0) this.getLadderDetails(this.ladderId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getLadderDetails(id): void {
    let url = "admin/ladder/";
    this.apiService
      .getData(url + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isEdit = true;
        this.ladderData = res;
        this.getAllProjects(this.ladderId);
        this.addForm.patchValue(this.ladderData);
        this.addForm.patchValue({
          groupId: this.ladderData.group.id,
          startDate: new Date(this.ladderData.startDate),
          endDate: new Date(this.ladderData.endDate),
          cutOffDate: new Date(this.ladderData.cutOffDate),
        });
      });
  }

  private getladderTypes(): void {
    let url = "no-auth/enum/ladder-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ladderTypes = res;
      });
  }

  private getCpGroups(): void {
    let url = "admin/group";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpGroupList = res.content;
      });
  }

  private getAllProjects(id): void {
    const inputData = {
      ladderId: id,
      pageNumber: 0,
      pageSize: 100000,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/project/by-ladder-id";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.selectedProjects = this.projectList.filter((f) =>
          res.content.some((item) => item.id === f.id)
        );
        let projIds = [];
        this.selectedProjects.forEach((element) => {
          projIds.push(element.id);
        });
        this.addForm.patchValue({ projectIds: projIds });
      });
  }

  private getprojectList(): void {
    let url = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectList = res;
      });
  }

  public onCreate(id, isUpdate): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { isUpdate: isUpdate },
    };
    this.router.navigate(["/ladders/slabCreate", id], navigationExtras);
  }

  public onBack(): void {
    this.router.navigate(["/ladders"]);
  }

  public addUserType(): void {
    if (!this.isEdit) {
      let dialogRef = this.dialog.open(UserTypeCreateComponent, {
        width: "450px",
        data: { userType: this.addForm.value.userType },
        panelClass: "custom-dialog-container",
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          this.addForm.patchValue({ userType: result });
        });
    }
  }

  public onProjectSelect(e): void {
    this.selectedProjects = [];
    this.addForm.value.projectIds.forEach((element) => {
      var name = this.projectList.find((val) => val.id == element);
      this.selectedProjects.push(name);
    });
  }

  public addDetails(): void {
    this.submitted = true;
    if (this.addForm.valid) {
      let data = {
        active: this.addForm.value.active,
        cutOffDate: this.helperService.formatDate(
          this.addForm.value.cutOffDate,
          "yyyy-MM-dd"
        ),
        description: this.addForm.value.description,
        endDate: this.helperService.formatDate(
          this.addForm.value.endDate,
          "yyyy-MM-dd"
        ),
        name: this.addForm.value.name,
        projectIds: this.addForm.value.projectIds,
        retrospective: this.addForm.value.retrospective,
        startDate: this.helperService.formatDate(
          this.addForm.value.startDate,
          "yyyy-MM-dd"
        ),
        type: this.addForm.value.type,
        userType: this.addForm.value.userType,
      };
      if (this.addForm.value.id) {
        data["id"] = this.addForm.value.id;
        data["group"] = { id: this.addForm.value.groupId };
        let url = "admin/ladder/update/";
        this.apiService
          .postData(url + this.addForm.value.id, data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Ladder Updated Successfully!"
            ).subscribe((result) => {
              this.onCreate(res.id, true);
            });
          });
      } else {
        let url = "admin/ladder?";
        this.apiService
          .postData(url + "groupId=" + this.addForm.value.groupId, data)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Ladder Created Successfully!"
            ).subscribe((result) => {
              this.onCreate(res.id, false);
            });
          });
      }
    } else {
      AppToasterComponent.showToaster(
        this.messageService,
        "error",
        "Error",
        "Please fill all Mandatory Fields!"
      );
    }
  }

  get f() {
    return this.addForm.controls;
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      active: ["true", [Validators.required]],
      cutOffDate: ["", [Validators.required]],
      description: [
        "",
        [
          Validators.required,
          Validators.maxLength(999),
          Validators.pattern("[a-zA-Z0-9., ]+"),
        ],
      ],
      endDate: ["", [Validators.required]],
      groupId: ["", [Validators.required]],
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z0-9., ]+"),
        ],
      ],
      projectIds: ["", [Validators.required]],
      type: ["BASE", [Validators.required]],
      retrospective: ["true"],
      startDate: ["", [Validators.required]],
      userType: ["CHANNEL_PARTNER", [Validators.required]],
    });
  }
}
