import { environmentCommonProd } from "./environment.common-prod";

export const environment = {
  production: true,
  environmentName: "rohan-prod",
  API_URL: "https://prod.loyalie.in/winnre/",
  CONTEXT_PATH: "rohan-admin/",
  CLIENT_ID: "117c1ec7d8400f6c0f4c7cb2f7d10e5146c90768c250e6152f088349e55df752",
  TITLE: "Rohan ",
  LOGO: "assets/images/Rohan_logo_final.png",
  SIDE_BAR_LOGO: "assets/images_new/logo/Rohan_new.jpg",
  LOADER: "assets/images/rohan_loader.gif",
  PRIMARY_COLOR: "#009BDE",
  SECONDARY_COLOR: "#000000",
  LOGIN_BG: "#009BDE",
  BUTTON_COLOR: "#000000",
  conectreClient: false,
  showManageCustomers: false,
  enableCustomCollateral: true,
  enableMRP: false,
  enableAboutUS: false,
  enableBrokerageCalculator: true,
  showManageCPs: true,
  enableSMConfig: true,
  PROJECT_NAME: "rohan",
  loginMainText: "Manage Your Channel Partners",
  loginSubText: "Leads | Brokerage | Notifications",
  COMMON_FILES: environmentCommonProd,
};
