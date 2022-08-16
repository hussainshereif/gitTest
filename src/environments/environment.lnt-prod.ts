import { environmentCommonProd } from "./environment.common-prod";
export const environment = {
  production: true,
  environmentName: "lnt-prod",
  API_URL: "https://prod.loyalie.in/winnre/",
  CONTEXT_PATH: "lnt-admin/",
  CLIENT_ID: "c1f64b2ece7c43a2314ac91f9e4652d667979315888848188fe50aed334da78f",
  TITLE: "MY LTR",
  LOGO: "assets/images/ltr_logo_final.png",
  SIDE_BAR_LOGO: "assets/images_new/logo/L&T.jpg",
  LOADER: "assets/images/ltr.gif",
  PRIMARY_COLOR: "#fecc00",
  SECONDARY_COLOR: "#1f1a17",
  LOGIN_BG: "#fecc00",
  BUTTON_COLOR: "#1f1a17",
  conectreClient: false,
  showManageCustomers: false,
  enableCustomCollateral: true,
  enableMRP: false,
  enableAboutUS: false,
  enableBrokerageCalculator: false,
  showManageCPs: true,
  enableSMConfig: true,
  PROJECT_NAME: "lnt",
  loginMainText: "Manage Your Channel Partners",
  loginSubText: "Leads | Brokerage | Notifications",
  COMMON_FILES: environmentCommonProd,
};