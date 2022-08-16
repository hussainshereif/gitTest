import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";

import { BrokerageListComponent } from "./brokerage-list/brokerage-list.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [BrokerageListComponent],
  imports: [
    CommonModule,
    DropdownModule,
    SharedModule,
    TableModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: BrokerageListComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class BrokeragerModule {}
