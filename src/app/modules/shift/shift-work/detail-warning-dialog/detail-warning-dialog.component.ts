import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-detail-warning-dialog',
	templateUrl: './detail-warning-dialog.component.html',
	styleUrls: ['./detail-warning-dialog.component.scss']
})
export class DetailWarningDialogComponent implements OnInit {
	@Input() currentDate: string;
	constructor(public modal: NgbActiveModal) {}

	ngOnInit(): void {}
}
