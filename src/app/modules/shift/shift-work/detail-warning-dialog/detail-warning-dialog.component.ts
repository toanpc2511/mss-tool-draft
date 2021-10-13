import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShiftData } from '../shift-work.component';

@Component({
	selector: 'app-detail-warning-dialog',
	templateUrl: './detail-warning-dialog.component.html',
	styleUrls: ['./detail-warning-dialog.component.scss']
})
export class DetailWarningDialogComponent implements OnInit {
	@Input() shiftDatas: ShiftData[];
	@Input() currentDate: string;
	constructor(public modal: NgbActiveModal) {}

	ngOnInit(): void {
		console.log(this.shiftDatas);
	}
}
