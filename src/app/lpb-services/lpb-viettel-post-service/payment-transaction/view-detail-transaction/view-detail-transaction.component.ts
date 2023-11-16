import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';

import {ActivatedRoute} from '@angular/router';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {VietlottService} from '../../../lpb-vietlott-service/shared/services/vietlott.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FileService} from '../../../../shared/services/file.service';
import {REPORT_PHT} from '../../shared/constants/url.viettel-post.service';
import {ITransaction, ITransactionPost} from '../../shared/models/viettel-post.interface';
import {ViettelPostService} from '../../shared/services/viettelpost.service';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import {takeUntil} from 'rxjs/operators';
import {TransactionInfoComponent} from '../../shared/components/transaction-info/transaction-info.component';
import {
  BILL_TABLE_VIETTEL_POST,
  TRANSACTION_POST_DETAIL,
  VALUE_CODES
} from '../../shared/constants/viettel-post.constant';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {ILpbDialog, LpbDialogService} from '../../../../shared/services/lpb-dialog.service';
import {ClhcAtmUpload} from '../../../lpb-kpi-service/shared/models/clhc-atm-upload';
import {ConfirmApprovalRequest} from '../../shared/models/ConfirmApprovalRequest';
import {HTTPMethod} from '../../../../shared/constants/http-method';
import {NotificationService} from '../../../../_toast/notification_service';
import {IError} from '../../../../shared/models/error.model';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'view-detail-transaction',
  templateUrl: './view-detail-transaction.component.html',
  styleUrls: ['./view-detail-transaction.component.scss'],
  providers: [DestroyService]
})
export class ViewDetailTransactionComponent implements OnInit {
  columnTrans: LpbDatatableColumn [] = BILL_TABLE_VIETTEL_POST;
  columnPost: LpbDatatableColumn [] = TRANSACTION_POST_DETAIL;
  dataTrans: any [] = [];
  dataTransPost: ITransactionPost [] = [];
  transaction: ITransaction;
  idTrans: string;
  isInProcess = true;
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
  dataBill: any [] = [];
  actions: ActionModel[] = [
    { actionName: 'Duyệt', actionIcon: 'check', actionClick: () => this.onApprove()},
    { actionName: 'Từ chối duyệt', actionIcon: 'cancel', actionClick: () => this.onReject()},
    { actionName: 'Gạch nợ bổ sung', actionIcon: 'check', actionClick: () => this.onSettleBill() },
    { actionName: 'Kiểm tra nghi ngờ', actionIcon: 'check', actionClick: () => this.onCheck() }
  ];
  @ViewChild('transactionInfo') transactionInfo: TransactionInfoComponent;

  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private viettelPostService: ViettelPostService,
    private matDialog: MatDialog,
    private notify: CustomNotificationService,
    private fileService: FileService,
    private dialogService: LpbDialogService,
    private notificationService: NotificationService,
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

  getDetailTrans(): void {
    this.viettelPostService.getBillDetail(this.idTrans)
      .subscribe((res) => {
        if (res.data) {
          this.transaction = ({
            ...res.data
          });
          this.dataTrans = [{
            billCode: this.transaction.billCode,
            custId: this.transaction.staffId,
            custName: this.transaction.staffName,
            billDesc: this.transaction.billDesc,
            billAmount: this.transaction.billAmount,
          }];
          this.dataTransPost = this.transaction.transactionPostResponses;
          this.dataTransPost = this.dataTransPost.map((item) => ({
            ...item,
            tranNo: this.transaction.tranNo,
          }));
          this.setHiddenButtons(this.transaction);
          this.transactionInfo.pathValueForm(this.transaction);
        }
      });
  }



  // tslint:disable-next-line:typedef
  private onApprove() {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn duyệt giao dịch này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };
    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      urls = 'transaction/approve';
      params = new ConfirmApprovalRequest();
      params.transactionId = this.idTrans;
      this.viettelPostService.callApiTransaction(urls, params).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res) {
          res.data.approves.htStatus === 'SUCCESS'
            ? this.notify.success('Thông báo', `Duyệt giao dịch thành công - ${res.data.approves.message}`)
            : this.notify.error('Thông báo', `${res.data.approves.message}` );
          this.matDialog.closeAll();
          this.getDetailTrans();
        }
      }, (error: IError) => this.notify.handleErrors(error));
    });
  }

  // tslint:disable-next-line:typedef
  private onReject() {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn từ chối giao dịch này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };
    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      urls = 'transaction/reject';
      params = new ConfirmApprovalRequest();
      params.transactionId = this.idTrans;
      this.viettelPostService.callApiTransaction(urls, params).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res) {
          res.data.message === 'SUCCESS'
            ? this.notify.success('Thông báo', `Từ chối giao dịch thành công`) :
            this.notify.error('Thông báo', `Từ chối giao dịch thất bại`);
          this.matDialog.closeAll();
          this.getDetailTrans();
        }
      }, (error: IError) => this.notify.handleErrors(error));
    });
  }

  // tslint:disable-next-line:typedef
  private onSettleBill() {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn gạch nợ bổ sung giao dịch này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };
    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      urls = 'transaction/approve-change-debt';
      params = new ConfirmApprovalRequest();
      params.transactionId = this.idTrans;
      this.viettelPostService.callApiTransaction(urls, params).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res) {
          res.data.changeDebtStatus === 'SUCCESS'
            ? this.notify.success('Thông báo', `Gạch nợ bổ sung giao dịch thành công`)
          : this.notify.error('Thông báo', `Gạch nợ bổ sung giao dịch thất bại | ${res.data.tranDesc}`);
          this.matDialog.closeAll();
          this.getDetailTrans();
        }
      }, (error: IError) => this.notify.handleErrors(error));
    });

  }

  // tslint:disable-next-line:typedef
  private onCheck() {
    const dialogParams: ILpbDialog = {
      messages: ['Kiểm tra giao dịch này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };
    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      urls = 'transaction/check';
      params = new ConfirmApprovalRequest();
      params.transactionId = this.idTrans;
      this.viettelPostService.callApiTransaction(urls, params).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res) {
          res.data.htStatus === 'SUCCESS'
            ? this.notify.success('Thông báo', `${res.data.message}`)
          : (res.data.htStatus === 'TIMEOUT' ?
              this.notify.success('Thông báo', `${res.data.message}`) : this.notify.error('Thông báo', `${res.data.message}`));
          this.matDialog.closeAll();
          this.getDetailTrans();
        }
      }, (error: IError) => this.notify.handleErrors(error));
    });
  }

  setHiddenButtons(data: ITransaction): void {
    console.log('statusCheck123', data.statusCheck);
    switch (data.statusCheck) {
      case 'SUCCESS':
        this.actions = [
        ];
        this.hiddenButtons = [{
          actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
          hiddenType: 'disable',
        },
          {
            actionCode: VALUE_CODES.ACTIONCODE_REJECT,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_SETTLE_BILL,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_CHECK,
            hiddenType: 'disable',
          }];
        break;
      case 'FAIL':
        this.actions = [
        ];
        this.hiddenButtons = [{
          actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
          hiddenType: 'disable',
        },
          {
            actionCode: VALUE_CODES.ACTIONCODE_REJECT,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_SETTLE_BILL,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_CHECK,
            hiddenType: 'disable',
          }];
        break;
      case 'IN_PROCESS':
        this.actions = [
          {
            actionName: 'Phê Duyệt',
            actionIcon: 'save',
            actionClick: () => this.onApprove()
          },
          {
            actionName: 'Từ Chối Duyệt',
            actionIcon: 'cancel',
            actionClick: () => this.onReject()
          }
        ];
        this.hiddenButtons = [{
          actionCode: VALUE_CODES.ACTIONCODE_CHECK,
          hiddenType: 'disable',
        },
          {
            actionCode: VALUE_CODES.ACTIONCODE_SETTLE_BILL,
            hiddenType: 'disable',
          }];
        break;
      case 'TIMEOUT':
        this.actions = [
          {
            actionName: 'Kiểm Tra Giao Dịch ',
            actionIcon: 'save',
            actionClick: () => this.onCheck()
          },
        ];
        this.hiddenButtons = [{
          actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
          hiddenType: 'disable',
        },
          {
            actionCode: VALUE_CODES.ACTIONCODE_REJECT,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_SETTLE_BILL,
            hiddenType: 'disable',
          }];
        break;
      case 'GNBS':
        this.actions = [
          {
            actionName: 'Duyệt Tăng Hạn Mức Bổ Sung',
            actionIcon: 'check',
            actionClick: () => this.onSettleBill()
          },
        ];
        this.hiddenButtons = [{
          actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
          hiddenType: 'disable',
        },
          {
            actionCode: VALUE_CODES.ACTIONCODE_REJECT,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_CHECK,
            hiddenType: 'disable',
          }];
        break;
    }
  }
}
