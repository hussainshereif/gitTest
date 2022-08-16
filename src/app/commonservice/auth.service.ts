import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

import { JwtHelperService } from "@auth0/angular-jwt";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public router: any;
  public token: any;

  private clientId: string = environment.CLIENT_ID;
  private url: string = environment.API_URL;

  constructor(
    public dialog: MatDialog,
    public helper: JwtHelperService,
    private http: HttpClient,
    private route: Router
  ) {}

  public isLoggedin() {
    if (localStorage.getItem("access_token")) {
      return true;
    } else {
      return false;
    }
  }

  login(body: any, callUrl: string, headers: any) {
    return this.http.post(this.url + callUrl, body.toString(), {
      headers,
      responseType: "text",
    });
  }

  logout() {
    if (localStorage.getItem("access_token") != null) {
      const headers = new HttpHeaders()
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("Authorization", "Bearer " + localStorage.getItem("access_token"))
        .set("Client-Id", this.clientId);
      this.http
        .post(this.url + "login/logout", "", { headers, responseType: "text" })
        .subscribe((data) => {});
      localStorage.removeItem("access_token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("saltkey");
      localStorage.removeItem("imageUrl");
      this.route.navigate(["/login"]);
    }
  }
}
