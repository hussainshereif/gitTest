import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ManageLeadsComponent } from "./manage-leads-list/manage-leads-list.component";

@NgModule({
  declarations: [ManageLeadsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
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
