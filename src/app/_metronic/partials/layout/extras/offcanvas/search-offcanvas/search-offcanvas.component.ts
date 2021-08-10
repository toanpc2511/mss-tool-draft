/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';

@Component({
	selector: 'app-search-offcanvas',
	templateUrl: './search-offcanvas.component.html',
	styleUrls: ['./search-offcanvas.component.scss']
})
export class SearchOffcanvasComponent implements OnInit {
	extrasSearchOffcanvasDirectionCSSClass: string;
	constructor(private layout: LayoutService) {}

	ngOnInit(): void {
		this.extrasSearchOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp(
			'extras.search.offcanvas.direction'
		)}`;
	}
}
