import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { LadderListComponent } from "./ladders-list/ladders-list.component";
import { LadderDetailsComponent } from "./ladders-details/ladders-details.component";
import { LadderCreateComponent } from "./ladders-create/ladders-create.component";
import { SlabCreateComponent } from "./slab-create/slab-create.component";
import { UserTypeCreateComponent } from "./user-type-create/user-type-create.component";

import { SharedModule } from "../../../../app/shared/shared.module";

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  declarations: [
    LadderListComponent,
    LadderDetailsComponent,
    LadderCreateComponent,
    SlabCreateComponent,
    UserTypeCreateComponent,
  ],
  imports: [
    CommonModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    CheckboxModule,
    InputNumberModule,
    MultiSelectModule,
    SharedModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: LadderListComponent,
      },
      {
        path: "details/:id",
        component: LadderDetailsComponent,
        data: { breadcrumb: "Ladder Details" },
      },
      {
        path: "create/:id",
        component: LadderCreateComponent,
        data: { breadcrumb: "Ladder Create" },
      },
      {
        path: "slabCreate/:id",
        component: SlabCreateComponent,
        data: { breadcrumb: "Slab Create" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class LadderModule {}
