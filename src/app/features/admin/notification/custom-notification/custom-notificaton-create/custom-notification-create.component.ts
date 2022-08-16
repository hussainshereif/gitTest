import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { RemoteApisService } from "../../../../../../app/commonservice/remote-apis.service";
import { AlertComponent } from "../../../../../../app/dialogs/alert/alert.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
@Component({
  selector: "app-custom-notification-create",
  templateUrl: "./custom-notification-create.component.html",
  styleUrls: ["./custom-notification-create.component.css"],
})
export class CustomNotificationCreateComponent implements OnInit, OnDestroy {
  @Input() data;

  @Output() newItemEvent = new EventEmitter<string>();

  addForm: FormGroup;
  cpStatusList: any;
  cityList: any;
  deviceList: { Value: string; Text: string; selected: boolean }[];
  dropdownSettings: {
    idField: string;
    textField: string;
    enableCheckAll: boolean;
    selectAllText: string;
    unSelectAllText: string;
  };
  offset: number = 0;
  projectList: any = [];
  selectedProject: any = [];
  showDropdown: boolean = true;
  showProject: boolean;
  states: any;
  typeList: { Value: string; Text: string; selected: boolean }[];
  userTypes: any;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.typeList = [
      // { Text: "Email", Value: "EMAIL", selected: true },
      // { Text: "SMS", Value: "SMS", selected: false },
      { Text: "Push", Value: "PUSH", selected: true },
    ];
    this.deviceList = [
      { Text: "Android", Value: "Android", selected: true },
      { Text: "Iphone", Value: "IOS", selected: false },
      { Text: "Both", Value: "IOS_Android", selected: false },
    ];
    this.dropdownSettings = {
      idField: "id",
      textField: "projectName",
      enableCheckAll: true,
      selectAllText: "Select All Items From List",
      unSelectAllText: "UnSelect All Items From List",
    };
    this.states = this.apiService.stateList.Countries[0].States;
    this.addForm = this.createFormGroup();
    this.getCpStatus();
    this.getUserType();
    this.getProjectList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      city: [""],
      cpStatus: [""],
      deviceType: ["", [Validators.required]],
      message: ["", [Validators.required]],
      microMarket: [""],
      notificationType: ["PUSH", [Validators.required]],
      projectIds: [[]],
      state: [""],
      subRegion: [""],
      submitted: [""],
      title: [
        "",
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("[a-zA-Z0-9. ]+"),
        ],
      ],
      userType: ["", [Validators.required]],
    });
  }

  public getCpStatus(): void {
    let url = "no-auth/enum/cp-statuses";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpStatusList = res;
      });
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

  private getUserType(): void {
    let url = "no-auth/enum/user-types";
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.userTypes = res;
      });
  }

  public onClose(): void {
    this.newItemEvent.emit("false");
    this.addForm.reset();
  }

  public onChangeState(e): void {
    let index = this.states.findIndex((val) => val.StateName === e);
    this.cityList = this.states[index].Cities;
  }

  onChangeUserType(type): void {
    this.showDropdown = type === "CHANNEL_PARTNER" ? true : false;
    this.showProject = type === "CUSTOMER" ? true : false;
  }

  public onTypeChange(type): void {
    if (type === "PUSH") {
      this.addForm.get("deviceType").setValidators([Validators.required]);
    } else {
      this.addForm.get("deviceType").clearValidators();
    }
    this.addForm.get("deviceType").updateValueAndValidity();
  }

  public addDetails(): void {
    this.addForm.value.submitted = 1;
    if (this.addForm.valid) {
      let body = new URLSearchParams();
      if (this.addForm.value.id) body.append("id", this.addForm.value.id);
      body.append("title", this.addForm.value.title);
      body.append("message", this.addForm.value.message);
      body.append("notificationType", this.addForm.value.notificationType);
      body.append(
        "deviceType",
        this.addForm.value.notificationType === "EMAIL"
          ? ""
          : this.addForm.value.deviceType
      );
      if (this.addForm.value.userType) {
        body.append("userType", this.addForm.value.userType);
      }
      if (this.showProject && this.addForm.value.projectIds) {
        let resultArray = this.addForm.value.projectIds.map(function (a) {
          return a["id"];
        });
        body.append("projectIds", resultArray);
      }
      if (this.addForm.value.cpStatus && this.showDropdown)
        body.append("cpStatus", this.addForm.value.cpStatus);
      if (this.addForm.value.state && this.showDropdown)
        body.append("state", this.addForm.value.state);
      if (this.addForm.value.city && this.showDropdown)
        body.append("city", this.addForm.value.city);
      if (this.addForm.value.subRegion && this.showDropdown)
        body.append("subRegion", this.addForm.value.subRegion);
      if (this.addForm.value.microMarket && this.showDropdown)
        body.append("microMarket", this.addForm.value.microMarket);
      if (this.addForm.value.id && this.addForm.value.id !== 0) {
        let url = "sales/notification/cpCustomNotification";
        this.apiService
          .postDataNotJSON(
            url + "?id=" + this.addForm.value.id,
            body.toString()
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Custom Notification updated Successfully!"
            ).subscribe((result) => {
              this.onClose();
            });
          });
      } else {
        let url = "sales/notification/cpCustomNotification";
        this.apiService
          .postDataNotJSON(url, body.toString())
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Custom Notification added Successfully!"
            ).subscribe((result) => {
              this.onClose();
            });
          });
      }
    }
  }
}
