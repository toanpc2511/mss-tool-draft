import { WaterViewTransactionComponent } from './../water-view-transaction/water-view-transaction.component';
import { Router } from '@angular/router';
import { DestroyService } from './../../../../shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { WaterService } from './../../shared/services/water.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-view-status-transaction-approve',
  templateUrl: './view-status-transaction-approve.component.html',
  styleUrls: ['./view-status-transaction-approve.component.scss'],
  providers: [DestroyService],
})
export class ViewStatusTransactionApproveComponent implements OnInit {
  idTrans = '';
  transNo = '';
  transactions: any[];
  configStatusTb = {
    hasSelection: false,
    hasNoIndex: true,
  };

  constructor(
    private waterService: WaterService,
    private destroy$: DestroyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.waterService.transactionApproveSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if(value) {
          this.transactions = value;
          this.viewDetail(value[0]);
        }
      });

    if (this.transactions.length === 0) {
      this.router.navigate(['water-service/pay-at-counter/approve']);
    }
  }

  viewDetail(value) {
    this.idTrans = value?.transactionId;
    this.transNo = value?.transNo;
  }
}
