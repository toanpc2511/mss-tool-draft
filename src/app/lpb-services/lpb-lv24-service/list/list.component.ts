import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BranchInfo } from 'src/app/manager-smart-form/card-services/shared/models/card-service-common';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { FOOTER_ACTIONS } from '../shared/constants/common';
import { SearchResponseData } from '../shared/models/lv24';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';

declare const $: any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['../shared/styles/common.scss', './list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(LpbDatatableComponent) lpbDatatable: LpbDatatableComponent;
  formSearch: FormGroup;

  IDENTITY_TYPES_ARR = [];
  lstBranch: BranchInfo[] = [];
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  lstAccount = [];

  columns = [
    {
      headerName: 'Mã yêu cầu',
      headerProperty: 'transCode',
      headerIndex: 2,
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Loại dịch vụ',
      headerProperty: 'serviceName',
      headerIndex: 3,
      className: 'w-200-px text-nowrap',
    },
    {
      headerName: 'Loại định danh',
      headerProperty: 'docType',
      headerIndex: 4,
      className: 'w-200-px text-nowrap',
    },
    {
      headerName: 'Số định danh',
      headerProperty: 'docNum',
      headerIndex: 5,
      className: 'w-200-px text-nowrap',
    },
    {
      headerName: 'Mã khách hàng',
      headerProperty: 'cif',
      headerIndex: 6,
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'cusName',
      headerIndex: 7,
      className: 'w-200-px white-space-pre',
    },
    {
      headerName: 'Số điện thoại',
      headerProperty: 'phoneNumber',
      headerIndex: 8,
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Thời gian tạo YC',
      headerProperty: 'createdDate',
      headerIndex: 9,
      type: 'datetime',
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 10,
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Thời gian phê duyệt',
      headerProperty: 'approveDate',
      headerIndex: 11,
      type: 'datetime',
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Người PD',
      headerProperty: 'approveBy',
      headerIndex: 12,
      className: 'w-150-px text-nowrap',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 13,
      className: 'w-150-px text-nowrap',
    },
  ];

  userInfo: any;
  userRole: any;
  searchType = '';
  filterDefault = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: LpbDialogService,
    private matdialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole'));
    this.dialogService.setDialog(this.matdialog);
  }
  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb(['LienViet24h', '']);
    this.formSearch = this.fb.group({
      docType: ['cusName'],
      docNum: [null],
      requestType: ['transCode'],
      requestValue: [null],
      branchCode: ['000'],
      serviceCode: [null],
      createdDate: [null],
      toCreatedDate: [null],
    });

    const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // define a constant for the date format

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
      this.filterDefault = `${this.filterDefault}&branchCode|eq|000`;
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

  getSearchCondition(
    formSearchValues
  ): { property: string; operator: string; value: any }[] {
    formSearchValues = formSearchValues || {};
    let invalidKeys = [
      'docNum',
      'requestValue',
      'toCreatedDate',
      'createdDate',
    ];
    let result = Object.entries(formSearchValues)
      .filter(([key, value]) => {
        let valid =
          value != null &&
          !invalidKeys.includes(key) &&
          !(key === 'branchCode' && value === 'need_all_all_all');

        if (valid) {
          valid = value!.toString().trim().length > 0;
        }
        return valid;
      })
      .map(([property, value]) => {
        switch (property) {
          case 'docType': {
            let operatorProperty = 'eq';
            if (value === 'cusName') {
              operatorProperty = 'ol';
            }
            return {
              property: value,
              operator: operatorProperty,
              value: formSearchValues.docNum,
            };
          }
          case 'requestType': {
            return {
              property: value,
              operator: 'eq',
              value: formSearchValues.requestValue,
            };
          }
          default: {
            return {
              property,
              operator: 'eq',
              value,
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
      ]);
    if (
      isGDV() &&
      !isHoiSo() &&
      !result.some((e) => e.property === 'createdBy')
    ) {
      result = result.concat([
        {
          property: 'createdBy',
          operator: 'eq',
          value: this.userInfo.userName,
        },
      ]);
    }

    return result
      .map((e: any) => ({ ...e, value: e.value?.trim() }))
      .filter((e) => e.value);
  }

  detail(item: SearchResponseData): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: item.id,
      },
    });
  }
}
