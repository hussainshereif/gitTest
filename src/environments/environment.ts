// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { environmentCommonDev } from "./environment.common-dev";
export const environment = {
  production: false,
  // API_URL:"http://54.255.136.91:8080/winnre_mahindra/"
  API_URL: "http://dev.loyalie.in/winnre/",
  CONTEXT_PATH: "winnre-admin/",
  CLIENT_ID: "43f9ae0bd0e04f52e4d95b93bcf34138dbf6052b78dc2710ff4eb90b3c69f096",
  TITLE: "Happiedge",
  LOGO: "assets/images/home.png",
  SIDE_BAR_LOGO: "assets/images/admin.png",
  LOADER: "assets/images/BrigadeLogoTransparentBG100x100pxl.gif",
  PRIMARY_COLOR: "#e6e4e4",
  SECONDARY_COLOR: "#231f20",
  LOGIN_BG: "#024c9e",
  BUTTON_COLOR: "#f7941e",
  conectreClient: false,
  showManageCustomers: false,
  enableCustomCollateral: true,
  enableMRP: true,
  enableAboutUS: true,
  enableBrokerageCalculator: true,
  showManageCPs: false,
  enableSMConfig: true,
  PROJECT_NAME: "happiedge",
  loginMainText: "Manage Your Channel Partners",
  loginSubText: "Leads | Brokerage | Notifications",
  COMMON_FILES: environmentCommonDev,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
