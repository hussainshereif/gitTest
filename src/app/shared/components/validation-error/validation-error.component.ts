import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

import { ValidationService } from "../../../core/services/validation/validation.service";

@Component({
  selector: "app-validation-error",
  templateUrl: "./validation-error.component.html",
  styleUrls: ["../../../css/style.css"],
})
export class ValidationErrorComponent {
  @Input() submit: boolean;
  @Input() control: FormControl | any;
  @Input() field!: string;

  constructor(private validationService: ValidationService) {}

  get errorMsg(): string {
    const { errors } = this.control;
    if (errors == null) {
      return "";
    }

    const firstError = Object.keys(errors)[0];

    return this.validationService.getMessage(
      firstError,
      errors[firstError],
      this.field
    );
  }
}
