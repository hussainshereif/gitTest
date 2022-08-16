import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AddMemberComponent } from "./add-member/add-member.component";
import { CPGroupListComponent } from "./cp-group-list/cp-group-list.component";
import { CPGroupCreateComponent } from "./cp-group-create/cp-group-create.component";
import { CPGroupDetailsComponent } from "./cp-group-details/cp-group-details.component";
import { SharedModule } from "../../../../app/shared/shared.module";

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  declarations: [
    CPGroupListComponent,
    CPGroupCreateComponent,
    CPGroupDetailsComponent,
    AddMemberComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    CheckboxModule,
    InputNumberModule,
    MultiSelectModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: CPGroupListComponent,
      },
      {
        path: "details/:id",
        component: CPGroupDetailsComponent,
        data: { breadcrumb: "CP Group Details" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class CPGroupModule {}
