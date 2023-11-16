import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectricService } from '../shared/services/electric.service';
import * as moment from 'moment';
import {
  CONTENT_TYPES,
  PAYMENT_CHANNEL_TYPES,
  PAYMENT_CHANNEL_TYPES_LV24,
  REPORT_TYPES, STATUS_TRANSACTION_SEARCH, STATUS_TRANSACTION_SEARCH_LV24, SUPPLIER_LV24,
} from '../shared/constants/electric.constant';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { ultis } from 'src/app/shared/utilites/function';
import { FileService } from 'src/app/shared/services/file.service';
import { isHoiSo } from '../../../shared/utilites/role-check';
import { BreadCrumbHelper } from '../../../shared/utilites/breadCrumb-helper';
import { ActionModel } from '../../../shared/models/ActionModel';

@Component({
  selector: 'app-electric-report',
  templateUrl: './electric-report.component.html',
  styleUrls: ['./electric-report.component.scss'],
})
export class ElectricReportComponent implements OnInit {
  searchForm: FormGroup;
  today = new Date();
  formHelpers = FormHelpers;
  apiServiceURL: string;
  actions: ActionModel[];
  statusTransactions = [];
  reportTypes = REPORT_TYPES;
  contentTypes = CONTENT_TYPES;
  chanelTypes = PAYMENT_CHANNEL_TYPES;
  statusDebts = STATUS_TRANSACTION_SEARCH;
  reportTypeValue = '0';
  columns: any;
  dataSource = [];
  config = {
    filterDefault: 'transactionType|eq|APPROVE_REGISTER_AUTO_SETTLE',
    defaultSort: '',
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true
  };
  searchConditions: {
    property: string;
    operator: string;
    value: string;
  }[] = [];

  showDetail = false;
  curRow = null;
  supplierLv24 = SUPPLIER_LV24;
  chanelTypesLv24 = PAYMENT_CHANNEL_TYPES_LV24;
  statusDebtsLv24 = STATUS_TRANSACTION_SEARCH_LV24;

  constructor(
    private fb: FormBuilder,
    private electricService: ElectricService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
    this.apiServiceURL = `/electric-service/report/settle?fromDate=${moment().startOf('month').format(
      'YYYY-MM-DD'
    )} 00:00:00&toDate=${moment().format('YYYY-MM-DD')} 23:59:59`;
    this.initBranch();
  }

  initBranch(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!isHoiSo()) {
      this.searchForm.get('branchCode').disable();
      this.searchForm.get('branchCode').setValue(userInfo.branchCode);
    }
  }

  getFilterDefault(): string {
    let filterDefault = 'status|eq|IN_PROCESS';
    const curDate = new Date();
    filterDefault += `&createdDate|lte|${ultis.dateToStringDate(curDate, 'yyyy-mm-dd')} 23:59:59`;
    const firstDate = new Date(curDate.setDate(1));
    filterDefault += `&createdDate|gte|${ultis.dateToStringDate(firstDate, 'yyyy-mm-dd')} 00:00:00`;
    return filterDefault;
  }

  handleActions(dataSource: any[] = []): void {
    this.actions = [
      {
        actionName: 'Xuất excel',
        actionIcon: 'save',
        hiddenType: dataSource.length <= 0 ? 'disable' : 'none',
        actionClick: () => this.exportFile('EXCEL'),
      },
      {
        actionName: 'Xuất PDF',
        actionIcon: 'save',
        hiddenType: dataSource.length <= 0 ? 'disable' : 'none',
        actionClick: () => this.exportFile('PDF'),
      }
    ];
    this.cdr.detectChanges();
  }
  getRawData($event): void {
    this.handleActions($event.data);
  }

  initForm(): void {
    const curDate = new Date();
    this.columns = this.reportTypes[0].columns;
    this.searchForm = this.fb.group({
      reportType: [this.reportTypes[0]],
      supplierCode: [''],
      branchCode: [''],
      custId: [''],
      fromDate: [ultis.formatDate(new Date(curDate.setDate(1))), [Validators.required]],
      toDate: [ultis.formatDate(new Date()), [Validators.required]],
      contentType: [this.contentTypes[0].value],
      paymentChannel: [null],
      debtStatus: [null],
      export: [""], // Người xuất báo cáo
    });
  }

  ngOnInit(): void {
    this.handleChangeReportType();
    this.searchForm.valueChanges.subscribe(_ => {
      this.handleActions();
    });

    BreadCrumbHelper.setBreadCrumb([
      'Dịch vụ điện',
      'Báo cáo',
    ]);
  }

  search(): void {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      return;
    }
    const valueForm = this.searchForm.getRawValue();
    const fromDate = valueForm.fromDate
      ? moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
      ' 00:00:00'
      : '';
    const toDate = valueForm.toDate
      ? moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
      ' 23:59:59'
      : '';
    if (this.reportTypeValue === '4') {
      this.apiServiceURL = `${valueForm.reportType.apiPath}?fromDate=${valueForm.fromDate}&toDate=${valueForm.toDate}`;
    } else {
      this.apiServiceURL = `${valueForm.reportType.apiPath}?fromDate=${fromDate}&toDate=${toDate}&status=${valueForm.debtStatus || ''}`;
    }

    this.searchConditions = this.handleParamSearch();
  }

  get searchControl(): any {
    return this.searchForm.controls;
  }

  handleParamSearch(): {
    property: string;
    operator: string;
    value: string;
  }[] {
    const valueForm = this.searchForm.getRawValue();
    if (this.reportTypeValue === "4") {
      const conditions = [
        {
          property: 'statusTrans',
          operator: 'eq',
          value: valueForm.statusTrans,
        },
        {
          property: 'productCode',
          operator: 'eq',
          value: valueForm.supplierCode,
        },
        {
          property: 'custNo',
          operator: 'eq',
          value: valueForm.custId,
        },
        {
          property: 'branchCode',
          operator: 'eq',
          value: valueForm.branchCode,
        },
        {
          property: 'channelCode',
          operator: 'eq',
          value: valueForm.paymentChannel,
        },
        {
          property: 'export',
          operator: 'eq',
          value: valueForm.exporter,
        },
      ]
      return conditions;
    }
    const conditions = [
      {
        property: 'supplierCode',
        operator: 'eq',
        value: valueForm.supplierCode,
      },
      {
        property: valueForm.reportType.value !== '0' ? 'tranBrn' : 'brnCode',
        operator: 'eq',
        value: valueForm.branchCode,
      },
      {
        property: 'transactionType',
        operator: 'eq',
        value: valueForm.contentType,
      },
      {
        property: 'customerId',
        operator: 'eq',
        value: valueForm.custId,
      },
      {
        property: 'transactionEntity.paymentChannelType',
        operator: 'eq',
        value: valueForm.paymentChannel,
      },
      {
        property: 'transactionEntity.paymentChannelType',
        operator: 'eq',
        value: valueForm.reportType.value === '2' ? 'AUTOMATION' : '',
      },
    ];
    return conditions;
  }

  exportFile(type: 'EXCEL' | 'PDF'): void {
    const valueForm = this.searchForm.getRawValue();
    const fromDate = valueForm.fromDate
      ? moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
      ' 00:00:00'
      : '';
    const toDate = valueForm.toDate
      ? moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
      ' 23:59:59'
      : '';
    let apiPath = "";
    if (this.reportTypeValue === "4") {
      apiPath = `${valueForm.reportType.apiExport}?fromDate=${valueForm.fromDate}&toDate=${valueForm.fromDate}&fileType=${type}`;
    } else {
      apiPath = `${valueForm.reportType.apiExport}?fromDate=${fromDate}&toDate=${toDate}&fileType=${type}&status=${valueForm.debtStatus || ''}`;
    }

    const params = {
      filter: ultis.handleValueFilter(this.handleParamSearch()),
    };
    this.fileService.downloadFileMethodGet(apiPath, params);
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  resetForm(): void {
    const curDate = new Date();
    this.searchForm.patchValue({
      reportType: this.reportTypes[0],
      supplierCode: '',
      custId: '',
      fromDate: ultis.formatDate(new Date(curDate.setDate(1))),
      toDate: ultis.formatDate(new Date()),
      contentType: this.contentTypes[0].value,
      paymentChannel: null,
      debtStatus: null,
      export: "",
    });
    this.initBranch();
  }

  handleChangeReportType(): void {
    this.searchForm.get('reportType').valueChanges.subscribe((value) => {
      this.reportTypeValue = value.value;
      if (["1","2"].includes(this.reportTypeValue)) {
        this.config.hiddenActionColumn = false
      } else {
        this.config.hiddenActionColumn = true
      }
      const curDate = new Date();
      this.searchForm.patchValue({
        fromDate: ultis.formatDate(new Date(curDate.setDate(1))),
        toDate: ultis.formatDate(new Date()),
      });
      Object.keys(this.searchForm.controls).forEach((key) => {
        if (key === 'reportType' || key === 'fromDate' || key === 'toDate') {
          return;
        }
        this.searchForm.get(key).reset();
      });
      this.initBranch();

      this.columns = value.columns;
      this.dataSource = [];

      switch (value.value) {
        case '0':
          this.searchForm
            .get('contentType')
            .patchValue(this.contentTypes[0].value);
          break;
        case '1':
          this.searchForm.patchValue({
            paymentChannel: this.chanelTypes[0].value,
            debtStatus: this.statusDebts[0].value,
          });
          break;
        default:
          break;
      }
    });
  }

  viewAction(row) {
    if (["1", "2"].includes(this.reportTypeValue)) {
      this.curRow = row;
      this.showDetail = true;
    }
  }

  closeModal() {
    this.curRow = null;
    this.showDetail = false;
  }

}
