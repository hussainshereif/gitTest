import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "nullValuesConverter",
})
export class NullValuesConverterPipe implements PipeTransform {
  transform(value: any) {
    let result = "";
    if (value == null || value == "") {
      result = "-";
    } else {
      result = value;
    }

    return result;
  }
}
