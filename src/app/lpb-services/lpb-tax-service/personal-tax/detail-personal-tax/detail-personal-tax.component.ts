import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreadCrumbHelper } from '../../../../shared/utilites/breadCrumb-helper';
import {
  BT_COLUMNS,
  DECISION_COLUMNS,
  LAND_COLUMNS,
  SUBSECTION_COLUMNS, SUBSECTION_TAX_OTHER_COLUMNS
} from '../../shared/constants/columns-tax.constant';
import { ActionModel } from '../../../../shared/models/ActionModel';
import { isGDV, isKSV } from '../../../../shared/utilites/role-check';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { takeUntil, tap } from 'rxjs/operators';
import { TaxService } from '../../shared/services/tax.service';
import { ITransactionPersonal } from '../../shared/interfaces/tax.interface';
import { IError } from '../../../../shared/models/error.model';
import { CustomNotificationService } from '../../../../shared/services/custom-notification.service';
import { ETaxStatus, ETaxType } from "../../shared/constants/tax.constant";
import { MatDialog } from '@angular/material/dialog';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import * as moment from 'moment';
import { FileService } from 'src/app/shared/services/file.service';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

@Component({
  selector: 'app-detail-personal-tax',
  templateUrl: './detail-personal-tax.component.html',
  styleUrls: ['./detail-personal-tax.component.scss']
})
export class DetailPersonalTaxComponent implements OnInit {
  transaction: ITransactionPersonal;
  idTransaction: string;
  columns = [];
  subsectionColumns = [];
  btColumns = BT_COLUMNS;
  actions: ActionModel[] = [];
  taxType: string;
  config = {
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private taxService: TaxService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private notify: CustomNotificationService,
    private matdialog: MatDialog,
    private fileService: FileService,
    private formMessageService: FormMessageService,
  ) {
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán dịch vụ thuế',
      'Thuế cá nhân',
      'Chi tiết'
    ]);
    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          if (!params.id) {
            this.router.navigate(['/tax-service/personal-tax']);
          }
          this.idTransaction = params.id;
          this.getDetail();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  handleActions(): void {
    this.actions = isKSV() ? this.handlerActionsKSV()
      : isGDV() ? this.handlerActionsGDV() : [];
    this.cdr.detectChanges();
  }

  handlerActionsKSV(): ActionModel[] {
    let actions: ActionModel[] = [];
    if (this.transaction.status === 'IN_PROCESS' && this.transaction.tctStatus === 'IN_PROCESS' && this.transaction.kbnnStatus === 'IN_PROCESS') {
      actions = [
        {
          actionName: 'Từ chối',
          actionIcon: 'cancel',
          actionClick: () => this.onReject()
        },
        {
          actionName: 'Duyệt giao dịch',
          actionIcon: 'check',
          actionClick: () => this.onApprove()
        },
      ];
    } else if (this.transaction.status === 'REVERT_IN_PROCESS' && this.transaction.tctStatus === 'FAIL' && this.transaction.kbnnStatus === 'FAIL' && this.transaction.accountingStatus === 'REVERT_IN_PROCESS' ) {
      actions = [
        {
          actionName: 'Từ chối reverse',
          actionIcon: 'cancel',
          actionClick: () => this.onRejectReverse()
        },
        {
          actionName: 'Duyệt giao dịch reverse',
          actionIcon: 'check',
          actionClick: () => this.onApproveReverse()
        },
      ];
    } else if (this.transaction.accountingStatus === 'ERROR' && this.transaction.status === 'APPROVE') {
      actions = [
        {
          actionName: 'Kiểm tra giao dịch nghi ngờ',
          actionIcon: 'help',
          actionClick: () => this.onCheckStatusTrans()
        }
      ]
    } else if (this.transaction.accountingStatus === 'REVERT_UNK' && this.transaction.status === 'REVERT_APPROVED') {
      actions = [
        {
          actionName: 'Kiểm tra giao dịch nghi ngờ',
          actionIcon: 'help',
          actionClick: () => this.onCheckStatusTransRevert()
        }
      ]
    } else {
      actions = []
    }
    return actions;
  }

  handlerActionsGDV(): ActionModel[] {
    const actions: ActionModel[] = [
      {
        actionName: 'In giấy nộp tiền',
        actionIcon: 'print',
        actionClick: () => this.printPaymentSlip()
      },
      {
        actionName: 'In chứng từ',
        actionIcon: 'print',
        actionClick: () => this.printDocument()
      },
      {
        actionName: 'In phiếu đề nghị thu',
        actionIcon: 'print',
        actionClick: () => this.printReceiptsRequest()
      },
    ];

    if (this.transaction) { }
    return actions;
  }

  getDetail(): void {
    this.taxService.detailTransactionPersonal(this.idTransaction).subscribe((res) => {
      this.transaction = res.data ? res.data : null;
      this.handleActions();
      this.handleInfo();
      this.cdr.detectChanges();
    }, (error: IError) => this.notify.handleErrors(error));
  }

  handleInfo(): void {
    switch (this.transaction?.taxTypeCode) {
      case ETaxType.TCT_QUERY_TND:
        this.taxType = 'Thửa đất';
        this.columns = LAND_COLUMNS;
        this.subsectionColumns = SUBSECTION_COLUMNS;
        break;
      case ETaxType.TCT_QUERY_LPTB:
        this.taxType = 'Số quyết định';
        this.columns = DECISION_COLUMNS;
        this.subsectionColumns = SUBSECTION_COLUMNS;
        break;
      case ETaxType.TCT_QUERY_TCN:
        this.taxType = '';
        this.subsectionColumns = SUBSECTION_TAX_OTHER_COLUMNS;
        console.log(this.subsectionColumns);
        break;
      default:
        break;
    }
    this.cdr.detectChanges();
  }

  onReject(): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận từ chối duyệt hóa đơn. Bạn có muốn tiếp tục?`,
        isReject: true,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          lastModifiedDate: this.transaction.lastModifiedDate,
          transactionId: this.transaction.id,
          reason: confirm
        };
        this.taxService
          .rejectTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.success(
                  'Thông báo',
                  'Từ chối duyệt giao dịch thành công'
                );
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  onApprove(): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận duyệt hóa đơn. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {
          lastModifiedDate: this.transaction.lastModifiedDate,
          transactionId: this.transaction.id
        };
        this.taxService
          .approveTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                const data = res.data;
                if (data.status !== ETaxStatus.SUCCESS) {
                  this.notify.error('Lỗi', res.data.message);
                } else {
                  this.notify.success('Thông báo', 'Duyệt giao dịch thành công');
                }
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }
  onApproveReverse() {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận duyệt revert hóa đơn. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {
          lastModifiedDate: this.transaction.lastModifiedDate,
          transactionId: this.transaction.id
        };
        this.taxService
          .approveReverseTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                if (res.data.status !== ETaxStatus.REVERT_SUCCESS) {
                  this.notify.error('Lỗi', res.data.message);
                } else {
                  this.notify.success('Thông báo', 'Duyệt revert giao dịch thành công');
                }
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  onRejectReverse() {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận từ chối duyệt revert hóa đơn. Bạn có muốn tiếp tục?`,
        isReject: true,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          lastModifiedDate: this.transaction.lastModifiedDate,
          transactionId: this.transaction.id,
          reason: confirm
        };
        this.taxService
          .rejectReverseTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.success(
                  'Thông báo',
                  'Từ chối duyệt revert giao dịch thành công'
                );
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  onCheckStatusTrans() {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận kiểm tra trạng thái hóa đơn. Bạn có muốn tiếp tục?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.taxService
          .checkStatusTransaction({id: this.transaction.id})
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.warning('Thông báo', res.data.message);
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  onCheckStatusTransRevert() {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận kiểm tra trạng thái hóa đơn revert. Bạn có muốn tiếp tục?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.taxService
          .checkStatusTranRevert({id: this.transaction.id})
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.warning('Thông báo', res.data.message);
                this.getDetail();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  printPaymentSlip(): void {
    this.fileService.downloadFileMethodGet(`tax-service/report/exportReceiptReport/${this.transaction.id}`);
  }

  printDocument(): void {
    this.fileService.downloadFileMethodGet(`tax-service/report/tranPostReport/${this.transaction.id}`);
  }

  printReceiptsRequest(): void {
    this.fileService.downloadFileMethodGet(`tax-service/report/receiptReport/${this.transaction.id}`);
  }
}
