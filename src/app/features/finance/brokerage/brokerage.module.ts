import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BrokerageListComponent } from "./brokerage-list/brokerage-list.component";
import { BrokerageViewComponent } from "./brokerage-view/brokerage-view.component";

@NgModule({
  declarations: [BrokerageListComponent, BrokerageViewComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: BrokerageListComponent,
      },
      {
        path: "detailed-brokerage-view/:id",
        component: BrokerageViewComponent,
        data: { breadcrumb: "Brokerage Details" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class BrokerageModule {}
