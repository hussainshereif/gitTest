import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";

import { CommonPipesModule } from "../../../commonPipes/commonPipes.module";
import { ManageSmDetailsComponent } from "./manage-sm-details/manage-sm-details.component";
import { ManageSmListComponent } from "./manage-sm-list/manage-sm-list.component";
import { ProjectCpComponent } from "./project-cp/project-cp.component";
import { ProjectsComponent } from "./projects/projects.component";
import { TeamMembersComponent } from "./team-members/team-members.component";
import { SharedModule } from "../../../shared/shared.module";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [
    ManageSmDetailsComponent,
    ManageSmListComponent,
    ProjectCpComponent,
    ProjectsComponent,
    TeamMembersComponent,
  ],
  imports: [
    CommonModule,
    CommonPipesModule,
    NgbModule,
    SharedModule,
    TableModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageSmListComponent,
      },
      {
        path: "manage-sm-details",
        component: ManageSmDetailsComponent,
        data: { breadcrumb: "Manage SM Details" },
      },
    ]),
  ],
})
export class ManageSmModule {}
