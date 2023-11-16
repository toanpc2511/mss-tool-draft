import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {FormBuilder} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {ElectricService} from '../../shared/services/electric.service';
import {takeUntil} from 'rxjs/operators';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {IError} from '../../../../shared/models/error.model';
import {forkJoin, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss'],
  providers: [DestroyService, MatStepper]
})
export class CreateTransactionComponent implements OnInit {
  isCompleted = false;
  stepOneCompleted = false;
  stepTwoCompleted = false;
  stepThreeCompleted = false;
  infoAccRedis: any;
  dataStepOne: any;
  dataStepTwo: any;
  dataStepThree: any;
  dataCompleted: any;
  eventsSubjectStepOne: Subject<void> = new Subject<void>();
  eventsSubjectStepThree: Subject<void> = new Subject<void>();
  eventsClearStepTwo: Subject<void> = new Subject<void>();
  eventsClearStepThree: Subject<void> = new Subject<void>();
  eventCompleted: Subject<void> = new Subject<void>();
  dataSourceStepTwo: any[] = [];
  ruleContent = ''
  actions: ActionModel[] = [{
    actionName: 'Truy vấn', actionIcon: 'send', hiddenType: 'none', actionClick: () => this.onQueryFile()
  }];
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private electricService: ElectricService,
    private notify: CustomNotificationService,
    private numberPipe: DecimalPipe
  ) {
  }

  ngOnInit(): void {
    $('.parentName').html('Thanh toán hóa đơn Điện');
    $('.childName').html('Thanh toán theo file / Tạo mới');
  }

  changeDataInStepOne($event): void {
    if (this.isCompleted) {
      return;
    }
    this.eventsClearStepTwo.next();
    this.dataStepOne = $event;
    this.stepOneCompleted = false;
    this.stepTwoCompleted = false;
    this.stepThreeCompleted = false;
    this.handleActions(0);
  }

  changeDataInStepTwo($event): void {
    if (this.stepOneCompleted) {
      this.eventsClearStepThree.next();
      this.dataStepTwo = $event;
      this.stepTwoCompleted = false;
      this.stepThreeCompleted = false;
      this.handleActions(1);
    }
  }

  changeDataInStepThree($event): void {
    if (this.stepTwoCompleted) {
      this.dataStepThree = $event;
    }
  }

  getSelected($event): void {
    this.handleActions($event.selectedIndex);
  }

  handleActions(step: number): void {
    switch (step) {
      case 0:
        this.actions = [{
          actionName: this.stepOneCompleted ? 'Tiếp theo' : 'Truy vấn',
          actionIcon: 'send',
          actionClick: () => this.isCompleted ? this.stepper.next() : this.onQueryFile()
        }];
        break;
      case 1:
        this.actions = [{
          actionName: this.stepTwoCompleted ? 'Tiếp theo' : 'Tiếp tục',
          actionIcon: '',
          actionClick: () => this.isCompleted ? this.stepper.next() : this.onContinue()
        },
          {
            actionName: 'Bước trước',
            actionIcon: '',
            actionClick: () => this.stepper.previous()
          }];
        break;
      case 2:
        this.actions = [{
          actionName: this.stepThreeCompleted ? 'Tiếp theo' : 'Tạo giao dịch',
          actionIcon: '',
          actionClick: () => this.isCompleted ? this.stepper.next() : this.onCreateTransaction()
        },
          {
            actionName: 'Bước trước',
            actionIcon: '',
            actionClick: () => this.stepper.previous()
          }];
        break;
      case 3:
        this.actions = [{
          actionName: 'Tạo giao dịch khác',
          actionIcon: 'send',
          hiddenType: 'none',
          actionClick: () => this.onCreateTransactionOther()
        }];
        break;
    }
    this.cdr.detectChanges();
  }

  onQueryFile(): void {
    if (this.stepOneCompleted) {
      this.nextStep();
      return;
    }
    this.eventsSubjectStepOne.next();
    if (this.dataStepOne) {
      const body = {
        importFileResponses: this.dataStepOne.importFileResponses,
        supplierCode: this.dataStepOne.supplierCode,
        serviceType: 'ELECTRIC_SERVICE'
      };
      forkJoin([
        this.electricService.queryDataByFile(body),
        this.electricService.getSupplierRules(this.dataStepOne.supplierId)
      ]).pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this.handleSupplierRule(res[1].data);
          if (res[0].data) {
            this.notify.success('Thông báo', 'Truy vấn thông tin thành công');
            this.dataSourceStepTwo = res[0].data.querySearchBills;
            this.infoAccRedis = {
              acName: res[0].data.acName,
              acNumber: res[0].data.acNumber
            };
            this.stepOneCompleted = true;
            this.nextStep();
          }
        });
    }
  }

  handleSupplierRule(rules: any[]): void {
    let content = '';
    rules.forEach(rule => {
      if (rule.paymentGroupCode === 'UNI-FORMGROUP1') {
        return;
      }
      if (rule.paymentGroupCode === 'UNI-FORMGROUP2') {
        content += `${rule.paymentGroupName}: ${rule.paymentRuleName}`;
      }
    });
    const typePriorityBills = rules.filter(rule => rule.paymentGroupCode === 'UNI-FORMGROUP3').map(item => item.paymentRuleName);
    content += typePriorityBills.length > 0 ? `, Loại hóa đơn ưu tiên: ${typePriorityBills.join(', ')}` : '';
    this.ruleContent = content;
    this.cdr.detectChanges();
  }

  onContinue(): void {
    if (this.stepTwoCompleted) {
      this.nextStep();
      return;
    }
    if (this.dataStepTwo.data.length <= 0) {
      this.notify.warning('Cảnh báo', 'Vui lòng chọn hóa đơn!');
      return;
    }
    this.dataStepTwo = {
      ...this.dataStepTwo,
      ...this.dataStepOne,
      ...this.infoAccRedis
    };
    this.stepTwoCompleted = true;
    this.nextStep();
  }

  onCreateTransaction(): void {
    this.eventsSubjectStepThree.next();
    if (!this.dataStepThree) {
      return;
    }

    this.electricService.createTransactionByFile(this.dataStepThree)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.handleDataStepCompleted(res.data);
          this.notify.success('Thông báo', 'Tạo giao dịch thành công');
          this.stepThreeCompleted = true;
          this.isCompleted = true;
          this.handleBeforeCompleted();
          this.nextStep();
        }
      }, (error: IError) => this.checkError(error));
  }

  handleDataStepCompleted(data): void {
    const infoInvoiceQuery = {
      batchNo: data?.batchNo,
      fileName: data?.fileName,
      batchStatusName: data?.batchStatusName,
      middleAcNumber: data?.middleAcNumber,
      ccy: data?.ccy,
      tranBrn: data?.tranName,
      createdBy: data?.createdBy
    };

    const infoPaymentToIntermediary = {
      id: data?.id,
      transNo: data?.transferTransactionResponses[0].transNo,
      status: data?.transferTransactionResponses[0]?.statusName,
      creditNumber: data?.transferTransactionResponses[0]?.acNumber,
      creditName: data?.transferTransactionResponses[0]?.acName,
      debitNumber: data?.transferTransactionResponses[1]?.acNumber,
      debitName: data?.transferTransactionResponses[1]?.acName,
      totalAmount: this.numberPipe.transform(data?.transferTransactionResponses[0]?.totalAmount, '1.0') + ' VNĐ' || '--',
    };

    this.dataCompleted = {infoInvoiceQuery, infoPaymentToIntermediary};
  }

  handleBeforeCompleted(): void {
    this.eventCompleted.next();
    this.cdr.detectChanges();
  }

  onCreateTransactionOther(): void {
    location.reload();
  }

  nextStep(): void {
    setTimeout(() => this.stepper.next());
  }

  checkError(error: IError): void {
    this.notify.error('Lỗi', error.code ? error.message : 'Lỗi hệ thống, vui lòng thử lại sau');
  }
}
