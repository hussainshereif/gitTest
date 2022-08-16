import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AddMemberComponent } from "../add-member/add-member.component";
import { AlertComponent } from "../../../../../app/dialogs/alert/alert.component";
import { DeleteConfirmationComponent } from "../../../../../app/shared/delete-confirmation/delete-confirmation.component";
import { RemoteApisService } from "../../../../../app/commonservice/remote-apis.service";

@Component({
  selector: "app-cp-group-details",
  templateUrl: "./cp-group-details.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class CPGroupDetailsComponent implements OnInit, OnDestroy {
  cpGroupId: number;
  cpData: any;
  cpList: any;
  editForm: FormGroup;
  groupMemberData: any;
  groupAggregateData: any;
  isEdit: boolean = false;
  ladderData: any;
  priority = [1, 2, 3, 4, 6, 7];
  submitted: boolean;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.editForm = this.createFormGroup();
    this.route.queryParams.subscribe((params) => {
      this.isEdit = params["isEdit"] === "true" ? true : false;
    });
    this.route.params.subscribe((params) => {
      this.cpGroupId = +params["id"] || 0;
      this.getGroupDetails(this.cpGroupId);
      this.getLadderByGroupId(this.cpGroupId);
      this.getUsersByGroupId(this.cpGroupId);
      this.getGroupAggregate(this.cpGroupId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getGroupAggregate(id): void {
    const inputData = {
      groupId: id,
    };
    let url = "finance/booking/group-brokerage";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.groupAggregateData = res;
      });
  }

  private getLadderByGroupId(id): void {
    const inputData = {
      groupId: id,
      pageNumber: 0,
      pageSize: 100000,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/ladder/by-group-id";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.ladderData = res.content;
      });
  }

  private getUsersByGroupId(id): void {
    const inputData = {
      groupId: id,
      pageNumber: 0,
      pageSize: 100000,
      sortBy: "",
      isAscending: true,
    };
    let url = "admin/user/by-group-id";
    this.apiService
      .getDataInputValue(url, inputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.groupMemberData = res.content;
      });
  }

  private getGroupDetails(id): void {
    let url = "admin/group/";
    this.apiService
      .getData(url + id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpData = res;
        this.editForm.patchValue(res);
      });
  }

  public onDelete(id): void {
    DeleteConfirmationComponent.showConfirmation(
      this.dialog,
      "Confirmation",
      "Are you sure want to delete the Cp Group?",
      "Delete",
      "Cancel"
    ).subscribe((result) => {
      if (result.result) {
        this.apiService
          .postData("admin/group/delete/" + id, "")
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Group has been deleted"
            ).subscribe((result) => {});
            this.onBack();
          });
      }
    });
  }

  public onEdit(): void {
    this.isEdit = true;
  }

  public editDetails(): void {
    this.submitted = true;
    let data = {
      id: this.editForm.value.id,
      name: this.editForm.value.name,
      priority: this.editForm.value.priority,
      description: this.editForm.value.name,
    };
    let url = "admin/group/update/";
    this.apiService
      .postData(url + this.editForm.value.id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "CP Group Updated Successfully!"
        ).subscribe((result) => {
          this.isEdit = false;
          this.getGroupDetails(this.cpGroupId);
        });
      });
  }

  public onBack(): void {
    this.router.navigate(["/cp-group"]);
  }

  public onAddMember(): void {
    let dialogRef = this.dialog.open(AddMemberComponent, {
      width: "400px",
      data: {},
      panelClass: "custom-dialog-container",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addCpMember(result);
      }
    });
  }

  public addCpMember(ids): void {
    let data = {
      userIds: ids.toString(),
    };
    let url = "admin/group/add-users/";
    this.apiService
      .postData(
        url + this.editForm.value.id + "?userIds=" + ids.toString(),
        data
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "CP Member Added Successfully!"
        ).subscribe((result) => {
          this.getGroupDetails(this.cpGroupId);
          this.getUsersByGroupId(this.cpGroupId);
        });
      });
  }

  public onDeleteMember(id): void {
    let data = {
      userIds: id.toString(),
    };
    let url = "admin/group/remove-users/";
    this.apiService
      .postData(
        url + this.editForm.value.id + "?userIds=" + id.toString(),
        data
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        AlertComponent.showAlert(
          this.dialog,
          "",
          "CP Member Removed Successfully!"
        ).subscribe((result) => {
          this.getUsersByGroupId(this.cpGroupId);
        });
      });
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      name: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      description: [""],
      usersSize: [""],
    });
  }
}
