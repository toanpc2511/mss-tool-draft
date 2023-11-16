import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { LbpValidators } from 'src/app/shared/validatetors/lpb-validators';

import {
  ALLOW_STATUS_CODE,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES,
} from '../shared/constants/common';

import { Observable, timer } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { CITAD_PRODUCTS, CITAD_SYNC_STATUS, CITAD_SYNC_STATUS_COLOR, CITAD_SYNC_STATUS_VI } from '../shared/constants/citad';
import {
  FOOTER_ACTIONS,
  INTERNAL_TRANSFER_PRODUCTS,
} from '../shared/constants/internal';
import { NAPAS_PRODUCTS } from '../shared/constants/napas';
import { TransferFormService } from '../shared/interface/common';
import {
  BranchInfo,
  SearchResponseData,
  TRANS_TYPE,
} from '../shared/models/common';
import { CitadTransferFormService } from '../shared/services/citad/citad-transfer-form.service';
import { InternalTransferFormService } from '../shared/services/internal/internal-transfer-form.service';
import { NapasTransferFormService } from '../shared/services/napas/napas-transfer-form.service';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CitadTransferService } from '../shared/services/citad/citad-transfer.service';
import { CitadSyncInfo } from '../shared/models/citad';
import { finalize } from 'rxjs/operators';
import { error } from 'console';

declare const $: any;

type Actions = {
  icon: string;
  actionName: string;
  routerLink: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.scss',
    '../shared/styles/lpb-transfer-service-list.scss',
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild(LpbDatatableComponent) lpbDatatable: LpbDatatableComponent;
  @ViewChild('datatable', { read: ElementRef }) lpbDatatableRef!: ElementRef;
  waitReversedRecordExist = false;

  formSearch: FormGroup;
  TRANSACTION_STATUSES = TRANSACTION_STATUSES;
  IDENTITY_TYPES_ARR = [];
  lstBranch: BranchInfo[] = [];
  INTERNAL_TRANSFER_PRODUCTS = INTERNAL_TRANSFER_PRODUCTS;
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  lstProduct = [];
  lstAccount = [];

  columns = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transCode',
      headerIndex: 2,
      className: 'w-200-px justify-content-center',
    },
    {
      headerName: 'Mã giao dịch Core',
      headerProperty: 'coreTransCode',
      headerIndex: 3,
      className: 'w-200-px justify-content-center',
    },
    {
      headerName: 'Số CIF',
      headerProperty: 'cifNo',
      headerIndex: 4,
      className: 'w-100-px justify-content-center',
    },
    {
      headerName: 'STK ghi nợ',
      headerProperty: 'acn',
      headerIndex: 5,
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'STK ghi có',
      headerProperty: 'recipientAcn',
      headerIndex: 6,
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'Mã đơn vị',
      headerProperty: 'branchCode',
      headerIndex: 7,
      className: 'w-100-px justify-content-center',
    },
    {
      headerName: 'Mã sản phẩm',
      headerProperty: 'productCode',
      headerIndex: 8,
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'transactionAmount',
      headerIndex: 9,
      type: 'currency',
      className: 'w-150-px',
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'curCode',
      headerIndex: 10,
      className: 'w-100-px justify-content-center',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 11,
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 12,
      type: 'datetime',
      className: 'w-200-px justify-content-center',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 12,
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 13,
      className: 'w-150-px justify-content-center',
    },
  ];

  allowStatusesFilter = '';
  userInfo: any;
  userRole: any;
  allowStatuses;
  searchType = 'HO';
  filterDefault = '';

  actions: ActionModel[] = [];
  citadSyncInfo: CitadSyncInfo;
  isSynchronizing = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: LpbDialogService,
    private matdialog: MatDialog,
    private internalTransferFormService: InternalTransferFormService,
    private citadTransferFormService: CitadTransferFormService,
    private napasTransferFormService: NapasTransferFormService,
    private customNotificationService: CustomNotificationService,
    private citadTransferService: CitadTransferService,
    private http: HttpService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));
  }

  ngOnInit(): void {
    $('.parentName').html('Chuyển tiền');
    $('.childName').html('Danh sách giao dịch');

    this.dialogService.setDialog(this.matdialog);

    this.lstProduct = [
      ...INTERNAL_TRANSFER_PRODUCTS,
      ...CITAD_PRODUCTS,
      ...NAPAS_PRODUCTS,
    ];

    // this.lstProduct = this.lstProduct.sort((item1, item2) =>{
    //   const code1: string = item1.code;
    //   const code2: string = item2.code;
    //   return code1.localeCompare(code2);
    // })

    this.formSearch = this.fb.group({
      transCode: [null, Validators.maxLength(50)],
      transType: ['U'],
      productCode: [null],
      cifNo: [null, Validators.maxLength(20)],
      acn: [null, [Validators.maxLength(20)]],
      acnType: ['N'],
      branchCode: [null, LbpValidators.requiredAllowEmpty],
      status: [null],
      createdBy: [null],
      createdDate: [null],
      toCreatedDate: [null],
    });

    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // define a constant for the date format
    this.allowStatuses = [];

    if (isGDV()) {
      this.searchType = 'GDV';
      this.allowStatuses = Object.values(ALLOW_STATUS_CODE.GDV);
    } else {
      this.searchType = 'KSV';
      this.allowStatuses = Object.values(ALLOW_STATUS_CODE.KSV);
    }

    this.TRANSACTION_STATUSES = TRANSACTION_STATUSES.filter((e) => {
      return this.allowStatuses.includes(e.code);
    });
    const today = moment().startOf('day').format(DATE_FORMAT); // get the start of today
    const endOfToday = moment().endOf('day').format(DATE_FORMAT); // get the end of today

    this.filterDefault = `createdDate|gte|${today}&createdDate|lt|${endOfToday}`;

    if (!isHoiSo()) {
      if (isGDV()) {
        this.filterDefault = `${this.filterDefault}&createdBy|eq|${this.userInfo.userName}&branchCode|eq|${this.userInfo.branchCode}`;
      } else {
        this.filterDefault = `${this.filterDefault}&branchCode|eq|${this.userInfo.branchCode}`;
      }
    } else {
      this.filterDefault = `${this.filterDefault}&branchCode|eq|${this.userInfo.branchCode}`;
    }

    if (isHoiSo() && isGDV()) {
      this.actions = [
        {
          actionIcon: 'sync',
          actionName: 'Đồng bộ mã ngân hàng',
          actionClick: () => {
            this.syncCitadCode();
          },
        },
      ];
      this.updateCitadSyncInfo();
    } else {
      this.actions = [];
    }
  }

  updateCitadSyncInfo(showToast: boolean = false) {
    this.citadTransferService.getSyncCitadStt().subscribe(
      (res) => {
        this.citadSyncInfo = {
          ...res.data,
          color: CITAD_SYNC_STATUS_COLOR[res.data.status],
          statusVi: CITAD_SYNC_STATUS_VI[res.data.status],
          lastSyncDt: Number(res.data.lastSyncDt) * 1000,
        };

        if(!showToast){
          return;
        }
        if (res.data.status === CITAD_SYNC_STATUS.NO_PROCESS) {
          this.customNotificationService.success(
            'Thông báo',
            'Cập nhật thành công'
          );
        } else if(res.data.status === CITAD_SYNC_STATUS.FAILURE) {
          this.customNotificationService.error(
            'Thông báo',
            'Cập nhật thất bại'
          );
        }
      },
      (error) => {
        this.citadSyncInfo = {
          status: CITAD_SYNC_STATUS.FAILURE,
          color: CITAD_SYNC_STATUS_COLOR.FAILURE,
          statusVi: CITAD_SYNC_STATUS_VI.FAILURE,
          lastSyncDt: Number(Date.now() / 1000),
        };

        if(!showToast){
          return;
        }
        this.customNotificationService.error('Thông báo', 'Cập nhật thất bại');
      }
    );
  }

  syncCitadCode() {
    this.isSynchronizing = true;
    this.citadTransferService
      .syncCitadBanksData()
      .pipe(
        finalize(() => {
          // If synchronization is done => update immediately
          if(!this.isSynchronizing){
            this.updateCitadSyncInfo(true);
          }
          // Else wait 1s then update
          else {
            timer(60000).subscribe(() => {
              this.isSynchronizing = false;
              this.updateCitadSyncInfo(true);
            });
          }
        })
      )
      .subscribe((res) => {
        this.isSynchronizing = false;
      }, (error)=> {
        if(error?.message){ // If request is timeOut
          this.isSynchronizing = false;
          this.customNotificationService.error('Thông báo', error?.message);
        }
      });
  }

  handleRawData(response: DataResponse<SearchResponseData[]>) {
    const statuses = [
      TRANS_STATUS_CODES.WAIT_APPROVE,
      TRANS_STATUS_CODES.WAIT_REVERT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT,
    ];
    this.lpbDatatable.dataSource = response.data.map((record) => {
      if (statuses.includes(record.status)) {
        return { ...record, approveBy: null };
      }
      return record;
    });

    setTimeout(() => {
      this.updateSuspiciousItem(response.data);
    });

    if (isKSV()) {
      this.checkWaitReversed().subscribe((exist) => {
        this.waitReversedRecordExist = exist;
        this.updateTableStatus(this.waitReversedRecordExist, response.data);
      });
    }
  }

  checkWaitReversed() {
    const params = {
      page: '0',
      size: '10',
      filter: this.filterDefault,
      sort: '',
    };
    const apiServiceURL = '/transfer-service/transaction?searchType=KSV';
    const url = `${environment.apiUrl + apiServiceURL}`;
    return new Observable<boolean>((observer) => {
      this.http.get<SearchResponseData[]>(url, { params }).subscribe(
        (res) => {
          if (res?.data) {
            const waitReversedExist = res.data.some((tran) =>
              this.isWaitReveredItem(tran)
            );
            observer.next(waitReversedExist);
          } else {
            observer.next(false);
          }
        },
        (error) => {
          observer.next(false);
        }
      );
    });
  }

  updateTableStatus(
    waitReversedRecordExist: boolean,
    tableData: SearchResponseData[]
  ) {
    const rowsNodeList =
      this.lpbDatatableRef.nativeElement.querySelectorAll('tr');
    rowsNodeList.forEach((row: HTMLTableRowElement, index) => {
      const transCodeLink = row.querySelector('a');
      if (index > 0 && transCodeLink) {
        const transCode = transCodeLink.innerHTML.trim();
        const rowData = tableData.find((data) => data.transCode === transCode);

        if (this.isWaitReveredItem(rowData) && waitReversedRecordExist) {
          row.classList.add('wait-reversed-row');
        } else {
          row.classList.remove('wait-reversed-row');
        }
      }
    });
  }

  isWaitReveredItem(item: SearchResponseData) {
    return (
      item.status === TRANS_STATUS_CODES.WAIT_REVERT &&
      item.transType === 'CITAD' &&
      item.branchCode === this.userInfo?.branchCode
    );
  }

  updateSuspiciousItem(tableData: SearchResponseData[]) {
    const rowsNodeList =
      this.lpbDatatableRef.nativeElement.querySelectorAll('tr');
    rowsNodeList.forEach((row: HTMLTableRowElement, index) => {
      const transCodeLink = row.querySelector('a');
      if (index > 0 && transCodeLink) {
        const transCode = transCodeLink.innerHTML.trim();
        const rowData = tableData.find((data) => data.transCode === transCode);

        if (this.isSuspiciousItem(rowData)) {
          row.classList.add('suspicious-row');
        } else {
          row.classList.remove('suspicious-row');
        }
      }
    });
  }

  isSuspiciousItem(item: SearchResponseData) {
    return (
      item.status === TRANS_STATUS_CODES.SUSPICIOUS ||
      item.status === TRANS_STATUS_CODES.SUSPICIOUS_REVERT
    );
  }

  openWaitReversedWarning() {
    this.dialogService.openDialog(
      {
        title: 'Thông báo',
        messages: ['Vui lòng duyệt giao dịch Reverse đang chờ duyệt.'],
        buttons: {
          confirm: {
            display: false,
          },
          dismiss: {
            display: true,
            label: 'Quay lại',
          },
        },
      },
      () => {}
    );
  }

  isDisabledUpdate: (row: any) => boolean = (row) => {
    return this.isDisabledAction(row, FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT);
  };

  isDisabledDelete: (row: any) => boolean = (row) => {
    return this.isDisabledAction(row, FOOTER_BUTTON_CODE.FOOTER_ACTION_DELETE);
  };

  private isDisabledAction(row: any, BUTTON_CODE): boolean {
    // Nếu không phải là GDV hoặc KSV, trả về true
    if (!isGDV() && !isKSV()) {
      return true;
    }
    // Nếu không phải là GDV, trả về true
    if (!isGDV()) {
      return true;
    }
    // Nếu là GDV nhưng không phải là người tạo row, trả về true
    if (isGDV() && row.createdBy !== this.userInfo.userName) {
      return true;
    }
    // Nếu không có action nào có code và enableStatus phù hợp với row, trả về true
    return !FOOTER_ACTIONS.some(
      (e) => e.code === BUTTON_CODE && e.enableStatus.includes(row?.status)
    );
  }

  submitSearchTransaction(): void {
    this.filterDefault = '';
    this.searchCondition = this.getSearchCondition(
      this.formSearch.getRawValue()
    );
  }

  getSearchCondition(formSearchValues): {
    property: string;
    operator: string;
    value: any;
  }[] {
    formSearchValues = formSearchValues || {};

    const result = Object.keys(formSearchValues || {})
      .filter((e) => {
        return (
          formSearchValues[e] &&
          !['createdDate', 'toCreatedDate', 'transCode', 'acn'].includes(e) &&
          !(e === 'branchCode' && formSearchValues[e] === 'need_all_all_all')
        );
      })
      .map((e) => {
        switch (e) {
          case 'transType': {
            let property;
            if (formSearchValues['transType'] === 'U') {
              property = 'transCode';
            } else {
              property = 'coreTransCode';
            }
            return {
              property,
              operator: 'eq',
              value: formSearchValues['transCode'],
            };
          }
          case 'acnType': {
            let property;
            if (formSearchValues['acnType'] === 'N') {
              property = 'acn';
            } else {
              property = 'recipientAcn';
            }
            return {
              property,
              operator: 'eq',
              value: formSearchValues['acn'],
            };
          }
          default: {
            return {
              property: e,
              operator: 'eq',
              value: formSearchValues[e],
            };
          }
        }
      })
      .concat([
        {
          property: 'createdDate',
          operator: 'gte',
          value: formSearchValues.createdDate
            ? moment(formSearchValues.createdDate, 'DD/MM/YYYY')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            : undefined,
        },
        {
          property: 'createdDate',
          operator: 'lte',
          value: formSearchValues.toCreatedDate
            ? moment(formSearchValues.toCreatedDate, 'DD/MM/YYYY')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            : undefined,
        },
      ])
      .filter((e) => {
        return e.value && e.value?.toString().replace(/\s/g, '') !== '';
      })
      .map((e) => {
        return { ...e, value: e.value.toString().trim() };
      });

    return result;
  }

  getFormService(transType: TRANS_TYPE): TransferFormService {
    switch (transType) {
      case 'INTERNAL': {
        return this.internalTransferFormService;
      }

      case 'CITAD': {
        return this.citadTransferFormService;
      }

      case 'NAPAS': {
        return this.napasTransferFormService;
      }

      default: {
        return this.internalTransferFormService;
      }
    }
  }

  detail(item: SearchResponseData): void {
    if (this.waitReversedRecordExist && !this.isWaitReveredItem(item)) {
      this.openWaitReversedWarning();
      return;
    }
    const transType = item.transType;
    this.getFormService(transType).navigateToDetail({
      transId: item.id,
    });
  }

  edit(item: SearchResponseData): void {
    const transType = item.transType;
    this.getFormService(transType).navigateToDetail({
      transId: item.id,
      status: 'open',
    });
  }

  delete(item: SearchResponseData): void {
    const transType = item.transType;

    this.getFormService(transType).delete(item, () => {
      this.lpbDatatable.search(this.searchCondition);
    });
  }
}
