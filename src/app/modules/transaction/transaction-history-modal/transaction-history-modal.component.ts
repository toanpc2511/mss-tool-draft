import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITransaction } from '../transaction.service';

@Component({
	selector: 'app-transaction-history-modal',
	templateUrl: './transaction-history-modal.component.html',
	styleUrls: ['./transaction-history-modal.component.scss']
})
export class TransactionHistoryModalComponent implements OnInit {
	@Input() data: IDataTransfer;
	itemTransaction: ITransaction;

	constructor(public modal: NgbActiveModal) {}

	ngOnInit(): void {
		this.itemTransaction = this.data.transaction;
	}
}

export interface IDataTransfer {
	title: string;
	transaction: ITransaction;
}
