import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";

import { AlertComponent } from "../../../../../dialogs/alert/alert.component";
import { RemoteApisService } from "../../../../../commonservice/remote-apis.service";

@Component({
  selector: "app-system-notification-create",
  templateUrl: "./system-notification-create.component.html",
  styleUrls: ["./system-notification-create.component.css"],
})
export class SystemNotificationCreateComponent implements OnInit {
  addForm: FormGroup;
  enabledList: { Value: boolean; Text: string; selected: boolean }[];
  typeList: { Value: string; Text: string; selected: boolean }[];

  @Input() data;

  @Output() newItemEvent = new EventEmitter<string>();

  constructor(
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.typeList = [
      { Value: "EMAIL", Text: "Email", selected: true },
      { Value: "SMS", Text: "SMS", selected: false },
      { Value: "PUSH", Text: "Push", selected: false },
      // { Value: "Watsapp", Text: "Watsapp", selected: false },
    ];
    this.enabledList = [
      { Value: true, Text: "Yes", selected: true },
      { Value: false, Text: "No", selected: false },
    ];

    this.addForm = this.createFormGroup();
    this.addForm.patchValue(this.data);
  }

  createFormGroup() {
    return this.formBuilder.group({
      id: [""],
      subject: ["", [Validators.required]],
      message: ["", [Validators.required]],
      type: ["", [Validators.required]],
      enabled: ["", [Validators.required]],
      recurring: ["", [Validators.required]],
      period: [""],
      submitted: [""],
    });
  }

  public onClose(): void {
    this.newItemEvent.emit("false");
  }

  public addDetails(): void {
    this.addForm.value.submitted = 1;
    if (this.addForm.valid) {
      let data = {
        id: this.addForm.value.id,
        subject: this.addForm.value.subject,
        message: this.addForm.value.message,
        type: this.addForm.value.type,
        enabled: this.addForm.value.enabled,
        recurring: this.addForm.value.recurring,
        period: this.addForm.value.period,
        triggerPoint: this.data.triggerPoint,
        templateId: this.data.templateId,
      };
      let url = "admin/notificationMessage";
      this.apiService
        .postData(url + "?id=" + this.addForm.value.id, data)
        .subscribe((res) => {
          AlertComponent.showAlert(
            this.dialog,
            "",
            "System Notification Updated Successfully!"
          ).subscribe((result) => {
            this.onClose();
          });
        });
    }
  }
}
