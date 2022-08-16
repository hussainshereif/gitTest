import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BannerlistComponent } from "./banner-list/banner-list.component";
import { DialogModule } from "src/app/dialogs/dialog.module";

@NgModule({
  declarations: [BannerlistComponent],
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
        component: BannerlistComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class BannerModule {}
