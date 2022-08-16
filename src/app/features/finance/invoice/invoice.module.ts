import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InvoiceComponent } from "./invoice-list/invoice-list.component";

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: InvoiceComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class InvoiceModule {}
