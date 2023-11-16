import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  LIST_STATUS_APPROVED,
  TRANSACTION_TABLE_VIETTEL_POST, TRANSACTION_TABLE_VIETTEL_POST_APPROVED
} from '../shared/constants/viettel-post.constant';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {takeUntil} from 'rxjs/operators';
import {ViettelPostService} from '../shared/services/viettelpost.service';
import {DestroyService} from '../../../shared/services/destroy.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {Router} from '@angular/router';
import {compareDate} from '../../../shared/constants/utils';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {LIST_TRANS_SERVICE, TRANS_SERVICE} from '../shared/constants/url.viettel-post.service';
import * as moment from 'moment/moment';
import {ultis} from '../../../shared/utilites/function';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';
import {FormHelpers} from '../../../shared/utilites/form-helpers';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'payment-transaction',
  templateUrl: './vtp-approve-payment.component.html',
  styleUrls: ['./vtp-approve-payment.component.scss']
})
export class VtpApprovePaymentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private viettelPostService: ViettelPostService,
    private notify: CustomNotificationService,
    private router: Router,
  ) {
    this.initFormGroup();
  }

  formsSearch: FormGroup;
  listStatus = LIST_STATUS_APPROVED;
  columns: LpbDatatableColumn [] = TRANSACTION_TABLE_VIETTEL_POST_APPROVED;
  dataSource = [];
  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  formHelpers = FormHelpers;
  urlTrans = TRANS_SERVICE;
  configs = {
    filterDefault: 'status|eq|IN_PROCESS',
    defaultSort: 'makerDt:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hasAddtionButton: true,
    hiddenActionColumn: false,
  };
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  today = new Date();
  htStatus = '';
  gnStatus = '';
  status = '';


  protected readonly FormHelpers = FormHelpers;
  ngOnInit(): void {
  }
  initFormGroup(): void {
    this.formsSearch = this.fb.group({
      billCode: [''],
      formStatus: ['IN_PROCESS'],
      fromDate: [ultis.formatDate(this.today), [Validators.required]],
      toDate: [ultis.formatDate(this.today), [Validators.required]]
    }, {validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]});
  }

  search(): void {
    this.searchConditions = this.calcSearchConditions();
    console.log('searchConditions', this.searchConditions);
  }

  calcSearchConditions(): any {
    const valueForm = this.formsSearch.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    if (this.formsSearch.get('formStatus').value === 'TIMEOUT'){
      this.htStatus = 'TIMEOUT';
      this.gnStatus = '';
      this.status = 'APPROVE';
    }else if (this.formsSearch.get('formStatus').value === 'BOSUNG') {
      this.gnStatus = 'TIMEOUT';
      this.htStatus = 'SUCCESS';
      this.status = 'APPROVE';
    }else if (this.formsSearch.get('formStatus').value === 'IN_PROCESS') {
      this.htStatus = '';
      this.gnStatus = '';
      this.status = 'IN_PROCESS';
    }else {
      this.htStatus = '';
      this.gnStatus = '';
      this.status = 'APPROVE';
    }
    return [
      {
        property: 'billCode',
        operator: 'eq',
        value: this.formsSearch.get('billCode').value
      },
      {
        property: 'status',
        operator: 'eq',
        value: this.status
      },
      {
        property: 'makerDt',
        operator: 'gte',
        value: fromDate
      },
      {
        property: 'makerDt',
        operator: 'lte',
        value: toDate
      },
      {
        property: 'htStatus',
        operator: 'eq',
        value: this.htStatus
      },
      {
        property: 'gnStatus',
        operator: 'eq',
        value: this.gnStatus
      }
    ];
 }


  onViewDetail(value: any): void {
    console.log('id trans', value.id);
    this.router.navigate(['viettel-post-service/payment-transaction/view-detail-transaction'], {queryParams: {id: value.id}});
  }

}
