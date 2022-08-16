import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InvoiceTemplateListComponent } from "./invoice-template-list/invoice-template-list.component";
import { SharedModule } from "../../../shared/shared.module";
import { TableModule } from "primeng/table";
import { InvoiceTemplateCreateComponent } from "./invoice-template-create/invoice-template-create.component";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
@NgModule({
  declarations: [InvoiceTemplateListComponent, InvoiceTemplateCreateComponent],
  imports: [
    CommonModule,
    CalendarModule,
    CheckboxModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    DropdownModule,
    InputNumberModule,
    MultiSelectModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: "",
        component: InvoiceTemplateListComponent,
        data: { breadcrumb: "Invoice Template Details" },
      },
      { path: "create", component: InvoiceTemplateCreateComponent },
      {
        path: "create/:id",
        component: InvoiceTemplateCreateComponent,
        data: { breadcrumb: "Invoice Template Details" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class InvoiceTemplateModule {}
