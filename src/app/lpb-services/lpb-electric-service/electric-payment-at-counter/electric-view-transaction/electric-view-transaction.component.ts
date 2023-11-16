import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { CustomNotificationService } from './../../../../shared/services/custom-notification.service';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { DestroyService } from './../../../../shared/services/destroy.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { isGDV, isKSV } from 'src/app/shared/utilites/role-check';
import { FileService } from 'src/app/shared/services/file.service';
import { ITransaction } from '../../shared/models/electric.interface';
import { COLUMNS_ACCOUNTING, COLUMNS_BILLS, EStatusSuccess, REVERT_ACCOUNTING_COLUMNS } from '../../shared/constants/electric.constant';
import { ElectricService } from '../../shared/services/electric.service';
import { FormMessageService } from 'src/app/shared/services/form-message.service';
declare const $: any;

@Component({
  selector: 'app-electric-view-transaction',
  templateUrl: './electric-view-transaction.component.html',
  styleUrls: ['./electric-view-transaction.component.scss'],
  providers: [DestroyService]
})
export class ElectricViewTransactionComponent implements OnInit, OnDestroy {
  @Input() idTrans?: string;
  rootData: ITransaction;
  isLoading = false;
  id: string = '';
  value = 50;
  mode = 'indeterminate';
  color = 'primary';
  type = "";
  creditAccountInfo
  debitAccountInfo
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
  //
  dataSource3: any[] = [];
  columns3 = REVERT_ACCOUNTING_COLUMNS;
  //

  actions: ActionModel[] = [];
  //
  constructor(public matdialog: MatDialog, private formMessageService: FormMessageService,
    private electricService: ElectricService, private route: ActivatedRoute, private router: Router,
    private destroy$: DestroyService, private notifiService: CustomNotificationService, private fileService: FileService
  ) { }

  ngOnInit() {
    this.setInit();
    $('.parentName').html('Thanh toán hóa đơn điện');
    $('.childName').html('Thanh toán tại quầy / Xem chi tiết giao dịch');
  }

  ngOnChanges(): void {
    if (this.idTrans) {
      this.electricService.getDetailTransaction(this.idTrans).subscribe((res) => {
        if (res.data) {
          this.rootData = res.data;
          this.handleData();
        }
      })
    }
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("electricDataRow");
    sessionStorage.removeItem("electricHandleType");
  }

  async setInit() {
    let id = this.route.snapshot.queryParamMap.get("id");
    let type = this.route.snapshot.queryParamMap.get("type");
    if (type) {
      this.type = type;
    }
    if (!id) {
      let data = sessionStorage.getItem("electricDataRow");
      if (data) {
        this.rootData = JSON.parse(data);
        this.handleData();
      }
      return;
    }
    this.id = id;
    await this.getDetailTransaction(id);
  }

  async getDetailTransaction(id) {
    this.isLoading = true;
    await this.electricService.getDetailTransaction(id).toPromise().then(async res => {
      this.rootData = res["data"];
      this.handleData();
    }).catch(err => {
      this.formMessageService.handleError(err)
    }).finally(() => {
      this.isLoading = false;
    })
  }

  handleData() {
    this.handleActions(this.rootData);
    if (isKSV()) {
      this.handleActionKSV(this.rootData);
    }
    let dataSource = this.rootData["billInfos"];
    this.dataSource = dataSource.map(x => {
      return { ...x, billPeriod: x.billDesc ? `Tháng ${x.billDesc}` : '--' }
    })
    const dataSource2 = this.rootData["tranPostInfos"];
    this.dataSource2 = dataSource2.map(x => { return { ...x, transNo: this.rootData.transNo, coreRefNo: this.rootData.coreRefNo } });
    this.creditAccountInfo = this.dataSource2.find(x => x.drcrType === "C");
    this.debitAccountInfo = this.dataSource2.find(x => x.drcrType === "D");
    if (["REVERT_IN_PROCESS", "REVERT_APPROVED", 'REVERT_REJECT'].includes(this.rootData["statusCode"])) {
      this.dataSource3 = this.dataSource2.map(x => {
        return { ...x, drcrTypeRevert: x.drcrType === "C" ? "D" : "C" }
      })
    }
  }

  handleActions(transaction: ITransaction) {
    if (isGDV() || !this.id) {
      const handleType = sessionStorage.getItem("electricHandleType");
      if (handleType === "revert") {
        if (["APPROVE"].includes(this.rootData["statusCode"]) && ["SUCCESS"].includes(this.rootData["changeDebtStatusCode"])) {
          this.actions = [
            {
              actionName: "Revert",
              actionIcon: "replay",
              actionClick: () => this.revert()
            },
          ]
        } else {
          this.actions = [];
        }
        return;
      }
      this.actions = [
        {
          actionName: "In phiếu thu tiền",
          actionIcon: "print",
          actionClick: () => this.printReceiptVoucher()
        },
        {
          actionName: "In biên nhận",
          actionIcon: "print",
          actionClick: () => this.printReceipt()
        }
      ]
      return;
    }
  }

  handleActionKSV(transaction: ITransaction): void {
    if (transaction.statusCode === 'IN_PROCESS' && transaction.accountingStatusCode === 'IN_PROCESS') {
      this.actions = [
        {
          actionName: 'Duyệt giao dịch',
          actionIcon: 'check',
          actionClick: () => this.onConfirmApprove()
        },
        {
          actionName: 'Từ chối duyệt',
          actionIcon: 'cancel',
          actionClick: () => this.onConfirmRejectApprove()
        },
      ];
    } else if (transaction.statusCode === 'APPROVE' && transaction.accountingStatusCode === 'ERROR') {
      this.actions = [
        {
          actionName: 'Kiểm tra trạng thái',
          actionIcon: 'help',
          actionClick: () => this.onCheckStatusTrans()
        },
      ];
    } else if (transaction.statusCode === 'REVERT_IN_PROCESS' && transaction.changeDebtStatusCode === 'REVERT_IN_PROCESS') {
      this.actions = [
        {
          actionName: 'Duyệt giao dịch revert',
          actionIcon: 'check',
          actionClick: () => this.onConfirmApproveRevert()
        },
        {
          actionName: 'Từ chối duyệt revert',
          actionIcon: 'cancel',
          actionClick: () => this.onConfirmRejectApproveRevert()
        },
      ]
    } else if (transaction.statusCode === 'REVERT_APPROVED' && transaction.accountingStatusCode === 'REVERT_UNK') {
      this.actions = [
        {
          actionName: 'Kiểm tra trạng thái',
          actionIcon: 'help',
          actionClick: () => this.onCheckStatusTransRevert()
        },
      ];
    } else if (transaction.changeDebtStatusCode === 'ERROR' && transaction.statusCode === 'APPROVE') {
      this.actions = [
        {
          actionName: 'Gach nợ bổ sung',
          actionIcon: 'help',
          actionClick: () => this.onChangeDebt()
        }
      ];
    } else {
      this.actions = [];
    }
  }

  printReceiptVoucher() {
    let id = this.rootData.tranId;
    this.fileService.downloadFileMethodGet(`electric-service/report/bill/${id}`);
  }

  otherTransaction() {
    this.router.navigate(["/electric-service/pay-at-counter/create"]);
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
          lastModifiedDate: this.rootData.lastModifiedDate,
          transactionId: this.rootData.tranId
        };
        this.electricService
          .approveTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                const data = res.data;
                if (data.status !== EStatusSuccess.SUCCESS) {
                  this.notifiService.error('Lỗi', res.data.message);
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
          lastModifiedDate: this.rootData.lastModifiedDate,
          transactionId: this.rootData.tranId,
          reason: confirm
        };
        this.electricService
          .rejectTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.notifiService.success(
                  'Thông báo',
                  'Từ chối duyệt giao dịch thành công'
                );
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

  onCheckStatusTrans() {
    if (this.isLoading) return;
    this.isLoading = true;
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
        const body = {
          id: this.rootData.tranId,
        };
        this.electricService
          .checkStatusTran(body)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (res) => {
              if (res.data) {
                this.notifiService.warning('Thông báo', res.data.message)
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      }
    });
  }

  onConfirmApproveRevert() {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: { title: 'Xác nhận', message: `Xác nhận duyệt revert hóa đơn. Bạn có muốn tiếp tục?`, },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const req = {
          lastModifiedDate: this.rootData.lastModifiedDate,
          transactionId: this.rootData.tranId
        };
        this.electricService
          .approveRevertTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                if (res.data.status !== EStatusSuccess.HT_REVERT_SUCCESS) {
                  this.notifiService.error('Lỗi', res.data.message);
                } else {
                  this.notifiService.success('Thông báo', 'Duyệt revert giao dịch thành công');
                }
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      }
    });
  }

  onConfirmRejectApproveRevert() {
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
          lastModifiedDate: this.rootData.lastModifiedDate,
          transactionId: this.rootData.tranId,
          reason: confirm
        };
        this.electricService
          .rejectRevertTransactions(req)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.notifiService.success(
                  'Thông báo',
                  'Từ chối duyệt revert giao dịch thành công'
                );
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
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
        const body = {
          id: this.rootData.tranId,
        };
        this.electricService
          .checkStatusTranRevert(body)
          .subscribe(
            (res) => {
              if (res.data) {
                this.notifiService.warning('Thông báo', res.data.message)
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      }
    });
  }
  onChangeDebt(): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận gạch nợ bổ sung. Bạn có muốn tiếp tục?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.electricService
          .changeDebt(this.rootData.tranId)
          .subscribe(
            (res) => {
              if (res.data) {
                if (res.data.changeDebtStatus !== EStatusSuccess.SUCCESS) {
                  this.notifiService.error('Lỗi', res.data.tranDesc);
                } else {
                  this.notifiService.success('Thông báo', 'Gạch nợ bổ sung thành công');
                }
                this.setInit();
              }
            },
            (error: IError) => this.checkError(error)
          );
      }
    });
  }

  checkError(error: IError) {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message)
    } else {
      this.notifiService.error('Lỗi', 'Lỗi hệ thống, vui lòng thử lại sau!')
    }

  }

  revert() {
    const body = {
      id: this.id,
      lastModifiedDate: this.rootData.lastModifiedDate,
      reason: ""
    };

    this.electricService.revertTransaction(body).toPromise().then(res => {
      this.formMessageService.openMessageSuccess("Đã tạo revert thành công !")
      this.getDetailTransaction(this.id);
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  printReceipt() {
    let id = this.rootData.tranId;
    this.fileService.downloadFileMethodGet(`electric-service/report/receipt/${id}`);
  }
}
