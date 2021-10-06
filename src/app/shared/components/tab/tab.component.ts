import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
	selector: 'app-tab',
	templateUrl: './tab.component.html',
	styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
	@Input() valueKey: string;
	@Input() displayKey: string;
	@Input() defaultActiveFirst: boolean;
	@Input() tabs: any[];
	@Output() tabChange = new EventEmitter<number | string>();
	activeTabValue: number | string;
	constructor() {}
	ngOnInit(): void {
		if (this.defaultActiveFirst) {
			this.activeTabValue = this.tabs ? this.tabs[0][this.valueKey] : null;
		}
	}

	onTabChange(value: string | number) {
		this.activeTabValue = value;
		this.tabChange.emit(value);
	}
}
