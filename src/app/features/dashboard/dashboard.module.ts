import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../app/shared/shared.module";

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { DashBoardComponent } from "./dashboard-list/dashboard.component";

@NgModule({
  declarations: [DashBoardComponent],
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
        component: DashBoardComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class DashBoardModule {}
