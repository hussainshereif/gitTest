import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ProfileRequestsComponent } from "./profile-request-list/profile-request-list.component";

@NgModule({
  declarations: [ProfileRequestsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProfileRequestsComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class ProfileRequestModule {}
