import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { DialogModule } from "../../../../app/dialogs/dialog.module";
import { SharedModule } from "./../../../shared/shared.module";
import { AmenitiesComponent } from "./amenities/amenities.component";
import { BaseBrokerageComponent } from "./base-brokerage/base-brokerage.component";
import { DownloadsComponent } from "./downloads/downloads.component";
import { CollateralViewComponent } from "./downloads/collateral-view/collateral-view.component";
import { CollateralCreateComponent } from "./downloads/collateral-create/collateral-create.component";
import { TemplateSelectComponent } from "./downloads/template-select/template-select.component";
import { FaqComponent } from "./faq/faq.component";
import { GroupsComponent } from "./groups/groups.component";
import { IncentiveViewComponent } from "./incentives/incentive-view/incentive-view.component";
import { IncentivesListComponent } from "./incentives/incentives-list.component";
import { IncentiveCreateComponent } from "./incentives/incentive-create/incentive-create.component";
import { LocationsComponent } from "./locations/locations.component";
import { MrpComponent } from "./mrp/mrp.component";
import { GalleryListComponent } from "./project-gallery/gallery-list.component";
import { GalleryCreateComponent } from "./project-gallery/project-gallery-create/project-gallery-create.component";
import { GalleryViewComponent } from "./project-gallery/project-gallery-view/project-gallery-view.component";
import { ProjectsOverviewComponent } from "./project-overview-list/project-overview-list.component";
import { ProjectsOverviewCreateComponent } from "./project-overview-create/project-overview-create.component";
import { ProjectsOverviewDetailsComponent } from "./project-overview-details/project-overview-details.component";
import { ProjectsOverviewEditComponent } from "./project-overview-edit/project-overview-edit.component";
import { SchemeCreateComponent } from "./scheme/scheme-create/scheme-create.component";
import { SchemeViewComponent } from "./scheme/scheme-view/scheme-view.component";
import { SchemeListComponent } from "./scheme/scheme-list.component";
import { TowerComponent } from "./tower/tower.component";

import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { InputNumberModule } from "primeng/inputnumber";
import { RadioButtonModule } from "primeng/radiobutton";
import { AutoCompleteModule } from "primeng/autocomplete";

@NgModule({
  declarations: [
    AmenitiesComponent,
    BaseBrokerageComponent,
    CollateralViewComponent,
    CollateralCreateComponent,
    DownloadsComponent,
    FaqComponent,
    GroupsComponent,
    GalleryListComponent,
    GalleryCreateComponent,
    GalleryViewComponent,
    LocationsComponent,
    MrpComponent,
    ProjectsOverviewComponent,
    ProjectsOverviewCreateComponent,
    ProjectsOverviewEditComponent,
    ProjectsOverviewDetailsComponent,
    SchemeListComponent,
    SchemeViewComponent,
    SchemeCreateComponent,
    TowerComponent,
    TemplateSelectComponent,
    IncentivesListComponent,
    IncentiveViewComponent,
    IncentiveCreateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    DragDropModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    RadioButtonModule,
    AutoCompleteModule,
    DialogModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    TableModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProjectsOverviewComponent,
        data: { breadcrumb: "Project Overview" },
      },
      {
        path: "create",
        component: ProjectsOverviewCreateComponent,
        data: { breadcrumb: "Project Create" },
      },
      {
        path: "project-details/:id",
        component: ProjectsOverviewDetailsComponent,
        data: { breadcrumb: "Project Details" },
      },
    ]),
  ],
  providers: [DatePipe],
  bootstrap: [],
})
export class ProjectOverviewModule {}
