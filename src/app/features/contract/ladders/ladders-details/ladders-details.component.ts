import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";
import { UserTypeCreateComponent } from "../user-type-create/user-type-create.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-ladder-details",
  templateUrl: "./ladders-details.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class LadderDetailsComponent implements OnInit, OnDestroy {
  cpGroupList: any;
  bookingList: any;
  editForm: FormGroup;
  ladderId: number;
  ladderData: any;
  ladderAggregateData: any;
  offsetdb: number;
  offset: number = 0;
  projectList: any;
  recordsPerPage: number = 10;
  selectedProjects: any;
  selectedtab: string;
  slabData: any;
  totalRecords: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.selectedtab = "tab1";
    this.getCpGroups();
    this.getprojectList();
    this.editForm = this.createFormGroup();
    this.route.params.subscribe((params) => {
      this.ladderId = +params["id"] || 0;
      this.getLadderDetails(this.ladderId);
      this.getSlabDetails(this.ladderId);
      this.getAllProjects(this.ladderId);
      this.getLadderAggregate(this.ladderId);
      this.getBookingDetails(this.offset);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getLadderAggregate(id): void {
    const inputData = {
      ladderId: id,
    };
    let url = "finance/booking/ladder-brokerage";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ladderAggregateData = res;
      });
  }

  public addSlabsGroup(slabData): void {
    slabData.forEach((slab) => {
      (<FormArray>this.editForm.get(["slabs"])).push(
        this.formBuilder.group({
          id: [slab.id],
          brokerageType: [slab.brokerageType, [Validators.required]],
          brokerageValue: [slab.brokerageValue, [Validators.required]],
          rangeType: [slab.rangeType, [Validators.required]],
          rangeStart: [slab.rangeStart, [Validators.required]],
          type: [slab.name, [Validators.required]],
        })
      );
    });
  }

  public addUserType(): void {
    let dialogRef = this.dialog.open(UserTypeCreateComponent, {
      width: "600px",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      active: ["true"],
      cutOffDate: [""],
      description: [""],
      endDate: [""],
      groupId: [],
      name: [""],
      projectIds: [""],
      retrospective: ["true"],
      startDate: [""],
      submitted: [""],
      slabs: this.formBuilder.array([]),
      type: ["BASE"],
      userType: ["CHANNEL_PARTNER"],
    });
  }

  public editDetails(): void {
    this.router.navigate(["/ladders/create", this.ladderId]);
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

  private getprojectList(): void {
    let url = "user/project/names";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.projectList = res;
      });
  }

  private getLadderDetails(id): void {
    let url = "admin/ladder/";
    this.apiService
      .getData(url + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ladderData = res;
        this.editForm.patchValue(this.ladderData);
        this.editForm.patchValue({
          groupId: this.ladderData.group.id,
          startDate: new Date(this.ladderData.startDate),
          endDate: new Date(this.ladderData.endDate),
          cutOffDate: new Date(this.ladderData.cutOffDate),
        });
      });
  }

  private getBookingDetails(page): void {
    let body = {
      ladderId: this.ladderId,
      pageNumber: page,
      pageSize: this.recordsPerPage,
      sortBy: "",
      isAscending: true,
    };
    this.apiService
      .getDataInputValue("finance/booking/by-ladder-id", body)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.bookingList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  public paginatedSearch(e): void {
    this.offsetdb = e.first / this.recordsPerPage;
    if (this.offsetdb > 0) {
      this.getBookingDetails(this.offsetdb);
    } else {
      let init = 0;
      this.getBookingDetails(init);
    }
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
      .subscribe((res) => {
        this.selectedProjects = this.projectList.filter((f) =>
          res.content.some((item) => item.id === f.id)
        );
        let projIds = [];
        this.selectedProjects.forEach((element) => {
          projIds.push(element.id);
        });
        this.editForm.patchValue({ projectIds: projIds });
      });
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

  public onDelete(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the ladder?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("admin/ladder/delete/" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Ladder has been deleted"
            ).subscribe((result) => {});
            this.router.navigate(["/ladders"]);
          });
      }
    });
  }

  public onEdit(id): void {
    this.router.navigate(["/ladders/create", id]);
  }
}
