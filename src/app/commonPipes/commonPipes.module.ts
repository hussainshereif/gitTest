import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AppUsageDatePipe } from "./app-usage-date.pipe";
import { NullValuesConverterPipe } from "./null-values-converter.pipe";

@NgModule({
  declarations: [AppUsageDatePipe, NullValuesConverterPipe],
  imports: [CommonModule],
  exports: [AppUsageDatePipe, NullValuesConverterPipe],
})
export class CommonPipesModule {}
