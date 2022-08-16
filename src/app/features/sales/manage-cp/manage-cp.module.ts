import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatExpansionModule } from "@angular/material/expansion";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppUsageComponent } from "./app-usage/app-usage.component";
import { CommonPipesModule } from "../../../commonPipes/commonPipes.module";
import { CpProfileComponent } from "./cp-profile/cp-profile.component";
import { DealsComponent } from "./deals/deals.component";
import { DocumentsComponent } from "./documents/documents.component";
import { ManageCPComponent } from "./manage-cp-list/manage-cp-list.component";
import { TeamMemberComponent } from "./team-member/team-member.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [
    AppUsageComponent,
    CpProfileComponent,
    DealsComponent,
    DocumentsComponent,
    ManageCPComponent,
    TeamMemberComponent,
  ],
  imports: [
    CommonModule,
    CommonPipesModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageCPComponent,
      },
      {
        path: "cp-profile/:id",
        component: CpProfileComponent,
        data: { breadcrumb: "CP Profile" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageCPModule {}
