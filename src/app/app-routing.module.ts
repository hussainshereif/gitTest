import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "src/app/guards/auth.guard";
import { WrongRouteComponent } from "./components/wrong-route/wrong-route.component";
import { environment } from "src/environments/environment";

const appRoutes: Routes = [
  {
    path: "dashboard",
    data: { breadcrumb: "Dashboard" },
    loadChildren: () =>
      import("./features/dashboard/dashboard.module").then(
        (m) => m.DashBoardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "project-overview",
    data: { breadcrumb: "Project Overview" },
    loadChildren: () =>
      import(
        "./features/marketing/project-overview/project-overview.module"
      ).then((m) => m.ProjectOverviewModule),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-CPList",
    data: { breadcrumb: "Manage Channel Partners" },
    loadChildren: () =>
      import("./features/sales/manage-cp/manage-cp.module").then(
        (m) => m.ManageCPModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "cp-sm-mapping",
    data: { breadcrumb: "CP SM Mapping" },
    loadChildren: () =>
      import("./features/sales/cp-sm-mapping/cp-sm-mapping.module").then(
        (m) => m.CpSmMappingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-leads",
    data: { breadcrumb: "Manage Leads" },
    loadChildren: () =>
      import("./features/sales/manage-leads/manage-leads.module").then(
        (m) => m.ManageLeadsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "profile-requests",
    data: { breadcrumb: "Manage Profile Request" },
    loadChildren: () =>
      import("./features/sales/profile-request/profile-request.module").then(
        (m) => m.ProfileRequestModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: "customer-profile-requests",
    data: { breadcrumb: "Manage Profile Request" },
    loadChildren: () =>
      import("./features/crm/profile-request/profile-request.module").then(
        (m) => m.ProfileRequestModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-referrals",
    data: { breadcrumb: "Manage Referrals" },
    loadChildren: () =>
      import("./features/crm/manage-referrals/manage-referrals.module").then(
        (m) => m.ManageReferralsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-customers",
    data: { breadcrumb: "Manage Customers" },
    loadChildren: () =>
      import("./features/crm/manage-customers/manage-customers.module").then(
        (m) => m.ManageCustomersModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "about-us",
    data: { breadcrumb: "About Us" },
    loadChildren: () =>
      import("./features/marketing/about-us/about-us.module").then(
        (m) => m.AboutUsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-campaigns",
    data: { breadcrumb: "Manage Campaigns" },
    loadChildren: () =>
      import(
        "./features/marketing/manage-campaigns/manage-campaigns.module"
      ).then((m) => m.ManageCampaignsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "training",
    data: { breadcrumb: "Training" },
    loadChildren: () =>
      import("./features/marketing/training/training.module").then(
        (m) => m.TrainingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "invoice",
    data: { breadcrumb: "Invoice" },
    loadChildren: () =>
      import("./features/finance/invoice/invoice.module").then(
        (m) => m.InvoiceModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "invoice-template",
    data: { breadcrumb: "Invoice-Template" },
    loadChildren: () =>
      import("./features/finance/invoice-template/invoicetemplate.module").then(
        (m) => m.InvoiceTemplateModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "brokerage-details",
    data: { breadcrumb: "Brokerage Details" },
    loadChildren: () =>
      import("./features/finance/brokerage/brokerage.module").then(
        (m) => m.BrokerageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "banner",
    data: { breadcrumb: "Banner" },
    loadChildren: () =>
      import("./features/marketing/banner/banner.module").then(
        (m) => m.BannerModule
      ),
    canActivate: [AuthGuard],
  },
  { path: "login", component: LoginComponent, data: { breadcrumb: "Login" } },
  {
    path: "notifications",
    data: { breadcrumb: "Notification" },
    loadChildren: () =>
      import("./features/admin/notification/notification.module").then(
        (m) => m.NotificationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "sub-admin",
    data: { breadcrumb: "Sub-Admin" },
    loadChildren: () =>
      import("./features/admin/manage-sub-admin/manage-sub-admin.module").then(
        (m) => m.ManageSubAdminModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "manage-sm",
    data: { breadcrumb: "Manage SM" },
    loadChildren: () =>
      import("./features/sales/manage-sm/manage-sm.module").then(
        (m) => m.ManageSmModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "brokerage",
    data: { breadcrumb: "Brokerage" },
    loadChildren: () =>
      import("./features/contract/brokerage/brokerage.module").then(
        (m) => m.BrokeragerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "cp-group",
    data: { breadcrumb: "CP Group" },
    loadChildren: () =>
      import("./features/contract/cp-group/cp-group.module").then(
        (m) => m.CPGroupModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ladders",
    data: { breadcrumb: "Ladders" },
    loadChildren: () =>
      import("./features/contract/ladders/ladders.module").then(
        (m) => m.LadderModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: environment.showManageCustomers
      ? "manage-customers"
      : "manage-CPList",
    data: {
      breadcrumb: environment.showManageCustomers
        ? "Manage Customers"
        : "Manage Channel Partners",
    },
  },
  {
    path: "**",
    component: WrongRouteComponent,
    data: { breadcrumb: "404" },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
  ],

  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
