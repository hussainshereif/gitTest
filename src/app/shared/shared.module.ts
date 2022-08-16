import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DeleteConfirmationComponent } from "./delete-confirmation/delete-confirmation.component";

import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { AppToasterComponent } from "./app-toaster/app-toaster.component";
import { SuccessConfirmationComponent } from "./success-alert/success-alert.component";
import { ValidationErrorComponent } from "./components/validation-error/validation-error.component";

@NgModule({
  declarations: [
    AppToasterComponent,
    DeleteConfirmationComponent,
    SuccessConfirmationComponent,
    ValidationErrorComponent,
  ],
  imports: [CommonModule, ToastModule],
  exports: [
    AppToasterComponent,
    DeleteConfirmationComponent,
    SuccessConfirmationComponent,
    ValidationErrorComponent,
  ],
  providers: [MessageService],
})
export class SharedModule {}
