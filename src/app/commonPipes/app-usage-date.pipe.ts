import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appUsageDate'
})
export class AppUsageDatePipe implements PipeTransform {

  transform(value:any){
    let seconds = Math.floor(value%60);
    let minutes = Math.floor((value/60)%60);
    let hours = Math.floor(value/(60*60));
    let display=hours+":"+minutes+":"+seconds;
    return display;
    
  }

}
