import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import base64url from "base64url";

@Injectable({
  providedIn: "root",
})
export class AESEncryptDecryptService {
  secretKey = "72e?5ve#7fa4*exi";
  constructor() {}

  decrypt(cipher: any) {
    let cipherText = cipher.replace(/(\r\n|\n|\r)/gm, "");
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const result = CryptoJS.AES.decrypt(cipherText, key, {
      mode: CryptoJS.mode.ECB,
    });
    let final = result.toString(CryptoJS.enc.Utf8);
    // let final=JSON.parse(result.toString(CryptoJS.enc.Utf8));
    // console.log(JSON.parse(final),"deresult");
    return final;
  }
  encrypt(cipher: any) {
    var key = CryptoJS.enc.Utf8.parse(this.secretKey);
    var result = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(cipher.toString()),
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    let final = result.toString();
    // console.log(final,"enresult");
    return final;
  }
}
