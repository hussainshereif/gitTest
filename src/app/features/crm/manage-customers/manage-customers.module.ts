import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ManageCustomersComponent } from "./manage-customers-list/manage-customers-list.component";

import { MatExpansionModule } from "@angular/material/expansion";

@NgModule({
  declarations: [ManageCustomersComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
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
