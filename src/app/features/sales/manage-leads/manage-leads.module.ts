import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../../app/shared/shared.module";
import { ManageLeadsComponent } from "./manage-leads-list/manage-leads-list.component";

import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [ManageLeadsComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    MultiSelectModule,
    NgbModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TableModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageLeadsComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageLeadsModule {}
