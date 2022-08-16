import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { Inject } from "@angular/core";

@Component({
  selector: "app-add-groups",
  templateUrl: "./add-groups.component.html",
  styleUrls: ["./add-groups.component.css"],
})
export class AddGroupsComponent implements OnInit {
  groupId: any;
  textData: string;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: RemoteApisService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddGroupsComponent>
  ) {}

  addGroupForm: FormGroup;
  submitted = false;

  ngOnInit() {
    this.addGroupForm = this.formBuilder.group({
      groupName: [
        "",
        [Validators.required, Validators.pattern("[a-zA-Z0-9. ]*")],
      ],
    });
    this.groupId = this.data.groupId;
    this.addGroupForm.controls["groupName"].setValue(this.data.groupName);
    if (this.groupId == 0) {
      this.textData = "Add Group";
    } else {
      this.textData = "Edit Group";
    }
  }

  get f() {
    return this.addGroupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.addGroupForm.invalid) return;
    if (!this.groupId) {
      this.groupId = 0;
    }
    let body = {
      id: this.groupId,
      name: this.f.groupName.value,
    };

    this.apiService
      .postData("sales/projectGroup?projectId=" + this.data.projectId, body)
      .subscribe((res) => {
        this.dialogRef.close();
      });
  }
  close() {
    this.dialogRef.close();
  }
}
