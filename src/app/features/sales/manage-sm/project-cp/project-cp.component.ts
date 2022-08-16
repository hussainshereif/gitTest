import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";

import { RemoteApisService } from "../../../../commonservice/remote-apis.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-project-cp",
  templateUrl: "./project-cp.component.html",
  styleUrls: ["./project-cp.component.css"],
})
export class ProjectCpComponent implements OnInit, OnDestroy {
  @Input("id") cpId;
  @Input() selectedProject: any;

  @Output() itemEmit = new EventEmitter();

  cpList: any = [];
  totalRecords: any;
  
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private apiService: RemoteApisService) {}

  ngOnInit(): void {
    this.getProjectCP();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectCP() {
    let url = "admin/channelPartner/" + this.cpId;
    this.apiService
      .getData(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.cpList = res.content;
        this.totalRecords = res.totalElements;
      });
  }

  onBack() {
    this.itemEmit.emit({ result: false });
  }
}
