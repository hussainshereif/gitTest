import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { CustomNotificationListComponent } from "./custom-notification/custom-notification.component";
import { CustomNotificationCreateComponent } from "./custom-notification/custom-notificaton-create/custom-notification-create.component";
import { NotificationListComponent } from "./notification-list/notification-list.component";
import { SystemNotificationListComponent } from "./system-notification/system-notification.component";
import { SystemNotificationCreateComponent } from "./system-notification/system-notification-create/system-notification-create.component";
import { MultiSelectModule } from "primeng/multiselect";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [
    NotificationListComponent,
    SystemNotificationListComponent,
    SystemNotificationCreateComponent,
    CustomNotificationListComponent,
    CustomNotificationCreateComponent,
  ],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    NgbModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: "",
        component: NotificationListComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [],
})
export class NotificationModule {}
