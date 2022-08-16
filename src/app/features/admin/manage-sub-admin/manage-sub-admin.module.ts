import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ManageSubAdminComponent } from "./manage-sub-admin-list/manage-sub-admin-list.component";
import { DialogModule } from "src/app/dialogs/dialog.module";

@NgModule({
  declarations: [ManageSubAdminComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageSubAdminComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageSubAdminModule {}
