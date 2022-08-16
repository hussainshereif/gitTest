import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";

import { AuthService } from "../commonservice/auth.service";
import { AESEncryptDecryptService } from "../commonservice/aesencrypt-decrypt.service";
import { RemoteApisService } from "../commonservice/remote-apis.service";
import { AlertComponent } from "../dialogs/alert/alert.component";
import { MatDialog } from "@angular/material/dialog";

import { BehaviorSubject, Observable, throwError } from "rxjs";
import { filter, switchMap, take, map, catchError } from "rxjs/operators";

@Injectable()
export class Interceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private remoteService: RemoteApisService,
    private _AESEncryptDecryptService: AESEncryptDecryptService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const httpsReq = request.clone({});
    return next.handle(httpsReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          let result = this._AESEncryptDecryptService.decrypt(event.body);
          const modEvent = event.clone({ body: result });
          return modEvent;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.remoteService.loaderSwitch(1);
        if (error.status == 404 || error.status == 405) {
          AlertComponent.showAlert(this.dialog, "", error.message);
          return throwError(error);
        } else if (error.status == 502) {
          AlertComponent.showAlert(this.dialog, "", "Bad Gateway");
          return throwError(error);
        } else {
          let errorRes = JSON.parse(
            this._AESEncryptDecryptService.decrypt(error.error)
          );
          if (
            errorRes.message == "The password is invalid." ||
            errorRes.message == "The OTP is invalid" ||
            errorRes.message ==
              "You are not a registered user. Please contact the super admin for access."
          ) {
          } else if (errorRes.status == "INVALID_TOKEN") {
            AlertComponent.showAlert(this.dialog, "", "Session Expired");
            this.auth.logout();
          } else if (
            error.status == 401 &&
            errorRes.status == "TOKEN_EXPIRED"
          ) {
            return this.handle401Error(httpsReq, next);
          } else {
            AlertComponent.showAlert(this.dialog, "", errorRes.message);
          }
          return throwError(errorRes);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = localStorage.getItem("refreshToken");

      if (token)
        return this.remoteService.refreshTokenFunction(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            let result = JSON.parse(token);
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("access_token", result.accessToken);
            this.refreshTokenSubject.next(result.accessToken);
            return next
              .handle(this.addTokenHeader(request, result.accessToken))
              .pipe(
                map((event: HttpEvent<any>) => {
                  if (event instanceof HttpResponse) {
                    let result = this._AESEncryptDecryptService.decrypt(
                      event.body
                    );
                    const modEvent = event.clone({ body: result });
                    return modEvent;
                  }
                }),
                catchError((err) => {
                  this.isRefreshing = false;
                  AlertComponent.showAlert(this.dialog, "", "Session Expired");
                  this.auth.logout();
                  return throwError(err);
                })
              );
          }),
          catchError((err) => {
            this.isRefreshing = false;
            AlertComponent.showAlert(this.dialog, "", "Session Expired");
            this.auth.logout();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token),
    });
  }
}
