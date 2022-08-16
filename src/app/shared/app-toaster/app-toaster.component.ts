import { Component, OnInit, Inject } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-toaster",
  templateUrl: "./app-toaster.component.html",
  styleUrls: ["../../css/style.css"],
})
export class AppToasterComponent {
  constructor(private messageService: MessageService) {}

  ngOnInit() {}

  public static showToaster(
    messageService: MessageService,
    severity: any = "Confirmation",
    summary: string = "Are you sure ?",
    detail: string = "Yes"
  ) {
    messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}
