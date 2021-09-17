import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-transaction-history-modal',
	templateUrl: './transaction-history-modal.component.html',
	styleUrls: ['./transaction-history-modal.component.scss']
})
export class TransactionHistoryModalComponent implements OnInit {
	@Input() data: IDataTransfer;
	isData: boolean = true;

	constructor(public modal: NgbActiveModal) {}

	ngOnInit(): void {}
}

export interface IDataTransfer {
	title: string;
}
