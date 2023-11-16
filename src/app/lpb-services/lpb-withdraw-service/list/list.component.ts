import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { BranchInfo } from 'src/app/manager-smart-form/card-services/shared/models/card-service-common';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';

import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import {
  ALLOW_STATUS_CODE,
  FOOTER_ACTIONS,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES,
} from '../shared/constants/withdraw-common';
import {
  DepositForm,
  DepositTable,
} from '../../lpb-deposit-service/shared/models/deposit';
import { WITHDRAW_PRODUCTS } from '../shared/constants/withdraw-common';
import { WithdrawService } from '../shared/services/withdraw.service';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { LbpValidators } from 'src/app/shared/validatetors/lpb-validators';
import { DataResponse } from 'src/app/shared/models/data-response.model';

declare const $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(LpbDatatableComponent) lpbDatatable: LpbDatatableComponent;
  @ViewChild('datatable', { read: ElementRef }) lpbDatatableRef!: ElementRef;
  formSearch: FormGroup;
  TRANSACTION_STATUSES = TRANSACTION_STATUSES;

  IDENTITY_TYPES_ARR = [];
  lstBranch: BranchInfo[] = [];
  WITHDRAW_PRODUCTS = WITHDRAW_PRODUCTS;

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  lstAccount = [];

  columns = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transCode',
      headerIndex: 1,
      className: 'text-nowrap',
    },
    {
      headerName: 'Mã giao dịch Core',
      headerProperty: 'coreTransCode',
      headerIndex: 2,
      className: 'text-nowrap',
    },
    {
      headerName: 'Số tài khoản',
      headerProperty: 'acn',
      headerIndex: 2,
      className: 'text-nowrap',
    },
    {
      headerName: 'Số CIF',
      headerProperty: 'cifNo',
      headerIndex: 3,
      className: 'text-nowrap',
    },
    {
      headerName: 'Tên Khách hàng',
      headerProperty: 'customerName',
      headerIndex: 4,
      className: 'text-nowrap',
    },
    {
      headerName: 'GTXM',
      headerProperty: 'docNum',
      headerIndex: 5,
      className: 'text-nowrap',
    },
    {
      headerName: 'Mã CN',
      headerProperty: 'branchCode',
      headerIndex: 6,
      className: 'text-nowrap',
    },
    {
      headerName: 'Mã SP',
      headerProperty: 'productCode',
      headerIndex: 7,
      className: 'text-nowrap',
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'transactionAmount',
      headerIndex: 8,
      type: 'currency',
      className: 'text-nowrap',
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'curCode',
      headerIndex: 9,
      className: 'text-nowrap',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 10,
      className: 'text-nowrap',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 11,
      className: 'text-nowrap',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 12,
      className: 'text-nowrap',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 13,
      type: 'date',
      className: 'text-nowrap',
    },
  ];

  allowStatusesFilter = '';
  userInfo: any;
  userRole: any;
  allowStatuses;
  searchType = '';
  filterDefault = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private withdrawService: WithdrawService,
    private dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private matdialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));
  }
  ngOnInit(): void {
    $('.parentName').html('Rút tiền');
    $('.childName').html('Danh sách giao dịch');

    this.dialogService.setDialog(this.matdialog);

    this.formSearch = this.fb.group({
      branchCode: [null, LbpValidators.requiredAllowEmpty],
      acn: [null, [Validators.minLength(12), Validators.maxLength(12)]],
      customerName: [null],
      cifNo: [null, Validators.maxLength(20)],
      docNum: [null, Validators.maxLength(50)],
      docType: [null],
      productCode: [null, Validators.maxLength(50)],
      createdBy: [null],
      createdDate: [null],
      toCreatedDate: [null],
      status: [null],
      transCode: [null, Validators.maxLength(50)],
    });

    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // define a constant for the date format
    this.allowStatuses = [];

    if (isGDV() || isHoiSo()) {
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
    }
  }

  handleRawData(response: DataResponse<any[]>) {
    const statuses = [
      TRANS_STATUS_CODES.WAIT_APPROVE,
      TRANS_STATUS_CODES.WAIT_REVERT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.DRAFT,
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
      this.updateTableStatus(response.data);
    });
  }

  updateTableStatus(tableData: any[]) {
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

  isSuspiciousItem(item: any) {
    return (
      item.status === TRANS_STATUS_CODES.SUSPICIOUS ||
      item.status === TRANS_STATUS_CODES.SUSPICIOUS_REVERT
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
          !['customerName', 'createdDate', 'toCreatedDate'].includes(e) &&
          !(e === 'branchCode' && formSearchValues[e] === 'need_all_all_all')
        );
      })
      .map((e) => {
        return {
          property: e,
          operator: 'eq',
          value: formSearchValues[e],
        };
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

  detail(item: DepositForm): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: item.id,
      },
    });
  }

  create(): void {
    this.router.navigate(['../create'], {
      relativeTo: this.activatedRoute,
    });
  }

  edit(item: DepositForm): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: item.id,
        status: 'open',
      },
    });
  }

  delete(e: DepositTable): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa giao dịch?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.withdrawService
        .deleteWithdraw(e.id)
        .pipe(
          finalize(() => {
            // this is called on both success and error
            this.lpbDatatable.search(this.searchCondition);
          })
        )
        .subscribe(
          (res) => {
            if (res && !res.meta.message) {
              this.customNotificationService.success(
                'Thông báo',
                'Xóa thành công'
              );
            } else {
              if (res.meta) {
                this.customNotificationService.handleErrors(res.meta);
              } else {
                this.customNotificationService.handleErrors();
              }
            }
          },
          (error) => {
            if (error) {
              this.customNotificationService.handleErrors(error);
            } else {
              this.customNotificationService.handleErrors();
            }
          },
          () => {}
        );
    });
  }
}
