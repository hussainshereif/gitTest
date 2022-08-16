import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ManageCampaignsComponent } from "./manage-campaigns-list/manage-campaigns-list.component";

@NgModule({
  declarations: [ManageCampaignsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: ManageCampaignsComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ManageCampaignsModule {}
