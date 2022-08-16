import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SharedModule } from "../../../shared/shared.module";
import { FailedTransferComponent } from "./failed-transfer/failed-transfer.component";

import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { SidebarModule } from "primeng/sidebar";

@NgModule({
  declarations: [FailedTransferComponent],
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
        component: FailedTransferComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class failedTransferModule {}
