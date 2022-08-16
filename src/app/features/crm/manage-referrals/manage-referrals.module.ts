import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ManageReferralsComponent } from "./manage-referrals-list/manage-referrals-list.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ManageReferralsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
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
