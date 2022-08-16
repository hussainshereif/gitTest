import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CpSmMappingListComponent } from "./cp-sm-mapping-list/cp-sm-mapping-list.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { SidebarModule } from "primeng/sidebar";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [CpSmMappingListComponent],
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    NgbModule,
    ReactiveFormsModule,
    SidebarModule,
    TableModule,

    RouterModule.forChild([
      {
        path: "",
        component: CpSmMappingListComponent,
      },
    ]),
  ],
})
export class CpSmMappingModule {}
