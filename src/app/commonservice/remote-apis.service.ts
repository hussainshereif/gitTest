import { Injectable } from "@angular/core";
import { Observable, throwError, Subject, of } from "rxjs";
import { catchError, retry, map, tap } from "rxjs/operators";
import {
  HttpHeaders,
  HttpRequest,
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AlertComponent } from "src/app/dialogs/alert/alert.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/commonservice/auth.service";
import { environment } from "../../environments/environment";
import countries from "../../assets/js/countries.json";
import indianCitiesName from "../../assets/js/indianCitiesName.json";
import states from "../../assets/js/stateName.json";

@Injectable({
  providedIn: "root",
})
export class RemoteApisService {
  mime: any;
  url: string = environment.API_URL;
  clientId: string = environment.CLIENT_ID;
  countryList: any = countries;
  indianCitiesNameList: any = indianCitiesName;
  stateList: any = states;

  private loaderStatus = new Subject<any>();

  constructor(
    private _http: HttpClient,
    private router: Router,
    public helper: JwtHelperService,
    public dialog: MatDialog,
    private authenticationService: AuthService
  ) {
    //our development
    // this.url="https://demo.loyalie.in/winnre/"
    // this.url="http://dev.loyalie.in/happiedge/"
    // this.url="http://54.255.136.91:8080/winnre_mahindra/"
    // this.url="http://54.255.136.91:8080/WinnRE/"
    // this.url="http://18.140.57.92:8080/WinnRE/"
    // this.url="http://13.235.128.96:8080/WinnRE/"
    // this.url="https://happiedge.mahindrahappinest.com/WinnRE/"
    // this.url="http://13.127.63.66:8080/WinnRE/"
    // this.url="http://13.235.128.96:8080/WinnRE/"
    //client development
    // this.url="http://13.235.98.76:8080/WinnRE/";
    // this.url="https://happiedge-uat.mahindrahappinest.com/WinnRE/";
    // this.url="https://happiedge-uat.mahindrahappinest.com/Mlife/";
    // this.url="https://happiedge-uat.mahindrahappinest.com/WinnRE-V2/";
    // this.url="http://happiedge.mahindrahappinest.com/WinnRE-V2/";
    // this.url="https://happiedge.mahindrahappinest.com/WinnRE-V2/";
    // this.url="https://happiedge.mahindrahappinest.com/WinnRE-V2-leadtest/";
    // this.loaderStatus=false;
  }

  loaderSwitch(value: any) {
    if (value == 1) {
      this.loaderStatus.next({ show: false });
    } else if (value == 0) {
      this.loaderStatus.next({ show: true });
    }
  }
  public getApiLoaderStatus() {
    return this.loaderStatus.asObservable();
  }

  private handleError(error: HttpErrorResponse) {
    this.loaderStatus.next({ show: false });
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
      AlertComponent.showAlert(this.dialog, "", error.error.message).subscribe(
        (result) => {}
      );
    } else {
      AlertComponent.showAlert(this.dialog, "", "Unable to process").subscribe(
        (result) => {}
      );
      this.authenticationService.logout();
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
        `body was: ${JSON.stringify(error)}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  refreshTokenFunction(token) {
    //  var params=new HttpParams({
    //     fromObject:{
    //       refreshToken:localStorage.getItem('refreshToken')
    //     }
    //   });
    // let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization','Bearer ' + localStorage.getItem('refreshToken')).set('Client-Id',this.clientId);
    // let callUrl="login/refreshToken";
    //  this._http.get(this.url+callUrl,{headers,responseType:"text"}).subscribe((result:any)=>{;
    //     let res=JSON.parse(result);
    // console.log(res,'refresh token call',res.accessToken,res.refreshToken);
    // localStorage.setItem("access_token",res.accessToken);
    // localStorage.setItem("refreshToken",res.refreshToken);
    //  });
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + token);
    let callUrl = "login/refreshToken";
    return this._http.get(this.url + callUrl, {
      headers,
      responseType: "text",
    });
  }

  getDataInputValue(callurl, inputData: any) {
    this.loaderStatus.next({ show: true });
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);
    let callUrl = callurl;
    let params = new HttpParams({
      fromObject: inputData,
    });
    return this._http
      .get(this.url + callUrl, { params, headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          this.loaderStatus.next({ show: false });
          return res;
        }),
        catchError(this.handleError)
      );
  }
  getDataInputValueNotJson(callurl, inputData: any) {
    this.loaderStatus.next({ show: true });
    let headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);
    let callUrl = callurl;
    let params = new HttpParams({
      fromObject: inputData,
    });
    return this._http
      .get(this.url + callUrl, { params, headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          this.loaderStatus.next({ show: false });
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getData(callurl) {
    this.loaderStatus.next({ show: true });
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);
    return this._http
      .get(this.url + callurl, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          this.loaderStatus.next({ show: false });
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getDataNotJSON(callurl) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .get(this.url + callurl, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0), // retry a failed request up to 3 times
        // map(response=>response),
        catchError(this.handleError) // then handle the error
      );
  }

  getDataMultipart(callurl) {
    const headers = new HttpHeaders()
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .get(this.url + callurl, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0), // retry a failed request up to 3 times
        // map(response=>response),
        catchError(this.handleError) // then handle the error
      );
  }

  /** POST: add a new input to the database */
  postData(callurl, input) {
    this.loaderStatus.next({ show: true });

    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          this.loaderStatus.next({ show: false });
          let res = JSON.parse(result);
          return res;
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postDataNoToken(callurl, input) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Client-Id", this.clientId);
    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postDataNoTokenNotJSON(callurl, input) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postDataNotJSON(callurl, input) {
    this.loaderStatus.next({ show: true });

    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          this.loaderStatus.next({ show: false });
          let res = JSON.parse(result);
          return res;
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postDataMultipartRaw(callurl, input) {
    this.loaderStatus.next({ show: true });

    const headers = new HttpHeaders()
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          this.loaderStatus.next({ show: false });
          return res;
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postDataMultipart(callurl, input) {
    this.loaderStatus.next({ show: true });

    const headers = new HttpHeaders()
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            this.loaderStatus.next({ show: true });
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
          this.loaderStatus.next({ show: false });
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  uploadExcel(formData: FormData, callurl) {
    const headers = new HttpHeaders()
      .set("Accept", "application/json;charset=utf-8")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, formData, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          return res;
        })
      );
  }

  uploadBrochure(formData: FormData, callurl) {
    this.loaderStatus.next({ show: true });
    const headers = new HttpHeaders()
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, formData, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          this.loaderStatus.next({ show: false });
          return res;
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  getMime(header) {
    let header1 = header;
    switch ('"' + header1 + '"') {
      case "89504E47":
        console.log(1);
        return "image/png";
      case "47494638":
        console.log(2);
        return "image/gif";
      case "25504446":
        console.log(3);
        return "application/pdf";
      case "FFD8FFDB":
      case "FFD8FFE0":
        console.log(4);
        return "image/jpeg";
      case "504B0304":
        console.log(5);
        return "application/zip";
      default:
        console.log(6);
        return "Unknown filetype";
    }
  }

  getImageValidation(fileInputs: File) {
    const fileReader = new FileReader();
    this.mime = "";
    let fileInput = fileInputs;
    let imageType = fileInput.type;
    let header = "";
    fileReader.readAsArrayBuffer(fileInput);
    return new Promise((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fileReader.onload = (e) => {
        let data = e.target;
        var arr = new Uint8Array(<ArrayBuffer>data["result"]).subarray(0, 4);
        for (var i = 0; i < arr.length; i++) {
          header = "" + header + arr[i].toString(16);
        }
        this.mime = header.toUpperCase();
        // Check the file signature against known types
        let result = { valid: true, insize: true };
        if (
          this.mime == "89504E47" ||
          this.mime == "FFD8FFE0" ||
          this.mime == "FFD8FFE1" ||
          this.mime == "FFD8FFE2" ||
          this.mime == "FFD8FFE3" ||
          this.mime == "FFD8FFE8" ||
          this.mime == "FFD8FFDB"
        ) {
          if (
            imageType == "image/png" ||
            imageType == "image/jpg" ||
            imageType == "image/jpeg"
          ) {
            let extn = fileInput.name.split(".").pop();
            if (extn == "jpg" || extn == "png" || extn == "jpeg") {
              let name_array = fileInput.name.split(".");
              let restricted_array = [
                "php",
                "py",
                "sh",
                "exe",
                "bat",
                "batch",
                "htaccess",
                "js",
                "jsp",
                "java",
                "asp",
                "aspx",
                "php4",
                "php5",
                "php6",
                "php7",
                "php3",
              ];
              let found = name_array.some(
                (r) => restricted_array.indexOf(r) >= 0
              );
              if (found == false) {
                if (fileInput.size < 10000000) {
                  result = { valid: true, insize: true };
                } else {
                  result = { valid: false, insize: false };
                }
              } else {
                result = { valid: false, insize: true };
              }
            } else {
              result = { valid: false, insize: true };
            }
          } else {
            result = { valid: false, insize: true };
          }
        } else {
          result = { valid: false, insize: true };
        }
        resolve(result);
      };
    });
  }
  getImageValidationTest(fileInputs) {
    this.mime = [];
    let fileInput = fileInputs;
    let imageType = fileInput.type;
    var fileReader = new FileReader();
    let header = "";

    fileReader.readAsArrayBuffer(fileInput);
    fileReader.onloadend = (e) => {
      let data = e.target;
      var arr = new Uint8Array(<ArrayBuffer>data["result"]).subarray(0, 4);
      for (var i = 0; i < arr.length; i++) {
        header = "" + header + arr[i].toString(16);
      }
      this.mime.push(header);
      //  this.mime=this.getMime('"'+header+'"');
    };
    // Check the file signature against known types
    if (
      this.mime[0] == "89504E47" ||
      this.mime[0] == "FFD8FFE0" ||
      this.mime[0] == "FFD8FFDB"
    ) {
      if (
        imageType == "image/png" ||
        imageType == "image/jpg" ||
        imageType == "image/jpeg"
      ) {
        let extn = fileInput.name.split(".").pop();
        if (extn == "jpg" || extn == "png" || extn == "jpeg") {
          let name_array = fileInput.name.split(".");
          let restricted_array = [
            "php",
            "py",
            "sh",
            "exe",
            "bat",
            "batch",
            "htaccess",
            "js",
            "jsp",
            "java",
            "asp",
            "aspx",
            "php4",
            "php5",
            "php6",
            "php7",
            "php3",
          ];
          let found = name_array.some((r) => restricted_array.indexOf(r) >= 0);
          if (found == false) {
            if (fileInput.size < 5000000) {
              return { valid: true, insize: true };
            } else {
              return { valid: false, insize: false };
            }
          } else {
            return { valid: false, insize: true };
          }
        } else {
          return { valid: false, insize: true };
        }
      } else {
        return { valid: false, insize: true };
      }
    } else {
      return { valid: false, insize: true };
    }
  }

  getVideoValidation(fileInputs) {
    let fileInput = fileInputs;
    let imageType = fileInput.type;
    if (imageType == "video/mp4") {
      let extn = fileInput.name.split(".").pop();
      if (extn == "mp4") {
        let name_array = fileInput.name.split(".");
        let restricted_array = [
          "php",
          "py",
          "sh",
          "exe",
          "bat",
          "batch",
          "htaccess",
          "js",
          "jsp",
          "java",
          "asp",
          "aspx",
          "php4",
          "php5",
          "php6",
          "php7",
          "php3",
        ];
        let found = name_array.some((r) => restricted_array.indexOf(r) >= 0);
        if (found == false) {
          if (fileInput.size < 10000000) {
            return { valid: true, insize: true };
          } else {
            return { valid: false, insize: false };
          }
        } else {
          return { valid: false, insize: true };
        }
      } else {
        return { valid: false, insize: true };
      }
    } else {
      return { valid: false, insize: true };
    }
  }

  getExcellValidation(fileInputs) {
    let fileInput = fileInputs;
    //  let imageType=fileInput.type;
    // if(imageType=='image/png'||imageType=='image/jpg'||imageType=='image/jpeg'){
    let extn = fileInput.name.split(".").pop();
    if (extn == "xlsx" || extn == "xls") {
      let name_array = fileInput.name.split(".");
      let restricted_array = [
        "php",
        "py",
        "sh",
        "exe",
        "bat",
        "batch",
        "htaccess",
        "js",
        "jsp",
        "java",
        "asp",
        "aspx",
        "php4",
        "php5",
        "php6",
        "php7",
        "php3",
      ];
      let found = name_array.some((r) => restricted_array.indexOf(r) >= 0);
      if (found == false) {
        if (fileInput.size < 1000000) {
          return { valid: true, insize: true };
        } else {
          return { valid: false, insize: false };
        }
      } else {
        return { valid: false, insize: true };
      }
    } else {
      return { valid: false, insize: true };
    }
    // }else{
    //   return  {"valid":false,"insize":true}
    // }
  }

  getPDFValidation(fileInputs) {
    let fileInput = fileInputs;
    //  let imageType=fileInput.type;
    // if(imageType=='image/png'||imageType=='image/jpg'||imageType=='image/jpeg'){
    let extn = fileInput.name.split(".").pop();
    if (extn == "pdf") {
      let name_array = fileInput.name.split(".");
      let restricted_array = [
        "php",
        "py",
        "sh",
        "exe",
        "bat",
        "batch",
        "htaccess",
        "js",
        "jsp",
        "java",
        "asp",
        "aspx",
        "php4",
        "php5",
        "php6",
        "php7",
        "php3",
      ];
      let found = name_array.some((r) => restricted_array.indexOf(r) >= 0);
      if (found == false) {
        if (fileInput.size < 20000000) {
          return { valid: true, insize: true };
        } else {
          return { valid: false, insize: false };
        }
      } else {
        return { valid: false, insize: true };
      }
    } else {
      return { valid: false, insize: true };
    }
    // }else{
    //   return  {"valid":false,"insize":true}
    // }
  }

  getAuditTrial(callurl, input) {
    this.loaderStatus.next({ show: true });
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            this.loaderStatus.next({ show: false });
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0),
        catchError(this.handleError)
      );
  }

  postNotifications(callurl, input) {
    this.loaderStatus.next({ show: true });
    const headers = new HttpHeaders()
      .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
      .set("Client-Id", this.clientId);

    return this._http
      .post(this.url + callurl, input, { headers, responseType: "text" })
      .pipe(
        map((result) => {
          let res = JSON.parse(result);
          if (res.tokenStatus == 1) {
            this.loaderStatus.next({ show: false });
            return res;
          } else if (res.tokenStatus == 5) {
            this.loaderStatus.next({ show: false });
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Invalid Input Data!"
            ).subscribe((result) => {});
          } else {
            AlertComponent.showAlert(
              this.dialog,
              "",
              "Session expired!"
            ).subscribe((result) => {});
            this.authenticationService.logout();
          }
        }),
        retry(0),
        catchError(this.handleError)
      );
  }
}
