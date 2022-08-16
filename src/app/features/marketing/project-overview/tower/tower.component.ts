import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { AddTowerComponent } from "../../../../dialogs/add-tower/add-tower.component";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-tower",
  templateUrl: "./tower.component.html",
  styleUrls: ["../../../../css/style.css"],
})
export class TowerComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addTowers(): void {
    let dialogRef = this.dialog.open(AddTowerComponent, {
      width: "400px",
      data: {
        type: 1,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
