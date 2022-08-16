import { Component, OnInit } from "@angular/core";
import { RemoteApisService } from "../../../commonservice/remote-apis.service";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-set-theme",
  templateUrl: "./set-theme.component.html",
  styleUrls: ["./set-theme.component.css"],
})
export class SetThemeComponent implements OnInit {
  isOverallThemeColor1: boolean = false;
  isOverallThemeColor2: boolean = false;
  isButtonThemeColor1: boolean = false;
  isButtonThemeColor2: boolean = false;
  isTitleColor1: boolean = false;
  isTitleColor2: boolean = false;
  exitLayerBG: boolean = false;
  themeColorArr: any = [];
  arrayNum: number = 0;
  isDarkColorChange: boolean = false;
  isLightColorChange: boolean = false;
  constructor(
    private apiService: RemoteApisService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getThemeColor();
  }
  exitLayer() {
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = false;
    this.isTitleColor2 = false;
    this.exitLayerBG = false;
  }
  overallThemeColor1() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = true;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = false;
    this.isTitleColor2 = false;
    this.arrayNum = 0;
    this.isDarkColorChange = true;
  }
  buttonThemeColor1() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = true;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = false;
    this.isTitleColor2 = false;
    this.arrayNum = 0;
    this.isDarkColorChange = true;
  }
  titleColor1() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = true;
    this.isTitleColor2 = false;
    this.arrayNum = 0;
    this.isDarkColorChange = true;
  }
  overallThemeColor2() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = true;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = false;
    this.isTitleColor2 = false;
    this.arrayNum = 1;
    this.isLightColorChange = true;
  }
  buttonThemeColor2() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = true;
    this.isTitleColor1 = false;
    this.isTitleColor2 = false;
    this.arrayNum = 1;
    this.isLightColorChange = true;
  }
  titleColor2() {
    this.exitLayerBG = true;
    this.isOverallThemeColor1 = false;
    this.isOverallThemeColor2 = false;
    this.isButtonThemeColor1 = false;
    this.isButtonThemeColor2 = false;
    this.isTitleColor1 = false;
    this.isTitleColor2 = true;
    this.arrayNum = 1;
    this.isLightColorChange = true;
  }
  themeBoxClick(value) {
    this.arrayNum = value;
  }

  overallThemeColor1Change(ev) {
    let color = ev.color.hex;
    document.getElementById("OTColor1").style.backgroundColor = color;
    this.themeColorArr[0].overAllColor = color;
    // console.log(this.themeColorArr,"themecolorarr");
  }
  buttonThemeColor1Change(ev) {
    let color = ev.color.hex;
    document.getElementById("BTColor1").style.backgroundColor = color;
    this.themeColorArr[0].buttonColor = color;
  }
  titleColor1Change(ev) {
    let color = ev.color.hex;
    document.getElementById("TSTColor1").style.backgroundColor = color;
    this.themeColorArr[0].titleColor = color;
  }

  overallThemeColor2Change(ev) {
    let color = ev.color.hex;
    document.getElementById("OTColor2").style.backgroundColor = color;
    this.themeColorArr[1].overAllColor = color;
  }
  buttonThemeColor2Change(ev) {
    let color = ev.color.hex;
    document.getElementById("BTColor2").style.backgroundColor = color;
    this.themeColorArr[1].buttonColor = color;
  }
  titleColor2Change(ev) {
    let color = ev.color.hex;
    document.getElementById("TSTColor2").style.backgroundColor = color;
    this.themeColorArr[1].titleColor = color;
  }

  getThemeColor() {
    this.apiService.getData("noAuth/theme").subscribe((res) => {
      // console.log(res,"res");
      this.themeColorArr = res;
      document.getElementById("OTColor1").style.backgroundColor =
        this.themeColorArr[0].overAllColor;
      document.getElementById("BTColor1").style.backgroundColor =
        this.themeColorArr[0].buttonColor;
      document.getElementById("TSTColor1").style.backgroundColor =
        this.themeColorArr[0].titleColor;
      document.getElementById("OTColor2").style.backgroundColor =
        this.themeColorArr[1].overAllColor;
      document.getElementById("BTColor2").style.backgroundColor =
        this.themeColorArr[1].buttonColor;
      document.getElementById("TSTColor2").style.backgroundColor =
        this.themeColorArr[1].titleColor;
    });
  }
  saveThemeColor() {
    if (this.isLightColorChange == true && this.isDarkColorChange == true) {
      this.apiService
        .postData("admin/theme", this.themeColorArr[0])
        .subscribe((res) => {
          // AlertComponent.showAlert(this.dialog, "", "Theme Colors Successfully Saved ");
          this.apiService
            .postData("admin/theme", this.themeColorArr[1])
            .subscribe((res) => {
              this.isLightColorChange = false;
              this.isDarkColorChange = false;
              AlertComponent.showAlert(
                this.dialog,
                "",
                "Theme Colors Successfully Saved "
              );
            });
        });
    } else {
      this.apiService
        .postData("admin/theme", this.themeColorArr[this.arrayNum])
        .subscribe((res) => {
          this.isLightColorChange = false;
          this.isDarkColorChange = false;
          AlertComponent.showAlert(
            this.dialog,
            "",
            "Theme Colors Successfully Saved "
          );
        });
    }
  }
}
