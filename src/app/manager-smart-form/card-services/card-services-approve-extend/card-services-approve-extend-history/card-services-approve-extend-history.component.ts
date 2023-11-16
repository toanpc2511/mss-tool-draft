import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Pagination } from 'src/app/_models/pager';
import { UserInfo } from 'src/app/_models/user';
import { NotificationService } from 'src/app/_toast/notification_service';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { CardDialogComponent } from '../../shared/components/card-dialog/card-dialog.component';
import {
  EBS_ACTIONS_SEARCH,
  EBS_ACTION_SEARCH_CODE,
  EXTEND_STEP,
  FETCH_STATUS,
  FORMAT_REQUEST_DATE,
  INPUT_TYPE_SEARCH_CARD_BACK,
  LOCK_STATUSES,
  SEARCH_STORIES_TYPES,
  SERVICE_STATUSES,
  SERVICE_STATUSES_COLOR,
} from '../../shared/constants/card-service-constants';
import {
  CardEbsInfo,
  CardSearchInfo,
} from '../../shared/models/card-inssuance';
import { BranchInfo } from '../../shared/models/card-service-common';
import { EbsServicesApproveObject } from '../../shared/models/card-services-approve';
import { SearchServiceHistoryRequest } from '../../shared/models/card-services-extend';
import { CardServiceCommonService } from '../../shared/services/card-service-common.service';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';

interface IEbsActionSearch {
  code: string;
  name: string;
  permittedCodes: string[];
}

@Component({
  selector: 'app-card-services-approve-extend-history',
  templateUrl: './card-services-approve-extend-history.component.html',
  styleUrls: [
    '../../card-services-extend/card-services-extend-step-search/card-services-extend-step-search.component.scss',
    './card-services-approve-extend-history.component.scss',
  ],
})
export class CardServicesApproveExtendHistoryComponent
  implements OnInit, AfterViewInit
{
  @Input() formSearch: FormGroup;
  @Output() evtClickSendRequest = new EventEmitter();
  @Output() eventBackStep = new EventEmitter();
  @ViewChild('fromDate', { static: true }) fromDate: LpbDatePickerComponent;
  @ViewChild('toDate', { static: true }) toDate: LpbDatePickerComponent;
  readonly FETCH_STATUS = FETCH_STATUS;
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isFetchExport: number = FETCH_STATUS.IDLE;
  isFetch: number = FETCH_STATUS.IDLE;
  isShowEbsActionSearchMsg: boolean = false;
  lstCardServiceHistories: CardSearchInfo[] = [];
  userInfo: any;
  lstBranch: BranchInfo[] = [];
  lstUserInput: UserInfo[] = [];
  preRequest: any;
  selectedCardItem: CardSearchInfo;
  cardEbsInfo: CardEbsInfo;
  pagination: Pagination = new Pagination();
  pageIndex = 1;
  pageSize = 10;
  ebsActionsSearch = EBS_ACTIONS_SEARCH;
  ebsActionSearch: IEbsActionSearch;
  extendStep = EXTEND_STEP;
  serviceStatuses = SERVICE_STATUSES.filter(
    (status) => status.code === 'S' || status.code === 'R'
  );
  serviceStatusesColor = SERVICE_STATUSES_COLOR;
  maxDate = new Date();

  constructor(
    private cdref: ChangeDetectorRef,
    private cardServiceCommonService: CardServiceCommonService,
    private cardServicesExtendService: CardServicesExtendService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.getAllBranch();
    this.getAllUserInput();
  }
  ngAfterViewInit(): void {
    this.initFormSearch();
    this.cdref.detectChanges();
  }

  get branchCode(): any {
    return this.formSearch.get('branchCode');
  }
  initFormSearch(): void {
    if (this.formSearch?.getRawValue()) {
      const formSearchValue = this.formSearch?.getRawValue();
      if (formSearchValue.fromDate) {
        this.fromDate.setValue(formSearchValue.fromDate);
      }
      if (formSearchValue.toDate) {
        this.toDate.setValue(formSearchValue.toDate);
      }

      if (formSearchValue.pageIndex) {
        this.pageIndex = formSearchValue.pageIndex;
      }
      if (formSearchValue.pageSize) {
        this.pageSize = formSearchValue.pageSize;
      }

      if (formSearchValue.fromDate && formSearchValue.toDate) {
        this.searchHistories();
      }
    }
  }
  getAllBranch(): void {
    this.cardServiceCommonService.getAllBranch2().subscribe(
      (res) => {
        if (res && res.responseStatus.success) {
          this.lstBranch = res.items;
        } else {
          this.lstBranch = [];
        }
      },
      (error) => {
        this.lstBranch = [];
        throw error;
      }
    );
  }

  getAllUserInput(): void {
    if (this.userInfo) {
      this.lstUserInput = [this.userInfo];
    }
  }

  submitSearchForm(): void {
    this.pageIndex = 1;
    this.searchHistories();
  }

  searchHistories(): void {
    this.formSearch.markAllAsTouched();
    let flag = true;

    if (!this.toDateChange()) {
      flag = false;
    }
    if (!this.fromDateChange()) {
      flag = false;
    }
    if (this.formSearch.invalid || !flag) {
      return;
    }
    // lấy giá trị của formSearch và trim() và nếu undefine => ''
    const frmValues = this.formSearch.getRawValue();

    for (let key in frmValues) {
      frmValues[key] = frmValues[key] ? frmValues[key]?.toString()?.trim() : '';
    }

    const request: SearchServiceHistoryRequest = {
      branchCodeDo:
        this.userInfo.branchCode === '001'
          ? frmValues.branchCodeDo.trim()
          : this.userInfo.branchCode,
      inputBy: frmValues.inputBy.trim(),
      approveBy: frmValues.approveBy.trim(),
      actionCode: frmValues.actionCode ? frmValues.actionCode.trim() : '',
      ...(!!frmValues.serviceStatus && {
        serviceStatus: frmValues.serviceStatus.trim(),
      }),
      searchType: !!frmValues.serviceStatus
        ? SEARCH_STORIES_TYPES.SINGLE_STT
        : SEARCH_STORIES_TYPES.KSV_APPROVED,
      approveDateFrom: moment(this.fromDate.getSelectedDate()).format(
        FORMAT_REQUEST_DATE
      ),
      approveDateTo: moment(this.toDate.getSelectedDate()).format(
        FORMAT_REQUEST_DATE
      ),
      page: this.pageIndex,
      size: this.pageSize,
      // khởi tạo 4 cái thuộc tính của txtSearch bằng ''
      customerCode: '',
      uidValue: '',
      phoneNumber: '',
      cardId: '',
    };

    // sử dụng một vòng lặp để gán các giá trị cho request
    for (let input of INPUT_TYPE_SEARCH_CARD_BACK) {
      if (frmValues.type === input.code) {
        request[input.control] = frmValues.txtSearch;
      }
    }

    this.preRequest = request;
    this.cardServicesExtendService
      .getHistories(request)
      .pipe(
        finalize(() => {
          this.formSearch.get('fromDate').setValue(this.fromDate.getValue());
          this.formSearch.get('toDate').setValue(this.toDate.getValue());
          // this is called on both success and error
          this.formSearch.patchValue({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          });
        })
      )
      .subscribe(
        (res: any) => {
          if (res && res.responseStatus.success) {
            this.lstCardServiceHistories = res?.items;
            this.pagination = new Pagination(
              res.count,
              this.pageIndex,
              this.pageSize
            );
            this.ebsActionSearch = EBS_ACTIONS_SEARCH.find(
              (e) => e.code === frmValues.ebsActionSearch
            );
          } else {
            this.lstCardServiceHistories = [];
            this.notificationService.showError(
              res.responseStatus.codes[0].detail,
              'Thông báo'
            );
          }
        },
        (error) => {
          this.lstCardServiceHistories = [];
          this.handleErrorApi();
        }
      );
  }

  handleErrorApi(responseStatus?): void {
    if (responseStatus?.success === false) {
      if (responseStatus?.codes?.length) {
        responseStatus.codes.forEach((code) => {
          this.notificationService.showError(
            code.msg || 'Có lỗi xảy ra. Xin vui lòng thử lại',
            'Thông báo'
          );
        });
      }
      return;
    }
    this.notificationService.showError(
      'Có lỗi xảy ra. Xin vui lòng thử lại',
      'Thông báo'
    );
  }

  clearBranchCode(): void {
    this.formSearch.controls.branchCodeDo.setValue('');
  }

  clearCardProductCode(): void {
    this.formSearch.controls.cardProductCode.setValue('');
  }

  clearEbsActionSearch(): void {
    this.formSearch.controls.ebsActionSearch.setValue('');
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageIndex = 1;
    this.pageSize = pageSize;
    this.searchHistories();
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.searchHistories();
  }

  switchPage(page?: string): void {
    this.eventBackStep.emit(page);
  }

  fromDateChange(): boolean {
    this.validateDate(this.toDate, 'toDate');
    return this.validateDate(this.fromDate, 'fromDate');
  }

  toDateChange(): boolean {
    this.validateDate(this.fromDate, 'fromDate')
    return this.validateDate(this.toDate, 'toDate');
  }

  validateDate(date: LpbDatePickerComponent, dateType: 'fromDate' | 'toDate'): boolean {
    let name = dateType === 'fromDate' ? 'Từ ngày' : 'Đến ngày';

    date.setErrorMsg('');
    if (!date.haveValue()) {
      date.setErrorMsg(`${name} không được bỏ trống`);
      return false;
    }

    date.setErrorMsg('');
    if (!date.haveValidDate()) {
      date.setErrorMsg(`${name} không hợp lệ`);
      return false;
    }

    if (this.fromDate.haveValue() && this.toDate.haveValue()) {
      const f_date = moment(this.fromDate.getSelectedDate(), 'DD/MM/YYYY');
      const t_date = moment(this.toDate.getSelectedDate(), 'DD/MM/YYYY');

      if (this.compareDate(f_date, t_date) > 0) {
        const dateErrorMsg =
          dateType === 'fromDate'
            ? 'Từ ngày phải nhỏ hơn hoặc bằng đến ngày'
            : 'Đến ngày phải lớn hơn hoặc bằng từ ngày';

        date.setErrorMsg(dateErrorMsg);
        return false;
      } else {
        date.setErrorMsg('');
      }
    }
    return true;
  }

  compareDate(f_date: any, t_date: any): number {
    const from = moment(f_date, 'DD/MM/YYYY').toDate().getTime();
    const to = moment(t_date, 'DD/MM/YYYY').toDate().getTime();

    if (from > to) {
      return 1;
    } else if (from < to) {
      return -1;
    } else {
      return 0;
    }
  }

  exportHistories(): void {
    const approveDateToLast3Months = moment(
      this.preRequest.approveDateTo,
      'YYYY/MM/DD'
    ).subtract({ months: 3 });

    if (
      approveDateToLast3Months.isAfter(
        moment(this.preRequest.approveDateFrom, 'YYYY/MM/DD')
      )
    ) {
      this.dialog.open(CardDialogComponent, {
        data: {
          title: 'Thông báo',
          messages: ['Thời hạn export giới hạn trong vòng 3 tháng'],
          buttons: {
            dismiss: {
              display: false,
            },
            confirm: {
              display: true,
              label: 'Quay lại',
            },
          },
        },
      });
      return;
    }
    this.isFetchExport = FETCH_STATUS.LOADING;

    this.cardServicesExtendService.exportHistories(this.preRequest).subscribe(
      (res) => {
        let fileName = `history_card_report_${this.userInfo.userName}_xxx`;
        const contentDisposition = res.headers.get('Content-Disposition');

        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }

        FilesHelper.downLoadFromBlob(
          { blob: res.body, name: fileName },
          {
            onSuccess: () => {
              this.isFetchExport = FETCH_STATUS.COMPLETED;
              this.notificationService.showSuccess(
                'Tải xuống thành công',
                'Thông báo'
              );
            },
            onError: (error) => {
              this.isFetchExport = FETCH_STATUS.ERROR;
              this.handleErrorApi();
            },
          }
        );
      },
      (error) => {
        this.isFetchExport = FETCH_STATUS.ERROR;
        this.handleErrorApi();
      }
    );
  }

  showDetail(selectedItem: EbsServicesApproveObject): void {
    let actionCode = selectedItem?.actionCode;
    if (LOCK_STATUSES.find((stat) => stat.code === actionCode)) {
      actionCode = EBS_ACTION_SEARCH_CODE.LOCK;
    }
    // this.isFetch = FETCH_STATUS.LOADING;
    // this.cardServicesExtendService
    //   .getCardInfo(selectedItem.cardCoreId)
    //   .pipe(
    //     finalize(() => {
    //       this.isFetch = FETCH_STATUS.COMPLETED;
    //     })
    //   )
    //   .subscribe(
    //     (res) => {
    //       const { responseStatus, ...cardInfo } = res;
    //       if (!responseStatus?.success) {
    //         this.handleErrorApi(responseStatus);
    //       }
    //       selectedItem = { ...selectedItem, ...cardInfo };
    //       this.evtClickSendRequest.emit({
    //         selectedItem,
    //         step: `DETAIL_${selectedItem.actionCode}`,
    //       });
    //     },
    //     (error) => {
    //       this.handleErrorApi();
    //     }
    //   );
    this.evtClickSendRequest.emit({
      selectedItem,
      step: `DETAIL_${selectedItem.actionCode}`,
    });
  }
}
