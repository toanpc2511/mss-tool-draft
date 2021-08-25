import { Component } from '@angular/core';

@Component({
  selector: 'app-advance-tables-widget2',
  templateUrl: './advance-tables-widget2.component.html'
})
export class AdvanceTablesWidget2Component {
  currentTab = 'Day';

  constructor() {}

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
