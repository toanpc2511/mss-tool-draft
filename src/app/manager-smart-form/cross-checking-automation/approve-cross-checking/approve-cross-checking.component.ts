import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {CrossCheckingService} from '../cross-checking.service';
import {Pagination} from '../../../_models/pager';
import {compareDate} from '../../../shared/constants/utils';
import {NotificationService} from '../../../_toast/notification_service';
declare var $: any;

@Component({
  selector: 'app-approve-cross-checking',
  templateUrl: './approve-cross-checking.component.html',
  styleUrls: ['./approve-cross-checking.component.scss']
})
export class ApproveCrossCheckingComponent implements OnInit {
  @ViewChild('dpCreatedDateFrom', {static: false}) dpCreatedDateFrom: LpbDatePickerComponent;
  @ViewChild('dpCreatedDateTo', {static: false}) dpCreatedDateTo: LpbDatePickerComponent;

  activePage = 1;
  pageSize = 10;
  isSubmitted = false;
  listCards: any;
  branchesData: any [] = [];
  pagination: Pagination = new Pagination();
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: boolean;

  approveForm = this.fb.group({
      dvkd: [null, [Validators.required]],
      status: ['CHO_DUYET', [Validators.required]],
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
  get branchCode(): any { return this.approveForm.get('dvkd'); }
  get status(): any { return this.approveForm.get('status'); }
  get cardType(): any { return this.approveForm.get('cardType'); }
  get page(): FormControl { return this.approveForm.get('page') as FormControl; }
  get size(): any { return this.approveForm.get('size'); }
  label(): void {
    $('.parentName').html('Đối soát');
    $('.childName').html('Kiểm tra và phê duyệt');
  }
  getAllBranches(): any {
    this.crossCheckingService.listAllBranch().subscribe(res => {
      // Kiểm tra dữ liệu trả về có thành công và giá trị hay không
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
        this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
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
  searchDetails(): any {
    this.isSubmitted = true;
    this.validateFromDate();
    this.validateToDate();
    this.dateValidator();
    const body = {
      dvkd: this.approveForm.getRawValue().dvkd,
      status: this.approveForm.getRawValue().status,
      cardType: this.approveForm.getRawValue().cardType,
      page: this.activePage,
      size: this.pageSize,
      fromDate: this.dpCreatedDateFrom.getValue(),
      toDate: this.dpCreatedDateTo.getValue(),
    };
    if (this.approveForm.valid && this.dpCreatedDateTo.errorMsg === '' && this.dpCreatedDateFrom.errorMsg === '') {
      this.crossCheckingService.listNeedApproval(body).subscribe(
        res => {
          if (res.crossCheckingCore) {
            this.listCards = res.crossCheckingCore;
            this.pagination = new Pagination(res.count, this.activePage, this.pageSize);
          } else {
            this.listCards = [];
          }
        });
    }
  }
  approve(info: any): any {
    if (this.listCards !== '' || this.listCards.length !== 0 ) {
      this.isLoading = true;
      if (info.statusName !== 'Chờ Duyệt') {
        this.isLoading = false;
        this.notificationService.showError('Trạng thái giao dịch không phù hợp hoặc đã được xử lý trước đó', '');
      } else {
        this.crossCheckingService.approveCard(info).subscribe(res => {
          if (info.statusName === 'Chờ Duyệt' && res.responseStatus.success === false) {
            this.isLoading = false;
            this.notificationService.showError('Duyệt Thất Bại', 'Thông báo');
            this.searchDetails();
          }
          else if (info.statusName === 'Chờ Duyệt' && res.responseStatus.success === true) {
            this.isLoading = false;
            this.notificationService.showSuccess('Duyệt Thành Công', 'Thông báo');
            this.searchDetails();
          }
        });
      }
    }
  }
  refuse(info: any): any {
    if (this.listCards !== '' || this.listCards.length !== 0 ) {
      if (info.statusName !== 'Chờ Duyệt') {
        this.notificationService.showError('Trạng thái giao dịch không phù hợp hoặc đã được xử lý trước đó', '');
      } else {
        this.isLoading = true;
        this.crossCheckingService.refuseCard(info).subscribe(res => {
          this.isLoading = false;
          if (info.statusName === 'Chờ Duyệt' && res.responseStatus.success === true) {
            this.notificationService.showSuccess('Từ chối duyệt', 'Thông báo');
            this.searchDetails();
          }
        });
      }
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
    this.searchDetails();
  }

  setPage(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber;
      this.page.patchValue(pageNumber);
      this.searchDetails();
    }
  }

}
