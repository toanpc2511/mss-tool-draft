import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Pagination} from '../../../_models/pager';
import {compareDate} from '../../../shared/constants/utils';
import {AuthenticationService} from '../../../_services/authentication.service';
import {CrossCheckingService} from '../cross-checking.service';
import {NotificationService} from '../../../_toast/notification_service';
import {CreditPaymentCard} from '../../../_models/crosscheckingpayment';
declare var $: any;

@Component({
  selector: 'app-cross-checking',
  templateUrl: './cross-checking.component.html',
  styleUrls: ['./cross-checking.component.scss']
})
export class CrossCheckingComponent implements OnInit {
  @ViewChild('dpCreatedDateFrom', {static: false}) dpCreatedDateFrom: LpbDatePickerComponent;
  @ViewChild('dpCreatedDateTo', {static: false}) dpCreatedDateTo: LpbDatePickerComponent;

  activePage = 1;
  pageSize = 10;
  isSubmitted = false;
  listCards: any;
  branchesData: any [] = [];
  pagination: Pagination = new Pagination();

  crossCheckForm = this.fb.group({
      dvkd: [null, [Validators.required]],
      status: ['ALL', [Validators.required]],
      cardType: ['ALL', [Validators.required]],
      page: [this.activePage],
      size: [this.pageSize]
    }
  );

  constructor(private fb: FormBuilder,
              private crossCheckingService: CrossCheckingService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.label();
    this.getAllBranches();
  }
  get branchCode(): any { return this.crossCheckForm.get('dvkd'); }
  get status(): any { return this.crossCheckForm.get('status'); }
  get cardType(): any { return this.crossCheckForm.get('cardType'); }
  get page(): FormControl { return this.crossCheckForm.get('page') as FormControl; }
  get size(): any { return this.crossCheckForm.get('size'); }
  label(): void {
    $('.parentName').html('Đối soát');
    $('.childName').html('Gạch nợ thẻ');
  }
  getAllBranches(): any {
    this.crossCheckingService.listAllBranch().subscribe(res => {
      this.branchesData = res.items;
    }, error => {
      this.branchesData = [];
    });
  }
  // date ----
  getFromDate(): any {
    this.dpCreatedDateFrom.getValue();
    this.dpCreatedDateFrom.focus();
  }
  getToDate(): any {
    this.dpCreatedDateTo.getValue();
    this.dpCreatedDateTo.focus();
  }
  validateFromDate(): void {
    if (this.dpCreatedDateFrom.haveValue() && !this.dpCreatedDateFrom.isValid) {
      this.dpCreatedDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (!this.dpCreatedDateFrom.haveValue()) {
      this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được để trống');
    }
    else {
      this.dpCreatedDateFrom.setErrorMsg('');
    }
  }
  validateToDate(): void {
    if (this.dpCreatedDateTo.haveValue() && !this.dpCreatedDateTo.isValid) {
      this.dpCreatedDateTo.setErrorMsg('Đến ngày không hợp lệ');
    }
    else if (!this.dpCreatedDateTo.haveValue()) {
      this.dpCreatedDateTo.setErrorMsg('Đến ngày không được để trống');
    }
    else {
      this.dpCreatedDateTo.setErrorMsg('');
    }
  }
  dateValidator(): boolean {
    if ((this.dpCreatedDateFrom.haveValue() && this.dpCreatedDateFrom.isValid)
      && (this.dpCreatedDateTo.haveValue() && this.dpCreatedDateTo.isValid)) {
      this.dpCreatedDateFrom.setErrorMsg('');
      this.dpCreatedDateTo.setErrorMsg('');
      if (compareDate(this.dpCreatedDateFrom.getValue(), this.dpCreatedDateTo.getValue()) === 1) {
        this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày ');
        this.dpCreatedDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  dateFromChanged(): any {
    this.validateFromDate();
  }
  dateToChanged(): any {
    this.validateToDate();
  }
  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }
  createCancelDebt(info: any): any {
    if (this.listCards !== '' || this.listCards.length !== 0 ) {
      this.crossCheckingService.updateStatusCard(info).subscribe(res => {
        if (res.responseStatus.success && info.statusName === 'Chưa xử lý') {
          this.notificationService.showSuccess('Gạch nợ thành công, đang chờ phê duyệt', 'Thông báo');
          this.searchList();
        }else {
          this.notificationService.showError('Trạng thái giao dịch không phù hợp hoặc đã được xử lý trước đó', '');
        }
      });
    }
  }
  searchList(): any {
    this.isSubmitted = true;
    this.validateFromDate();
    this.validateToDate();
    this.dateValidator();
    const body = {
      dvkd: this.crossCheckForm.getRawValue().dvkd,
      status: this.crossCheckForm.getRawValue().status,
      cardType: this.crossCheckForm.getRawValue().cardType,
      page: this.activePage,
      size: this.pageSize,
      fromDate: this.dpCreatedDateFrom.getValue(),
      toDate: this.dpCreatedDateTo.getValue(),
    };
    if (this.crossCheckForm.valid && this.dpCreatedDateTo.errorMsg === '' && this.dpCreatedDateFrom.errorMsg === '') {
      this.crossCheckingService.listDetails(body).subscribe(
        res => {
          if (res && res.responseStatus.success) {
            this.listCards = res.crossCheckingCore;
            this.pagination = new Pagination(res.count, this.activePage, this.pageSize);
          } else {
            this.listCards = [];
          }
        });
    }
  }
  changePageSize(size: string): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) {
      return;
    }
    this.activePage = 1;
    this.page.patchValue(this.activePage);
    this.size.patchValue(this.pageSize);
    this.searchList();
  }

  setPage(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber;
      this.page.patchValue(pageNumber);
      this.searchList();
    }
  }

}
