import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { AddBannerComponent } from "./add-banner/add-banner.component";
import { AddFAQComponent } from "./add-faq/add-faq.component";
import { AddGroupsComponent } from "./add-groups/add-groups.component";
import { AddLadderComponent } from "./add-ladder/add-ladder.component";
import { AddLadderDetailsComponent } from "./add-ladder-details/add-ladder-details.component";
import { AddModuleComponent } from "./add-module/add-module.component";
import { AddNormalBrokerageComponent } from "./add-normal-brokerage/add-normal-brokerage.component";
import { AddProjectComponent } from "./add-project/add-project.component";
import { AddScheduledBrokerageComponent } from "./add-scheduled-brokerage/add-scheduled-brokerage.component";
import { AddSmComponent } from "./add-sm/add-sm.component";
import { AddSubAdminComponent } from "./add-sub-admin/add-sub-admin.component";
import { AlertComponent } from "./alert/alert.component";
import { AddvideosComponent } from "./addvideos/addvideos.component";
import { BdMapComponent } from "./bd-map/bd-map.component";
import { ChangepasswordComponent } from "./changepassword/changepassword.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { DocumentDetailsComponent } from "./document-details/document-details.component";
import { EditSubAdminComponent } from "./edit-sub-admin/edit-sub-admin.component";
import { FailedExcelListComponent } from "./failed-excel-list/failed-excel-list.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LadderDetailsComponent } from "./ladder-details/ladder-details.component";
import { MessageComponent } from "./message/message.component";
import { RejectComponent } from "./reject/reject.component";
import { RejectInvoiceComponent } from "./reject-invoice/reject-invoice.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SelectedSMComponent } from "./selected-sm/selected-sm.component";
import { ViewLogComponent } from "./view-log/view-log.component";
import { ViewMoreInvoiceComponent } from "./view-more-invoice/view-more-invoice.component";
import { ViewProfileLogComponent } from "./view-profile-log/view-profile-log.component";
import { ViewTrainingComponent } from "./view-training/view-training.component";
import { AddTowerComponent } from "./add-tower/add-tower.component";
import { AddAmenitiesComponent } from "./add-amenities/add-amenities.component";

import { AngularDraggableModule } from "angular2-draggable";
import { ColorSketchModule } from "ngx-color/sketch";
import { DiagramModule } from "@syncfusion/ej2-angular-diagrams";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RichTextEditorModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { TableModule } from "primeng/table";
import { SharedModule } from "../shared/shared.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AddCollateralComponent } from "./add-collateral/add-collateral.component";
import { CollateralCustomCreatorComponent } from "./add-custom-collateral/add-custom-collateral.component";

@NgModule({
  declarations: [
    AddBannerComponent,
    AddModuleComponent,
    AddCollateralComponent,
    AddFAQComponent,
    AddGroupsComponent,
    AddLadderComponent,
    AddLadderDetailsComponent,
    AddNormalBrokerageComponent,
    AddProjectComponent,
    AddSmComponent,
    AddScheduledBrokerageComponent,
    AddSubAdminComponent,
    AddTowerComponent,
    AddvideosComponent,
    AlertComponent,
    BdMapComponent,
    ChangepasswordComponent,
    ConfirmationComponent,
    CollateralCustomCreatorComponent,
    DocumentDetailsComponent,
    EditSubAdminComponent,
    FailedExcelListComponent,
    ForgotPasswordComponent,
    LadderDetailsComponent,
    MessageComponent,
    RejectComponent,
    RejectInvoiceComponent,
    ResetPasswordComponent,
    SelectedSMComponent,
    ViewLogComponent,
    ViewMoreInvoiceComponent,
    ViewProfileLogComponent,
    ViewTrainingComponent,
    AddAmenitiesComponent,
  ],
  imports: [
    AngularDraggableModule,
    AutoCompleteModule,
    ColorSketchModule,
    CommonModule,
    DiagramModule,
    DropdownModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgbModule,
    TableModule,
    ToastModule,
    ReactiveFormsModule,
    RichTextEditorModule,
    SharedModule,
  ],
  exports: [
    AddBannerComponent,
    AddModuleComponent,
    AddFAQComponent,
    AddCollateralComponent,
    AddGroupsComponent,
    AddLadderComponent,
    AddLadderDetailsComponent,
    AddNormalBrokerageComponent,
    AddProjectComponent,
    AddSmComponent,
    AddScheduledBrokerageComponent,
    AddSubAdminComponent,
    AddvideosComponent,
    AlertComponent,
    BdMapComponent,
    ChangepasswordComponent,
    CollateralCustomCreatorComponent,
    ConfirmationComponent,
    DocumentDetailsComponent,
    EditSubAdminComponent,
    FailedExcelListComponent,
    FormsModule,
    ForgotPasswordComponent,
    LadderDetailsComponent,
    MessageComponent,
    RejectComponent,
    ReactiveFormsModule,
    RejectInvoiceComponent,
    ResetPasswordComponent,
    SelectedSMComponent,
    ViewLogComponent,
    ViewMoreInvoiceComponent,
    ViewProfileLogComponent,
    ViewTrainingComponent,
    SharedModule,
  ],
  providers: [],
  bootstrap: [],
})
export class DialogModule {}
