import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { DialogModule } from "../../../../app/dialogs/dialog.module";

import { AboutUsComponent } from "./about-us-list/about-us-list.component";
import { AppVideosComponent } from "./app-videos/app-videos.component";
import { AppVideoDetailComponent } from "./app-videos/app-videos-details/app-videos-details.component";
import { AppVideoCreateComponent } from "./app-videos/app-videos-create/app-videos-create.component";
import { BuilderDetailsComponent } from "./builder-details/builder-details.component";
import { BuilderDetailsListComponent } from "./builder-details/builder-details-list/builder-details-list.component";
import { BuilderDetailsCreateComponent } from "./builder-details/builder-details-create/builder-details-create.component";
import { HelpsDocumentsComponent } from "./helps-and-documents/helps-and-documents.component";
import { NewsComponent } from "./news/news.component";
import { NewsDetailsComponent } from "./news/news-details/news-details.component";
import { NewsCreateComponent } from "./news/news-create/news-create.component";

@NgModule({
  declarations: [
    AboutUsComponent,
    AppVideoDetailComponent,
    AppVideoCreateComponent,
    AppVideosComponent,
    BuilderDetailsComponent,
    BuilderDetailsListComponent,
    BuilderDetailsCreateComponent,
    HelpsDocumentsComponent,
    NewsComponent,
    NewsDetailsComponent,
    NewsCreateComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTabsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: "",
        component: AboutUsComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class AboutUsModule {}
