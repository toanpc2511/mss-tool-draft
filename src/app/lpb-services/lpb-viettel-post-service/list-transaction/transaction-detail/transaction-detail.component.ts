import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {ActivatedRoute} from '@angular/router';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FileService} from '../../../../shared/services/file.service';
import {REPORT_PDNT, REPORT_PHT} from '../../shared/constants/url.viettel-post.service';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import {takeUntil} from 'rxjs/operators';
import {ViettelPostService} from '../../shared/services/viettelpost.service';
import {ITransaction, ITransactionPost} from '../../shared/models/viettel-post.interface';
import {
  BILL_TABLE_VIETTEL_POST,
  BILL_TABLE_VIETTEL_POST_DETAIL,
  TRANSACTION_POST_DETAIL
} from '../../shared/constants/viettel-post.constant';
import {TransactionInfoComponent} from '../../shared/components/transaction-info/transaction-info.component';
import {VALUE_CODES} from "../../../lpb-vietlott-service/shared/constants/vietlott.constant";

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
  providers: [DestroyService]
})
export class TransactionDetailComponent implements OnInit {
  columnBill: LpbDatatableColumn [] = BILL_TABLE_VIETTEL_POST_DETAIL;
  columnPost: LpbDatatableColumn [] = TRANSACTION_POST_DETAIL;
  dataBill: any [] = [];
  dataTransPost: ITransactionPost [] = [];
  transaction: ITransaction;
  idTrans: string;
  hiddenButtons: {
    actionCode: string;
    hiddenType: 'disable' | 'none';
  }[] = [];
  // isKSV = false;
  configs = {
    defaultSort: 'makerDt:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };
  @ViewChild('transactionInfo') transactionInfo: TransactionInfoComponent;

  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private viettelPostService: ViettelPostService,
    private matDialog: MatDialog,
    private notify: CustomNotificationService,
    private fileService: FileService,
  ) {
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Danh sách giao dịch',
      'Chi tiết giao dịch',
    ]);
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params) {
          this.idTrans = params.id;
          this.getDetailTrans();
        }
      });
  }

  setHiddenButtons(data: ITransaction): void {
    // GD cho duyet hach toan
    if (data.status === 'IN_PROCESS') {
    } else {
      this.hiddenButtons = [{
        actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
        hiddenType: 'disable',
      },
        {
          actionCode: VALUE_CODES.ACTIONCODE_REJECT,
          hiddenType: 'disable',
        }];
    }
  }

  getDetailTrans(): void {
    this.viettelPostService.getTransDetail(this.idTrans)
      .subscribe((res) => {
        if (res.data) {
          this.transaction = ({
            ...res.data
          });
          this.dataBill = [{
            billCode: this.transaction.billCode,
            staffId: this.transaction.staffId,
            staffName: this.transaction.staffName,
            trnDesc: this.transaction.trnDesc,
            billAmount: this.transaction.billAmount,
          }];
          this.dataTransPost = this.transaction.transactionPostResponses;
          this.dataTransPost = this.dataTransPost.map((item) => ({
            ...item,
            tranNo: this.transaction.tranNo,
          }));
          this.transactionInfo.pathValueForm(this.transaction);
          this.setHiddenButtons(this.transaction);
        }
      });

  }

  onPrintPHT(): void {
    if (!this.idTrans) {
      return;
    }
    const url = `${REPORT_PHT}/${this.idTrans}`;
    this.fileService.downloadFileMethodGet(url);
  }

  onPrintPDNT(): void {
    if (!this.idTrans) {
      return;
    }
    const url = `${REPORT_PDNT}/${this.idTrans}`;
    this.fileService.downloadFileMethodGet(url);
  }
}
