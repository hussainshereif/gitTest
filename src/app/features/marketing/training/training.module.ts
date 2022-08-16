import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DialogModule } from "src/app/dialogs/dialog.module";
import { TrainingComponent } from "./training-list/training-list.component";

@NgModule({
  declarations: [TrainingComponent],
  imports: [
    CommonModule,
    DialogModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: TrainingComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class TrainingModule {}
