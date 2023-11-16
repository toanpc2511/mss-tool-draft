import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { isGDV, isHoiSo } from 'src/app/shared/utilites/role-check';
import {
  DATE_FORMAT,
  DATE_FORMAT_VN_SIMPLE,
  USER_INFO,
} from '../../shared/constants/common';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: [
    '../../shared/styles/common.scss',
    './list-request.component.scss',
  ],
})
export class ListRequestComponent implements OnInit {
  filterDefault = '';

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  formSearch: FormGroup;

  checkedRows: any[] = [];

  columns = [
    {
      headerName: 'Số tài khoản',
      headerProperty: 'accountNum',
      headerIndex: 1,
      className: 'w-150-px',
    },
    {
      headerName: 'Serial',
      headerProperty: 'transCode',
      headerIndex: 2,
      className: 'w-150-px',
    },
    {
      headerName: 'Số CIF',
      headerProperty: 'cifNo',
      headerIndex: 3,
      className: 'w-150-px',
    },
    {
      headerName: 'Mã đơn vị',
      headerProperty: 'branchCode',
      headerIndex: 4,
      className: 'w-150-px',
    },
    {
      headerName: 'Loại sản phẩm',
      headerProperty: 'productType',
      headerIndex: 5,
      className: 'w-150-px',
    },
    {
      headerName: 'Loại',
      headerProperty: 'type', //
      headerIndex: 6,
      className: 'w-150-px',
    },
    {
      headerName: 'Số tiền gửi',
      headerProperty: 'amount', //
      headerIndex: 7,
      type: 'currency',
      className: 'w-150-px',
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'currencyType', //
      headerIndex: 8,
      className: 'w-150-px',
    },
    {
      headerName: 'Trạng thái sổ TK',
      headerProperty: 'accountStatus',
      headerIndex: 9,
      className: 'w-150-px',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'transStatus',
      headerIndex: 10,
      className: 'w-150-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      type: 'date',
      headerIndex: 11,
      className: 'w-150-px',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 12,
      className: 'w-150-px',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approvedBy',
      headerIndex: 13,
      className: 'w-150-px',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: LpbDialogService,
    private matdialog: MatDialog
  ) {
    this.dialogService.setDialog(this.matdialog);
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb(['Dịch vụ tài chính', '']);

    const now = moment().format(DATE_FORMAT_VN_SIMPLE);

    this.formSearch = this.fb.group({
      productType: [null], // loại sản phẩm
      cifNo: [null], // số CIF
      accountNum: [null], // số tài khoản
      serialNo: [null], // số serial
      branchCode: ['000'], // mã chi nhánh
      accountStatus: [null], // trạng thái sổ TK
      transStatus: [null], // trạng thái giao dịch
      createdBy: [null], // người tạo
      createdDate: [now], // ngày tạo
      toCreatedDate: [now], // đến ngày tạo
    });

    FormHelpers.validTwoDate(
      this.formSearch.get('createdDate'),
      this.formSearch.get('toCreatedDate'),
      {
        checkRange: true,
        maxDate: now,
        rejectValidate: { maxDate: [2] },
      }
    );

    FormHelpers.requiredOneInMany([
      this.formSearch.get('cifNo'),
      this.formSearch.get('accountNum'),
      this.formSearch.get('serialNo'),
    ]);

    const today = moment().startOf('day').format(DATE_FORMAT); // get the start of today
    const endOfToday = moment().endOf('day').format(DATE_FORMAT); // get the end of today

    this.filterDefault = `createdDate|gte|${today}&createdDate|lt|${endOfToday}`;

    if (!isHoiSo()) {
      if (isGDV()) {
        this.filterDefault = `${this.filterDefault}&createdBy|eq|${
          USER_INFO().userName
        }&branchCode|eq|${USER_INFO().branchCode}`;
      } else {
        this.filterDefault = `${this.filterDefault}&branchCode|eq|${
          USER_INFO().branchCode
        }`;
      }
    }
  }
  submitSearchTransaction(): void {
    this.filterDefault = '';

    console.log('this.formSearch', this.formSearch);

    this.searchCondition = this.getSearchCondition(
      this.formSearch.getRawValue()
    );
  }

  getSearchCondition(
    formSearchValues
  ): { property: string; operator: string; value: any }[] {
    formSearchValues = formSearchValues || {};
    let invalidKeys = ['toCreatedDate', 'createdDate'];
    let result = Object.entries(formSearchValues)
      .filter(([key, value]) => {
        let valid =
          value != null &&
          !invalidKeys.includes(key) &&
          !(key === 'branchCode' && value === 'need_all_all_all');

        if (valid) {
          valid = value.toString()?.trim()?.length > 0;
        }
        return valid;
      })
      .map(([property, value]) => {
        if (Array.isArray(value)) {
          value = value.join(',');
          return {
            property,
            operator: 'in',
            value,
          };
        } else {
          return {
            property,
            operator: 'eq',
            value,
          };
        }
      })
      .concat([
        {
          property: 'createdDate',
          operator: 'gte',
          value: formSearchValues.createdDate
            ? moment(formSearchValues.createdDate, DATE_FORMAT_VN_SIMPLE)
                .startOf('day')
                .format(DATE_FORMAT)
            : undefined,
        },
        {
          property: 'createdDate',
          operator: 'lte',
          value: formSearchValues.toCreatedDate
            ? moment(formSearchValues.toCreatedDate, DATE_FORMAT_VN_SIMPLE)
                .endOf('day')
                .format(DATE_FORMAT)
            : undefined,
        },
      ]);

    console.log(
      result
        .map((e: any) => ({ ...e, value: e.value?.trim() }))
        .filter((e) => e.value)
    );

    return result
      .map((e: any) => ({ ...e, value: e.value?.trim() }))
      .filter((e) => e.value);
  }

  detail(item: any): void {
    this.router
      .navigate(['detail'], {
        relativeTo: this.activatedRoute,
        queryParams: {
          transId: item.id,
        },
      })
      .then(() => {})
      .catch((e) => e);
  }
  chkAll(e): void {
    this.checkedRows = [...e];
  }
  chkClickChange({
    row,
    operatorType,
  }: {
    row: any;
    operatorType: 'sub' | 'plus';
  }): void {
    this.checkedRows = this.checkedRows.filter(
      (r) => r.transCode !== row.transCode
    );
    if (operatorType === 'plus') {
      this.checkedRows = [...this.checkedRows, row];
    }
  }
}
