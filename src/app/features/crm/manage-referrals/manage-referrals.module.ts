import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { SharedModule } from "../../../../app/shared/shared.module";
import { ManageReferralsComponent } from "./manage-referrals-list/manage-referrals-list.component";

import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [ManageReferralsComponent],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TableModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageReferralsComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageReferralsModule {}
