import { Component, OnInit } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {}

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: ` <mat-nav-list>
    <mat-list-item routerLink="/" (click)="openLink($event)"
      >Dashboard</mat-list-item
    >
    <mat-list-item routerLink="/calendar" (click)="openLink($event)"
      >Calendar</mat-list-item
    >
    <mat-list-item routerLink="/template" (click)="openLink($event)"
      >Template</mat-list-item
    >
  </mat-nav-list>`,
  imports: [MatListModule, RouterModule],
  standalone: true,
})
export class BottomSheetOverviewExampleSheet {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
