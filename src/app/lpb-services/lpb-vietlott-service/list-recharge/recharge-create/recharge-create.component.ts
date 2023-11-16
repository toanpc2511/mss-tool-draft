import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAgent, ITransaction} from '../../shared/models/vietlott.interface';
import {LpbDatatableComponent} from '../../../../shared/components/lpb-datatable/lpb-datatable.component';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {
  ACC_NAME_VIETLOTT,
  CASH_ACCNAME,
  CASH_ACCNO,
  LIST_AGENT_TYPE
} from '../../shared/constants/vietlott.constant';
import {VietlottService} from '../../shared/services/vietlott.service';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormMessageComponent} from '../../../lpb-tuition-service/shared/components/form-message/form-message.component';
import {MatDialog} from '@angular/material/dialog';
import {IError} from '../../../../system-configuration/shared/models/error.model';
import {Router} from '@angular/router';
import {TransactionInfoComponent} from '../../shared/components/transaction-info/transaction-info.component';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import * as moment from 'moment';

@Component({
  selector: 'app-recharge-create',
  templateUrl: './recharge-create.component.html',
  styleUrls: ['./recharge-create.component.scss']
})
export class RechargeCreateComponent implements OnInit {

  forms: FormGroup;
  agent: IAgent;
  transData: ITransaction [] = [];
  listType = LIST_AGENT_TYPE;
  posId: string;
  @ViewChild('transactionInfo') transactionInfo: TransactionInfoComponent;
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  actions: ActionModel[] = [
    {
      actionName: 'Hủy',
      actionIcon: 'cancel',
      actionClick: () => this.cancel(),
    },
    {
      actionName: 'Lưu',
      actionIcon: 'save',
      actionClick: () => this.save(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private vietlottService: VietlottService,
    private notifyService: CustomNotificationService,
    private matdialog: MatDialog,
    private router: Router,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Danh sách giao dịch',
      'Tạo giao dịch',
    ]);
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      agentCode: ['', [Validators.required]],
      agentType: ['V2VL'],
    });
  }

  search(): void {
    this.getDetailAgent();
    // this.transactionInfo.pathValueAgent(this.agent);

  }

  // Tim kiem thong tin dai ly tu ma dai ly nhạp vao
  getDetailAgent(): void {
    this.forms.controls.agentCode.markAllAsTouched();
    if (this.forms.invalid) {
      return;
    }
    this.posId = `${this.forms.get('agentType').value}${this.forms.get('agentCode').value}`;
    const params = {vPaymentAcc: this.posId};
    this.vietlottService.getDetailAgent(params)
      .subscribe((res) => {
        if (res.data) {
          this.agent = ({
            ...res.data
          });
          setTimeout(() => {
            this.transactionInfo.pathValueAgent(this.agent);
          });
          this.setPaymentContent();
        } else {
          this.notifyService.error('Thất bại', 'Không tìm thấy thông tin đại lý');
        }
      }, (error: IError) => {
        this.notifyService.handleErrors(error);
      });
  }

  setPaymentContent(): void {
    let transNumber = 0;
    this.vietlottService.getlistTrans(this.posId, this.getToday())
      .subscribe((res) => {
        if (res.data) {
          transNumber = res.data.length;
          this.transactionInfo.formPayment.get('paymentContent').patchValue(`${this.posId}_${transNumber}`);
          console.log('transNumber=--', transNumber);
        }
      }, (error: IError) => console.log('Thất bại', 'Chưa tồn tại GD'));
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD') + ' 00:00:00';
  }

  cancel(): void {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'cancel',
        text: 'Các dữ liệu bạn vừa tạo sẽ bị xóa, bạn có muốn tiếp tục ?',
        title: 'Xác nhận',
        btnOk: {text: 'Xác nhận', class: 'btn-danger'},
        btnCancel: {text: 'Quay lại', class: 'btn-secondary'},
      },
      hasBackdrop: true,
      disableClose: true,
      backdropClass: 'bg-none',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.transactionInfo.initFormGroup();
      }
    });
  }

  save(): void {
    this.transactionInfo.formPayment.markAllAsTouched();
    if (this.transactionInfo.formPayment.invalid) {
      return;
    }
    const body = this.handleDataSave();
    if (body === null) {
      return;
    }
    this.vietlottService.createTrans(body)
      .subscribe((res) => {
        if (res.data) {
          this.openMessageSuccess(res.data);
        } else {
          this.notifyService.error('Thất bại', 'Tạo giao dịch thất bại');
        }
        this.agent = null;
      }, (error: IError) => this.notifyService.handleErrors(error));
  }

  // Lay gia tri tu form vao request
  handleDataSave(): any {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const valueTransForm = this.transactionInfo.formPayment.getRawValue();
    const isCash = valueTransForm.paymentMethod === 'NVL1' ? true : false;
    // Check so du tai khoan
    // if (!isCash) {
    //   if (Number(valueTransForm.paymentAmount.split('.').join('')) > Number(valueTransForm.accountBalance.split(',').join(''))) {
    //     this.notifyService.error('Lỗi', 'Số tiền thanh toán lớn hơn số dư hiện có của tài khoản');
    //     return null;
    //   }
    // }
    const body = {
      posId: this.posId,
      posName: this.agent.accName,
      posAddress: this.agent.accAddress,
      posMobi: this.agent.accPhoneNumber,
      vpaymentId: this.agent.vpaymentId,
      amount: valueTransForm.paymentAmount.split('.').join(''),
      trnDesc: valueTransForm.paymentContent,
      trnBrn: userInfo?.branchCode,
      trnName: userInfo?.branchName,
      cusNo: valueTransForm.numberDocType,
      cusName: '',
      accNo: isCash ? CASH_ACCNO : valueTransForm.accountDebit,
      accDesc: isCash ? CASH_ACCNAME : valueTransForm.accountNameDebit,
      accBranch: isCash ? userInfo?.branchCode : this.transactionInfo.accSelected.branchCode,
      accAvaiBalance: isCash ? '' : valueTransForm.accountBalance,
      accCcy: 'VND',
      productCode: valueTransForm.paymentMethod,
      paymentType: isCash ? 'Tiền mặt' : 'Chuyển khoản',
      partnerAccNo: this.agent.accountCore,
      partnerAccName: ACC_NAME_VIETLOTT,
      transactionPostRequests: [
        {
          acBranch: this.agent.branch,
          acCcy: 'VND',
          acNo: this.agent.accountCore,
          acName: ACC_NAME_VIETLOTT,
          accountType: '',
          drcrInd: 'C',
          amount: valueTransForm.paymentAmount.split('.').join(''),
          productCode: valueTransForm.paymentMethod
        },
        {
          acBranch: isCash ? userInfo?.branchCode : this.transactionInfo.accSelected.branchCode,
          acCcy: 'VND',
          acNo: isCash ? CASH_ACCNO : valueTransForm.accountDebit,
          acName: isCash ? CASH_ACCNAME : valueTransForm.accountNameDebit,
          accountType: '',
          drcrInd: 'D',
          amount: valueTransForm.paymentAmount.split('.').join(''),
          productCode: valueTransForm.paymentMethod
        }]
    };
    console.log('body', body);
    return body;
  }

  // paymentAmountChange(): void {
  //   const amount = this.formPayment.get('paymentAmount').value.split('.').join('');
  //   const accAvaiBalance = this.formPayment.get('paymentAmount').value.split(',').join('');
  //   if (amount > accAvaiBalance) {
  //     this.notifyService.error('Lỗi', 'Số tiền thanh toán lớn hơn số dư hiện có của tài khoản');
  //   }
  // }
  openMessageSuccess(data): void {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: {
        type: 'ok',
        text: 'Lưu giao dịch thành công !',
        title: 'Thành công',
        btnOk: {text: 'Xem chi tiết', class: 'lpb-btn-primary'},
      },
      position: {top: '0px', right: '0px'},
    });

    dialog.afterClosed().subscribe((res) => {
      this.agent = null;
      if (res) {
        this.router.navigate(['/vietlott-service/list-recharge/view'], {queryParams: {id: data.id}});
      }
    });
  }

}
