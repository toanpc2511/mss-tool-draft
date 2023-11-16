import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {INFO_INVOICE_QUERY, INFO_PAYMENT_TO_INTERMEDIARY} from '../../../shared/constants/electric.constant';

@Component({
  selector: 'app-transaction-completed',
  templateUrl: './transaction-completed.component.html',
  styleUrls: ['./transaction-completed.component.scss']
})
export class TransactionCompletedComponent implements OnInit {
  @Input() data: { infoInvoiceQuery: any, infoPaymentToIntermediary: any };
  infoInvoiceQueries = INFO_INVOICE_QUERY;
  infoPaymentToIntermediaries = INFO_PAYMENT_TO_INTERMEDIARY;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  async viewDetail(): Promise<any> {
    await this.router.navigate([`/electric-service/pay-at-file/detail`], {queryParams: {id: this.data?.infoPaymentToIntermediary.id}});
  }

}
