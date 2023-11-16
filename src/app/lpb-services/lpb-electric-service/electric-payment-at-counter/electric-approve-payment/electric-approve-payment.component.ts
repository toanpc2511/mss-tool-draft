import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActionModel } from '../../../../shared/models/ActionModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ElectricService } from '../../shared/services/electric.service';
import {
  PAYMENT_METHODS,
  STATUS_SETTLE_ELECTRIC,
  TRANSACTION_TELLER_KSV_COLUMN,
  TRANSACTION_TYPES
} from '../../shared/constants/electric.constant';
import * as moment from 'moment/moment';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { Router } from '@angular/router';
import {
  CHANGE_DEBT_COLUMNS,
  TRANSACTION_DOUBTS_COLUMNS
} from '../../shared/constants/columns-transaction-electric.constant';
import { isHoiSo, isKSV } from '../../../../shared/utilites/role-check';
import { ultis } from '../../../../shared/utilites/function';
import { BreadCrumbHelper } from '../../../../shared/utilites/breadCrumb-helper';
import { LbpValidators } from '../../../../shared/validatetors/lpb-validators';

@Component({
  selector: 'app-electric-approve-payment',
  templateUrl: './electric-approve-payment.component.html',
  styleUrls: ['./electric-approve-payment.component.scss'],
  providers: [DestroyService]
})
export class ElectricApprovePaymentComponent implements OnInit {
  actions: ActionModel[] = [];
  searchForm: FormGroup;
  userInfo: any;
  fromDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
  transactionTypes = TRANSACTION_TYPES;
  paymentMethods = PAYMENT_METHODS;
  statusSettles = STATUS_SETTLE_ELECTRIC;
  transactionTypeValue = 'IN_PROCESS';
  createBysState: {
    data: any;
    setData: any;
  };
  configs = {
    filterDefault: this.getFilterDefault(),
    defaultSort: 'createdDate:ASC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false
  };
  columns = TRANSACTION_TELLER_KSV_COLUMN;
  apiServiceURL = '/electric-service/transaction';
  apiUrlUserChecker = '';
  apiUrlUserCreated = '';
  today = new Date();
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  constructor(
    private fb: FormBuilder,
    private destroy$: DestroyService,
    private authenticationService: AuthenticationService,
    private electricService: ElectricService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initSearchForm();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    this.apiUrlUserChecker = `/electric-service/branch/accounts?roleType=${isHoiSo() ? 'ALL' : 'KSV'}`;
    this.apiUrlUserCreated = `/electric-service/branch/accounts?roleType=${isHoiSo() ? 'ALL' : 'GDV'}`;

    if (!isHoiSo()) {
      this.searchForm.get('tranBrn').disable();
      this.searchForm.get('tranBrn').setValue(this.userInfo.branchCode);
    }
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      transactionType: ['IN_PROCESS'],
      supplierCode: [''],
      customerId: [''],
      tranBrn: [''],
      createdBy: [''],
      status: ['IN_PROCESS'],
      totalAmount: [''],
      checkerId: [''],
      paymentType: [''],
      transNo: [''],
      accountingStatus: [''],
      changeDebtStatus: [''],
      fromDate: [ultis.formatDate(this.today)],
      toDate: [ultis.formatDate(this.today)],
    }, {
      validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Dịch vụ điện',
      'Thanh toán tại quầy',
      'Phê duyệt'
    ]);
    this.handleCreatedBy();
    this.handleChangeTransactionType();
  }

  handleChangeTransactionType(): void {
    this.searchForm.get('transactionType').valueChanges
      .subscribe((value) => {
        this.transactionTypeValue = value;
        console.log(value)
        switch (value) {
          case 'IN_PROCESS':
            this.apiServiceURL = '/electric-service/transaction';
            this.searchForm.patchValue({
              checkerId: '',
              paymentType: '',
              transNo: '',
              accountingStatus: '',
              changeDebtStatus: ''
            });
            break;
          case 'CHECK':
            this.apiServiceURL = '/electric-service/transaction/doubts';
            this.fromDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
            this.searchForm.patchValue({
              status: null,
              accountingStatus: 'ERROR',
              totalAmount: ''
            });
            break;
          case 'CHECK_REVERT':
            this.apiServiceURL = '/electric-service/transaction/doubts';
            this.fromDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
            this.searchForm.patchValue({
              status: null,
              accountingStatus: 'REVERT_UNK',
              totalAmount: ''
            });
            break;

          case 'CHANGE_DEBT':
            this.apiServiceURL = '/electric-service/transaction';
            this.fromDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
            this.searchForm.patchValue({
              status: null,
              totalAmount: '',
              accountingStatus: '',
              changeDebtStatus: 'ERROR'
            });
            break;
          default:
            break;
        }
        this.cdr.detectChanges();
      });

  }

  handleCreatedBy(): void {
    this.searchForm.get('tranBrn').valueChanges.subscribe((e) => {
      this.apiUrlUserChecker = `/electric-service/branch/accounts?roleType=${isHoiSo() ? 'ALL' : 'KSV'}&tranBrn=${e ? e : ''}`;
      this.apiUrlUserCreated = `/electric-service/branch/accounts?roleType=${isHoiSo() ? 'ALL' : 'GDV'}&tranBrn=${e ? e : ''}`;
    });
  }

  search(): void {
    const valueForm = this.searchForm.getRawValue();
    switch (valueForm.transactionType) {
      case 'IN_PROCESS':
        this.columns = TRANSACTION_TELLER_KSV_COLUMN;
        break;
      case 'CHECK':
        this.columns = TRANSACTION_DOUBTS_COLUMNS;
        break;
      case 'CHANGE_DEBT':
        this.columns = CHANGE_DEBT_COLUMNS;
        break;
      default:
        this.columns = TRANSACTION_TELLER_KSV_COLUMN;
        break;
    }
    this.searchConditions = this.handleFilter();
  }

  handleFilter(): { property: string, operator: string, value: any }[] {
    const valueForm = this.searchForm.getRawValue();
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    this.configs = {
      ...this.configs,
      defaultSort: (valueForm.status === 'IN_PROCESS' || valueForm.status === 'REVERT_IN_PROCESS' ) ? 'createdDate:ASC' : 'createdDate:DESC'
    };
    this.cdr.detectChanges();
    return [
      {
        property: 'supplierCode',
        operator: 'ol',
        value: valueForm.supplierCode,
      },
      {
        property: 'customerId',
        operator: 'ol',
        value: valueForm.customerId,
      },
      {
        property: 'tranBrn',
        operator: 'eq',
        value: valueForm.tranBrn
      },
      {
        property: 'createdBy',
        operator: 'ol',
        value: valueForm.createdBy
      },
      {
        property: 'status',
        operator: 'eq',
        value: valueForm.status,
      },
      {
        property: 'transNo',
        operator: 'eq',
        value: valueForm.transNo,
      },
      {
        property: 'paymentType',
        operator: 'eq',
        value: valueForm.paymentType,
      },
      {
        property: 'checkerId',
        operator: 'eq',
        value: valueForm.checkerId,
      },
      {
        property: 'accountingStatus',
        operator: 'eq',
        value: valueForm.accountingStatus,
      },
      {
        property: 'changeDebtStatus',
        operator: 'eq',
        value: valueForm.changeDebtStatus,
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: valueForm.fromDate ? fromDate : ''
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: valueForm.toDate ? toDate : ''
      },
      {
        property: 'totalAmount',
        operator: 'eq',
        value: valueForm.totalAmount.split('.').join(''),
      }
    ];
  }

  filterSendBy({ data, setData }): void {
    const users = data?.filter((e) => e.roleCode === isKSV() ? 'UNIFORM.BANK.KSV' : 'UNIFORM.BANK.GDV');
    this.createBysState = {
      data: data?.filter((e) => e === isKSV() ? 'UNIFORM.BANK.KSV' : 'UNIFORM.BANK.GDV'),
      setData,
    };
    setData(users);
  }

  viewDetail(value): void {
    this.router.navigate(['/electric-service/pay-at-counter/view'], { queryParams: { id: value.tranId } });
  }

  retype() {
    this.searchForm.patchValue({
      transactionType: 'IN_PROCESS',
      supplierCode: '',
      customerId: '',
      tranBrn: '',
      createdBy: '',
      status: 'IN_PROCESS',
      totalAmount: '',
      checkerId: '',
      paymentType: '',
      transNo: '',
      accountingStatus: '',
      changeDebtStatus: '',
      fromDate: ultis.formatDate(this.today),
      toDate: ultis.formatDate(this.today),
    })
    if (!isHoiSo()) {
      this.searchForm.get('tranBrn').disable();
      this.searchForm.get('tranBrn').setValue(this.userInfo.branchCode);
    }
  }
}
