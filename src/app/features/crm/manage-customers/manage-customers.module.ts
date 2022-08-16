import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";

import { SharedModule } from "../../../../app/shared/shared.module";
import { ManageCustomersComponent } from "./manage-customers-list/manage-customers-list.component";

import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [ManageCustomersComponent],
  imports: [
    CommonModule,
    CalendarModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    NgbModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TableModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageCustomersComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageCustomersModule {}
