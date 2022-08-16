import { Injectable } from "@angular/core";
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

import { FormErrors } from "../../../shared/configs/form-errors.config";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  readonly atleastOneCharacterRegex = /\S+/;
  readonly contactNumberRegex = /^\d{10}$/;
  readonly emailRegex = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
  readonly nameRegex = /^[a-zA-Z _.'-]*$/;
  readonly numberRegex = /^\d+$/;
  readonly onlyAlphabetsRegex = /^[a-zA-Z _'-]*$/;
  readonly passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+_~]).{6,}$/;
  readonly pincodeRegex = /^[0-9]\d{5}$/;
  readonly salaryRangeRegex = /^[1-9]+\d*(-[1-9]+\d*)?$/;
  readonly specialCharacterRegex = /^[a-zA-Z0-9 /()_.@:-]*$/;
  readonly specialCharacterTextareaRegex = /^[a-zA-Z0-9\n /()_.@:-]*$/;
  readonly urlRegex =
    /(?:https?:\/\/|www\.)([a-z0-9-]+\.)+[a-z]{2,4}(\.[a-z]{2,4})*(\/[^ ]+)*/i;

  getMessage(errorName: string, errorValue: any, fieldName: string): string {
    const errorMessages: Record<string, string> = {
      [FormErrors.badgePointOrder]: `Invalid badge points order`,
      [FormErrors.contactNumber]: `${fieldName} should contain 10 digits`,
      [FormErrors.maxLength]: `Maximum ${errorValue.requiredLength} characters allowed`,
      [FormErrors.max]: `${fieldName} should be upto ${errorValue.max}`,
      [FormErrors.min]: `${fieldName} should be atleast ${errorValue.requiredLength}`,
      [FormErrors.onlyAlphabets]: `${fieldName} field is invalid`,
      [FormErrors.password]: ``,
      [FormErrors.pattern]: `${fieldName} format is invalid`,
      [FormErrors.pincode]: `${fieldName} should contain 6 digits`,
      [FormErrors.required]: `${fieldName} is required`,
      [FormErrors.responseError]: `${errorValue}`,
      [FormErrors.uploadType]: `Invalid file type`,
      [FormErrors.totalCountMismatch]: `Total count is invalid`,
    };

    return errorMessages[errorName];
  }
}
