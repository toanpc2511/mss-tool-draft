import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment/moment';
import {compareDate} from '../../../shared/constants/utils';
import {FormBuilder} from '@angular/forms';
import {TYPE_TRANSACTION_SEARCH_APPROVE} from '../shared/constants/card-service-constants';
import {ReportCardTransactionService} from '../shared/services/report-card-transaction.service';
import {saveAs} from 'file-saver';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {CardServiceCommonService} from '../shared/services/card-service-common.service';
declare var $: any;

@Component({
  selector: 'app-report-card-transaction',
  templateUrl: './report-card-transaction.component.html',
  styleUrls: ['./report-card-transaction.component.scss']
})
export class ReportCardTransactionComponent implements OnInit {

  constructor(
    private notify: CustomNotificationService,
    private fb: FormBuilder,
    private cardTransaction: ReportCardTransactionService,
    private cardService: CardServiceCommonService,
  ) {
    this.userInfoNow = JSON.parse(localStorage.getItem('userInfo'));
  }
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  value = 50;
  isLoading = false;
  branchesData = [];
  userInfoNow: any = [];
  lstTypeTransactionSearch = TYPE_TRANSACTION_SEARCH_APPROVE;
  lstCardProduct: any;

  reportCardTransaction = this.fb.group({
    branchCode: [{value: null, disabled: false}],
    customerCode: [null],
    ebsActionCode: [''],
    cardProductCode: [null],
    cardId: [null],
    formatReport: ['EXCEL']
    }
  );

  ngOnInit(): void {
    $('.parentName').html('Dịch vụ hỗ trợ thẻ');
    $('.childName').html('Báo cáo trạng thái giao dịch thẻ');
    this.getBranches();
    this.getAllCardProductCode();
  }

  get branchCode(): any { return this.reportCardTransaction.get('branchCode'); }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }

  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }

  dateToChanged(): any {
    this.validateToDate();
    this.validateFromDate();
  }

  dateFromChanged(): any {
    this.validateFromDate();
    this.validateToDate();
  }

  validateFromDate(): void{
    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (!this.dpDateFrom.haveValue()) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
      this.dpDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    }
    else if (!this.dpDateTo.haveValue()) {
      return this.dpDateTo.setErrorMsg('Đến ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    }
    else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  getBranches(): void {
    this.cardTransaction.listBranches().subscribe(rs => {
      if (this.userInfoNow.branchCode !== '001' ) {
        this.branchCode.patchValue(this.userInfoNow.branchCode, {enable: false});
        this.branchCode.disable();
      }
      if (rs && rs.responseStatus.success) {
        this.branchesData = rs.items;
      } else {
        this.branchesData = [];
      }
    }, error => {
      this.branchesData = [];
    });
  }

  downloadFile(): any {
    this.validateToDate();
    this.validateFromDate();
    const req = {
      fromDate: this.dpDateFrom.getValue(),
      toDate: this.dpDateTo.getValue(),
      ebsActionCode: this.reportCardTransaction.getRawValue().ebsActionCode,
      customerCode: this.reportCardTransaction.getRawValue().customerCode,
      cardProductCode: this.reportCardTransaction.getRawValue().cardProductCode,
      branchCodeDo: this.reportCardTransaction.getRawValue().branchCode,
      formatReport: this.reportCardTransaction.getRawValue().formatReport,
      cardCoreId: this.reportCardTransaction.getRawValue().cardId
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.isLoading = true;
      this.cardTransaction.exportFile(req).subscribe(res => {
        this.isLoading = false;
        let fileName = moment().format('yyyyMMDD');
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        if (req.formatReport === 'EXCEL') {
          saveAs(res.body, 'Report-card-transaction_' + fileName + '.xlsx');
        } else {
          saveAs(res.body, 'Report-card-transaction_' + fileName + '.pdf');
        }
        this.notify.success('Thông báo', 'Tải xuống thành công');
      }, err => {
        this.isLoading = false;
        this.notify.warning('Thông báo', 'Không có dữ liệu');
      });
    }
  }

  getAllCardProductCode(): void {
    this.cardService.getAllCardProductCode2().subscribe(
      (res) => {
        if (res && res.responseStatus.success) {
          this.lstCardProduct = res.items;
        } else {
          this.lstCardProduct = [];
        }
      },
      (error) => {
        this.lstCardProduct = [];
        throw error;
      }
    );
  }

}
