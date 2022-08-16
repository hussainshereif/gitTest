import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-projects-overview-details",
  templateUrl: "./project-overview-details.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class ProjectsOverviewDetailsComponent implements OnInit {
  selectedtab: string;
  isConnectreClient = environment.conectreClient;
  projectId: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = +params["id"] || 0;
    });
    this.selectedtab = "tab1";
  }
}
