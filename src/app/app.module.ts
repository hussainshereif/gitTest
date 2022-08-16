import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from ".//app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { RemoteApisService } from "src/app/commonservice/remote-apis.service";
import { LoginComponent } from "./components/login/login.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";

import { JwtModule } from "@auth0/angular-jwt";
import { FormsModule } from "@angular/forms";
import { SideBarComponent } from "./components/side-bar/side-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AgmCoreModule } from "@agm/core";

// class
import { Interceptor } from "./http-interceptor/interceptor";
import { BreadcrumbModule } from "angular-crumbs";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BnNgIdleService } from "bn-ng-idle";
import { AngularDraggableModule } from "angular2-draggable";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RichTextEditorModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DiagramModule } from "@syncfusion/ej2-angular-diagrams";
import { ColorSketchModule } from "ngx-color/sketch";
import { AESEncryptDecryptService } from "src/app/commonservice/aesencrypt-decrypt.service";
import { RichTextEditorComponent } from "./commonLibraries/rich-text-editor/rich-text-editor.component";
import { DiagramComponent } from "./commonLibraries/diagram/diagram.component";
import { DiagramLibraryComponent } from "./commonLibraries/diagram-library/diagram-library.component";
import { WrongRouteComponent } from "./components/wrong-route/wrong-route.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCardModule } from "@angular/material/card";
import { DialogModule } from "./dialogs/dialog.module";
import { SetThemeComponent } from "./features/others/set-theme/set-theme.component";
import { RewardsInfoComponent } from "./features/others/rewards-info/rewards-info.component";
import { TiersDetailsComponent } from "./features/others/cp-tiers/tiers-details/tiers-details.component";
import { LadderComponent } from "./features/others/ladder/ladder.component";
import { MailListComponent } from "./features/others/mail-list/mail-list.component";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "./shared/shared.module";
import { AuthService } from "./commonservice/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    DiagramLibraryComponent,
    FooterComponent,
    ForgotPasswordComponent,
    LadderComponent,
    LoginComponent,
    MailListComponent,
    NavbarComponent,
    SetThemeComponent,
    SideBarComponent,
    RewardsInfoComponent,
    RichTextEditorComponent,
    TiersDetailsComponent,
    WrongRouteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DialogModule,
    //mat
    MatNativeDateModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    AngularDraggableModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTabsModule,
    BreadcrumbModule,

    //mat
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    RichTextEditorModule,
    DiagramModule,
    SharedModule,
    ColorSketchModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // ...
        // tokenGetter: () => {
        //   return localStorage.getItem('access_token');
        // }
      },
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDlOYEjvoJuMsJw2VTREKIRcLfQSo-MW14",
      libraries: ["places"],
    }),
  ],
  entryComponents: [
    RichTextEditorComponent,
    DiagramComponent,
    DiagramLibraryComponent,
  ],

  providers: [
    AuthService,
    RemoteApisService,
    BnNgIdleService,
    AESEncryptDecryptService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function tokenGetter() {
  return localStorage.getItem("access_token");
}
