import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {
  LIST_STATUS, LIST_STATUS_RETRY,
  TRANSACTION_DETAIL,
  TRANSACTION_POST_DETAIL,
  VALUE_CODES
} from '../../shared/constants/vietlott.constant';
import {TransactionInfoComponent} from '../../shared/components/transaction-info/transaction-info.component';
import {ITransaction, ITransactionPost} from '../../shared/models/vietlott.interface';
import {ActivatedRoute} from '@angular/router';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {VietlottService} from '../../shared/services/vietlott.service';
import {takeUntil} from 'rxjs/operators';
import {
  CustomConfirmDialogComponent
} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {IError} from '../../../../shared/models/error.model';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {REPORT_PCT, REPORT_PTT} from '../../shared/constants/url.vietlott.service';
import {FileService} from '../../../../shared/services/file.service';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {HandleErrorService} from '../../../../shared/services/handleError.service';
import {isGDV, isKSV} from '../../../../shared/utilites/role-check';
import {FormMessageComponent} from '../../../lpb-tuition-service/shared/components/form-message/form-message.component';

@Component({
  selector: 'app-recharge-detail',
  templateUrl: './recharge-detail.component.html',
  styleUrls: ['./recharge-detail.component.scss'],
  providers: [DestroyService]
})
export class RechargeDetailComponent implements OnInit {
  columnTrans: LpbDatatableColumn [] = TRANSACTION_DETAIL;
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
  actions: ActionModel[];
  @ViewChild('transactionInfo') transactionInfo: TransactionInfoComponent;

  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private vietlottService: VietlottService,
    private matDialog: MatDialog,
    private notify: CustomNotificationService,
    private fileService: FileService,
    private handleErrorService: HandleErrorService,
    private matdialog: MatDialog,
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
    // console.log('isKSV-- ', this.isKSV);
  }

  getDetailTrans(): void {
    this.vietlottService.getTransDetail(this.idTrans)
      .subscribe((res) => {
        if (res.data) {
          this.transaction = ({
            ...res.data
          });
          this.dataTrans = [{
            posName: this.transaction.posName,
            posAddress: this.transaction.posAddress,
            amount: this.transaction.amount,
            trnDesc: this.transaction.trnDesc,
            htStatusName: this.transaction.htStatusName,
            recordStatusName: this.transaction.recordStatusName,
          }];
          this.dataTransPost = this.transaction.transactionPostResponses;
          this.dataTransPost = this.dataTransPost.map((item) => ({
            ...item,
            transToVietlott: this.transaction.transToVietlott,
          }));
          this.transactionInfo.pathValueForm(this.transaction);
          this.setHiddenButtons(this.transaction);
        }
      });

  }

  approveTrans(): void {
    if (!this.idTrans) {
      return;
    }
    console.log('Approve idTrans:', this.idTrans);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Duyệt giao dịch nạp tiền. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.approveTrans(this.idTrans).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            (res.data.errorCode === '00' && res.data.refCode === '00')
              ? this.notify.success('Thông báo', `Duyệt giao dịch thành công`)
              : (res.data.errorCode !== '00' && (res.data.refCode === 'ERR-90' || res.data.refCode === 'ERR-99')) ? this.notify.error('Duyệt giao dịch Time Out', `${res.data.errorDesc} - ${res.data.refDesc}`) : this.notify.error('Duyệt giao dịch thất bại', `${res.data.errorDesc} - ${res.data.refDesc}`);
            this.matDialog.closeAll();
            this.getDetailTrans();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  rejectTrans(): void {
    if (!this.idTrans) {
      return;
    }
    console.log('Reject idTrans:', this.idTrans);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Từ chối giao dịch nạp tiền. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.rejectTrans(this.idTrans).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.errorDesc === 'ERROR'
              ? this.notify.error('Thông báo', `Duyệt giao dịch thất bại | ${res.data.msgStat}`)
              : this.notify.success('Thông báo', `Từ chối giao dịch thành công`);
            this.matDialog.closeAll();
            this.getDetailTrans();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  setHiddenButtons(data: ITransaction): void {
    this.actions = [];
    if (isGDV()) {
      if (data.recordStatus === 'IN_PROCESS' && data.htStatus === 'IN_PROCESS') {
        this.isInProcess = true;
      } else {
        if (data.recordStatus === 'APPROVE' && data.htStatus === 'SUCCESS' && data.gnStatus === 'FAIL') {
          this.actions = [
            {
              actionName: 'Tăng hạn mức bổ sung',
              actionIcon: 'save',
              actionClick: () => this.transRetry()
            }
          ];
        }
      }
    }
    if (isKSV()) {
      // GD da duyet
      if (data.recordStatus !== 'IN_PROCESS') {
        this.hiddenButtons = [
          {
            actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_REJECT,
            hiddenType: 'disable',
          },
          {
            actionCode: VALUE_CODES.ACTIONCODE_IN_CT,
            hiddenType: 'disable',
          }];
        if (data.recordStatus === 'APPROVE' && (data.htStatus === 'SUCCESS' || 'ERROR') && data.gnStatus === 'ERROR' && data.numRetryTimeout === 0) {
          this.actions = [
            {
              actionName: 'Kiểm tra GD nghi ngờ',
              actionIcon: 'check',
              actionClick: () => this.checkTrans()
            }
          ];
        } else {
          // Gd cho duyet tang han muc
          if (data.recordStatus === 'APPROVE' && data.htStatus === 'SUCCESS' && data.gnStatus === 'IN_PROCESS') {
            this.actions = [
              {
                actionName: 'Duyệt tăng hạn mức bổ sung',
                actionIcon: 'save',
                actionClick: () => this.approveRetryTrans()
              },
              {
                actionName: 'Từ chối tăng hạn mức bổ sung',
                actionIcon: 'cancel',
                actionClick: () => this.rejectRetryTrans()
              }
            ];
            this.hiddenButtons = [
              {
                actionCode: VALUE_CODES.ACTIONCODE_APPROVE,
                hiddenType: 'disable',
              },
              {
                actionCode: VALUE_CODES.ACTIONCODE_REJECT,
                hiddenType: 'disable',
              },
              {
                actionCode: VALUE_CODES.ACTIONCODE_IN_CT,
                hiddenType: 'disable',
              }];
          }
        }
      }
    }
  }

  onPrintPTT(): void {
    if (!this.idTrans) {
      return;
    }
    const url = `${REPORT_PTT}/${this.idTrans}`;
    this.fileService.downloadFileMethodGet(url);
  }

  onPrintPCT(): void {
    if (!this.idTrans) {
      return;
    }
    const url = `${REPORT_PCT}/${this.idTrans}`;
    this.fileService.downloadFileMethodGet(url);
  }

// Duyet GD tang han muc bo sung KSV
  approveRetryTrans(): void {
    if (!this.idTrans) {
      return;
    }
    console.log('Approve_Retry idTrans:', this.idTrans);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Duyệt giao dịch tăng hạn mức bổ sung. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.approveTrans_Retry(this.idTrans).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.errorCode === 'FAIL'
              ? this.notify.error('Thông báo thất bại', res.data.errorDesc)
              : this.notify.success('Thông báo', `Tăng hạn mức bổ sung thành công`);
            this.matDialog.closeAll();
            this.getDetailTrans();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

// Tu choi GD tang han muc bo sung KSV
  rejectRetryTrans(): void {
    if (!this.idTrans) {
      return;
    }
    console.log('Reject_Retry idTrans:', this.idTrans);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Từ chối giao dịch tăng hạn mức bổ sung. Bạn có muốn tiếp tục ?`,
      },
    });
    const body = {
      statusTopUpLimit: [{
        transactionId: this.idTrans,
      }],
      status: 'REJECT',
      htStatus: 'SUCCESS',
      gnStatus: 'CANCEL'
    };
    console.log('body', body);
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.changeDebts(body).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.message === 'SUCCESS'
              ? this.notify.success('Thông báo', `Từ chối tăng hạn mức bổ sung thành công`)
              : this.notify.error('Thông báo', `Từ chối tăng hạn mức bổ sung thất bại`);
            this.matDialog.closeAll();
            this.getDetailTrans();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  // goi tang han muc bo sung cho GDV
  transRetry(): void {
    if (!this.idTrans) {
      return;
    }
    console.log('Retry idTrans:', this.idTrans);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Tạo giao dịch tăng hạn mức bổ sung. Bạn có muốn tiếp tục ?`,
      },
    });
    const body = {
      statusTopUpLimit: [{
        transactionId: this.idTrans,
      }],
      status: 'APPROVE',
      htStatus: 'SUCCESS',
      gnStatus: 'IN_PROCESS',
      numSettleBill: 1
    };
    console.log('body--', body);
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.changeDebts(body).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.message === 'SUCCESS'
              ? this.notify.success('Thông báo', `Tạo tăng hạn mức bổ sung giao dịch thành công`)
              : this.notify.error('Thông báo', `Tạo tăng hạn mức bổ sung giao dịch thất bại`);
            this.matDialog.closeAll();
            this.getDetailTrans();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  checkTrans(): void {
    if (!this.idTrans) {
      return;
    }
    if (this.transaction.numRetryTimeout >= 1) {
      this.notify.error('Cảnh báo', 'Giao dịch đã thực hiện kiểm tra 1 lần, trạng thái không xác định. Vui lòng liên hệ ID để hỗ trợ !');
      return;
    }
    this.vietlottService.getTransCheck(this.idTrans).subscribe((res) => {
      if (res.data) {
        this.openMessage(res.data);
      }
      this.matDialog.closeAll();
      this.getDetailTrans();
    }, (error: IError) => this.notify.handleErrors(error));
  }

  openMessage(data): void {
    const htStatus = data.coreStatus === 'Y' ? 'Hạch toán thành công' : 'Hạch toán thất bại';
    const gnStatus = data.billStatus === 'T' ? 'Tăng hạn mức không xác định. Vui lòng liên hệ ITSupport hỗ trợ !' : (data.billStatus === 'Y' ? ' Tăng hạn mức thành công' : 'Tăng hạn mức thất bại');
    if (data.coreStatus === 'Y' && data.billStatus === 'Y') {
      this.notify.success('Trạng thái giao dịch', htStatus + ' - ' + gnStatus);
    } else {
      this.notify.error('Trạng thái giao dịch', htStatus + ' - ' + gnStatus);
    }
  }
}
