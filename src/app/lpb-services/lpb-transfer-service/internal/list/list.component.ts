import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { LbpValidators } from 'src/app/shared/validatetors/lpb-validators';

import {
  ALLOW_STATUS_CODE,
  TRANSACTION_STATUSES,
} from '../../shared/constants/common';

import {
  FOOTER_ACTIONS,
  INTERNAL_TRANSFER_PRODUCTS,
} from '../../shared/constants/internal';
import { BranchInfo } from '../../shared/models/common';
import { SearchResponseData } from '../../shared/models/internal';
import { InternalTransferFormService } from '../../shared/services/internal/internal-transfer-form.service';

declare const $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: [
    '../../shared/styles/lpb-transfer-service-list.scss',
    './list.component.scss',
  ],
})
export class ListComponent implements OnInit {
  @ViewChild(LpbDatatableComponent) lpbDatatable: LpbDatatableComponent;
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
      type: 'date',
      className: 'w-150-px justify-content-center',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 12,
      className: 'w-100-px justify-content-center',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 13,
      className: 'w-100-px justify-content-center',
    },
  ];

  allowStatusesFilter = '';
  userInfo: any;
  userRole: any;
  allowStatuses;
  searchType = 'HO';
  filterDefault = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: LpbDialogService,
    private matdialog: MatDialog,
    private internalTransferFormService: InternalTransferFormService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));
  }
  ngOnInit(): void {
    $('.parentName').html('Chuyển tiền');
    $('.childName').html('Danh sách giao dịch');

    this.dialogService.setDialog(this.matdialog);

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

  detail(item: SearchResponseData): void {
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

  edit(item: SearchResponseData): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: item.id,
        status: 'open',
      },
    });
  }

  delete(e: SearchResponseData): void {
    this.internalTransferFormService.delete(e, () => {
      this.lpbDatatable.search(this.searchCondition);
    });
  }
}
