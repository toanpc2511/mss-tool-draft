import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { CustomNotificationService } from './../../../../shared/services/custom-notification.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { DestroyService } from './../../../../shared/services/destroy.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { PaymentInfoComponent } from '../../shared/components/payment-info/payment-info.component';
import { ITransaction } from '../../shared/models/water.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import {
  COLUMNS_ACCOUNTING,
  COLUMNS_BILLS, EStatusTransaction,
  STATUS_APPROVE_TRANSACTION_SUCCESS
} from '../../shared/constants/water.constant';
import {isGDV, isHoiSo, isKSV} from 'src/app/shared/utilites/role-check';
import { FileService } from 'src/app/shared/services/file.service';
declare const $: any;

@Component({
  selector: 'app-water-view-transaction',
  templateUrl: './water-view-transaction.component.html',
  styleUrls: ['./water-view-transaction.component.scss'],
  providers: [DestroyService]
})
export class WaterViewTransactionComponent implements OnInit, OnDestroy {
  @Input() idTrans?: string;
  rootData: ITransaction;
  isLoading = false;
  id: string = '';
  value = 50;
  mode = 'indeterminate';
  color = 'primary';
  type = "";
  //
  dataSource: any[] = [];
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true
  };

  columns = COLUMNS_BILLS;

  dataSource2: any[] = [];
  columns2 = COLUMNS_ACCOUNTING;
  title = '';
  //
  @ViewChild("paymentInfo") paymentInfo: PaymentInfoComponent;

  actions: ActionModel[] = [];
  //
  constructor(public matdialog: MatDialog, private handleErrorService: HandleErrorService,
    private waterService: WaterService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private destroy$: DestroyService, private notifiService: CustomNotificationService, private fileService: FileService
  ) { }

  ngOnInit() {
    this.setInit();
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tại quầy / Xem chi tiết giao dịch');
  }

  ngOnChanges(): void {
    if (this.idTrans) {
      this.waterService.getDetailTransaction(this.idTrans).subscribe((res) => {
        if (res.data) {
          this.rootData = res.data;
          this.handleData();
        }
      })
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("waterDataRow");
  }

  async setInit() {
    let id = this.route.snapshot.queryParamMap.get("id");
    let type = this.route.snapshot.queryParamMap.get("type");
    if (type) {
      this.type = type;
    }
    if (!id) {
      let data = sessionStorage.getItem("waterDataRow");
      if (data) {
        this.rootData = JSON.parse(data);
        this.handleData();
      }
      return;
    }
    this.isLoading = true;
    this.id = id;
    await this.waterService.getDetailTransaction(id).toPromise().then(async res => {
      this.rootData = res["data"];
      this.handleData();
    }).catch(err => {
      this.handleErrorService.handleError(err)
    }).finally(() => {
      this.isLoading = false;
    })
  }

  handleData() {
    this.handleActions(this.rootData);
    let dataSource = this.rootData["tranDetailResponses"];
    this.dataSource = dataSource.map(x => {
      return { ...x, billPeriod: `Tháng ${x.billId}/${x.billCode}`, custName: this.rootData.customerName, custDesc: this.rootData.customerAddress }
    })
    let dataSource2 = this.rootData["tranPostResponses"];
    this.dataSource2 = dataSource2.map(x => {
      return { ...x, transNo: this.rootData.transNo }
    })
    setTimeout(() => {
      this.paymentInfo.setValueForm(this.rootData, "view");
    });
  }

  handleActions(transaction: ITransaction) {
    this.title = 'Chi tiết giao dịch';
    if (isGDV() || !this.id) {
      this.actions = [
        {
          actionName: "In phiếu thu tiền",
          actionIcon: "print",
          actionClick: () => this.printReceiptVoucher()
        },
        {
          actionName: "In phiếu hạch toán",
          actionIcon: "print",
          actionClick: () => this.printAccountingNote()
        },
      ]
      if (this.rootData.paymentTypeCode === "CK") {
        this.actions.push({
          actionName: "In giấy báo nợ",
          actionIcon: "print",
          actionClick: () => this.printDebitNote()
        })
      }
      return;
    }

    if (isKSV() && transaction.statusCode === 'IN_PROCESS' && transaction.accountingStatusCode === 'IN_PROCESS' && this.id) {
      this.actions = [
        {
          actionName: "Duyệt giao dịch",
          actionIcon: "check",
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmApprove()
        },
        {
          actionName: "Từ chối duyệt",
          actionIcon: "cancel",
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmRejectApprove()
        },
      ]
    } else if (transaction.statusCode === 'APPROVE' && transaction.accountingStatusCode === 'ERROR' && this.id) {
      this.title = 'Kiểm tra giao dịch nghi ngờ';
      this.actions = [
        {
          actionName: "Kiểm tra trạng thái",
          actionIcon: "help",
          actionClick: () => this.onCheckStatusTrans()
        },
      ]
    } else {
      this.actions = []
    }

  }

  printReceiptVoucher() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`water-service/report/bill/${id}`);
  }

  printDebitNote() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`water-service/report/debt/${id}`);
  }

  printAccountingNote() {
    let id = this.rootData.id;
    this.fileService.downloadFileMethodGet(`water-service/report/tranPost/${id}`);
  }

  otherTransaction() {
    this.router.navigate(["/water-service/pay-at-counter/create"]);
  }

  onConfirmApprove() {
    if (this.isLoading) return;
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận duyệt hóa đơn. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {
          confirmRequests: [
            {
              transactionId: this.rootData.id,
              lastModifiedDate: this.rootData.lastModifiedDate,
            },
          ],
        };
        this.waterService
          .approveTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                const statusTrans = res.data.approves[0];
                if (statusTrans.status !== STATUS_APPROVE_TRANSACTION_SUCCESS) {
                  this.notifiService.error('Lỗi', statusTrans.message ? statusTrans.message : 'Gạch nợ thất bại');
                } else {
                  this.notifiService.success('Thông báo', 'Duyệt giao dịch thành công');
                }
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  onConfirmRejectApprove() {
    if (this.isLoading) return;
    this.isLoading = true;
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
          rejectTransList: [
            {
              transactionId: this.rootData.id,
              lastModifiedDate: this.rootData.lastModifiedDate,
            },
          ],
          reason: confirm
        };
        this.waterService
          .rejectTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                const statusTrans = res.data.rejectTransList[0];

                if (!statusTrans.reject) {
                  this.notifiService.error('Lỗi', statusTrans.message);
                } else {
                  this.notifiService.success(
                    'Thông báo',
                    'Từ chối duyệt giao dịch thành công'
                  );
                }
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  onCheckStatusTrans(): void {
    const body = {
      id: this.rootData.id,
    };
    this.waterService
      .checkStatusTran(body)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (res) => {
          if (res.data) {
            if (res.data.changeDebtResponses) {
              this.handleDataCheckStatusTran(res.data.changeDebtResponses);
            } else {
              this.notifiService.error('Lỗi', res.data.message);
            }
            this.setInit();
          }
        },
        (error: IError) => this.checkError(error)
      );
  }

  handleDataCheckStatusTran(data: any): void {
    const totalSuccess = data.filter((item) => item.status === EStatusTransaction.SUCCESS).length;
    const totalFail = data.filter((item) => item.status === EStatusTransaction.FAIL).length;
    const totalError = data.filter((item) => item.status === EStatusTransaction.ERROR).length;
    console.log(totalError, totalFail, totalSuccess);

    if ( totalError === 0 && totalFail === 0 ) {
      this.notifiService.success('Thông báo', 'Hạch toán thành công - Gạch nợ thành công');
    } else {
      this.notifiService.warning('Thông báo', `Hạch toán thành công - Gạch nợ: thành công ${totalSuccess} hóa đơn, thất bại ${totalFail} hóa đơn, không xác định ${totalError} hóa đơn`);
    }
  }

  checkError(error: IError) {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message)
    } else {
      this.notifiService.error('Lỗi', 'Lỗi hệ thống, vui lòng thử lại sau!')
    }

  }
}
