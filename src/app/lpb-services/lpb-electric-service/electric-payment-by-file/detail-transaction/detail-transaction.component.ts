import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionModel } from '../../../../shared/models/ActionModel';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectricService } from '../../shared/services/electric.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';
import { CustomNotificationService } from '../../../../shared/services/custom-notification.service';
import { FileService } from 'src/app/shared/services/file.service';
import { isGDV } from 'src/app/shared/utilites/role-check';
declare var $: any;

@Component({
  selector: 'app-detail-transaction',
  templateUrl: './detail-transaction.component.html',
  styleUrls: ['./detail-transaction.component.scss']
})
export class DetailTransactionComponent implements OnInit {
  actions: ActionModel[] = [];
  idTransaction = '';
  dataStepOne: any;
  dataStepTwo: any;
  title = 'Thông tin giao dịch nộp tiền';
  batchId = "";
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private electricService: ElectricService,
    private destroy$: DestroyService,
    private notify: CustomNotificationService,
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    $('.parentName').html('Thanh toán hóa đơn Điện');
    $('.childName').html('Thanh toán theo file / Chi tiết hóa đơn');
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$))
      .subscribe((param) => {
        param.id
          ? this.getDetailTransaction(param.id)
          : this.router.navigate(['/electric-service/pay-at-file/transactions']);
      });
    this.setActions(0);
  }

  setActions(step) {
    switch (step) {
      case 0:
        this.actions = [
          {
            actionName: "In phiếu thu tiền",
            actionIcon: 'print',
            actionClick: () => this.printBill()
          },
          {
            actionName: "In phiếu hạch toán",
            actionIcon: 'print',
            actionClick: () => this.printTransfer()
          },
          {
            actionName: "Quay lại",
            actionIcon: 'keyboard_backspace',
            actionClick: () => this.back()
          }
        ]
        break;

      default:
        this.actions = [
          {
            actionName: "In phiếu hạch toán",
            actionIcon: 'print',
            actionClick: () => this.printAccounting()
          },
          {
            actionName: "In phiếu biên nhận",
            actionIcon: 'print',
            actionClick: () => this.printReceipt()
          },
          {
            actionName: "Quay lại",
            actionIcon: 'keyboard_backspace',
            actionClick: () => this.back()
          }
        ]
        break;
    }

  }

  getDetailTransaction(id: string): void {
    this.batchId = id;
    this.electricService.getDetailTransactionByFile(id)
      .subscribe((res) => {
        if (res.data) {
          this.handleDataStep(res.data);
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  handleDataStep(data: any): void {
    this.dataStepOne = {
      transferPaymentType: data.transferPaymentType,
      transferPaymentTypeName: data.transferPaymentTypeName,
      totalAmount: data.transferTransactionResponses[0]?.totalAmount,
      statusName: data.transferTransactionResponses[0]?.statusName,
      paymentContent: data.transferTransactionResponses[0]?.desc,
      acNumberD: data.transferTransactionResponses[1]?.acNumber,
      acNameD: data.transferTransactionResponses[1]?.acName,
      preBalanceD: data.transactionResponses[0]?.preBalance,
      acNumberC: data.transferTransactionResponses[0]?.acNumber,
      acNameC: data.transferTransactionResponses[0]?.acName,
      payerName: data.transactionResponses[0]?.payerName,
      payerAddress: data.transactionResponses[0]?.payerAddress,
      payerPhoneNumber: data.transactionResponses[0]?.payerPhoneNumber,
      accountingInfo: data?.transferTransactionResponses
    };

    let total = 0;
    data.transactionResponses.map(item => {
      total += item?.totalAmount;
      return total;
    });
    this.dataStepTwo = {
      batchId: this.batchId,
      batchNo: data.batchNo,
      fileName: data.fileName,
      batchStatus: data.batchStatusName,
      transNo: data.transferTransactionResponses[0]?.transNo,
      acNumber: `${data.transferTransactionResponses[0]?.acNumber} - ${data.transferTransactionResponses[0]?.acName}`,
      ccy: data.ccy,
      tranBrn: `${data.tranBrn} - ${data.tranName}`,
      makerId: data.makerId,
      createdBy: data.createdBy,
      totalAmountTranfer: total,
      bills: data.transactionResponses.map((item) => ({
        ...item,
        billId: item.billInfos[0]?.billId,
        billDesc: item.billInfos[0]?.billDesc,
        billStatus: item.billInfos[0]?.billStatus,
        receiptNumber: item.receiptNumber || '--',
        changeDebtStatus: item.billInfos[0]?.changeDebtStatus,
        changeDebtStatusName: item.billInfos[0]?.changeDebtStatusName,
      })),
      accountingInfos: data.accountingBatchResponses
    };
  }

  getSelected($event): void {
    switch ($event.selectedIndex) {
      case 0:
        this.title = 'Thông tin giao dịch nộp tiền';
        this.setActions(0);
        break;
      case 1:
        this.title = 'Thông tin giao dịch gạch nợ';
        this.setActions(1);
        break;
    }
  }

  printBill() {
    this.fileService.downloadFileMethodGet(`electric-service/report/file/bill/${this.batchId}`);
  }

  printTransfer() {
    this.fileService.downloadFileMethodGet(`electric-service/report/file/tranfer/${this.batchId}`);
  }

  printAccounting() {
    this.fileService.downloadFileMethodGet(`electric-service/report/file/tranPost/${this.batchId}`);
  }

  printReceipt() {
    this.fileService.downloadFileMethodGet(`electric-service/report/receipt/file/${this.batchId}`);
  }

  back() {
    if (isGDV()) {
      this.router.navigate(['/electric-service/pay-at-file/transactions']);
    } else {
      this.router.navigate(['/electric-service/pay-at-file/approve']);
    }
  }
}
