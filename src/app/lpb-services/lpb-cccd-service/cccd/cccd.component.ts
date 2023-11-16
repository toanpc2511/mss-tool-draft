import {Component, OnInit} from '@angular/core';
import {API_BASE_URL} from '../../lpb-money-transfer-limit-service/shared/constants/Constants';
import {SessionStorageKey} from '../../../shared/constants/session-storage-key';
import {FormBuilder} from '@angular/forms';
import {LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CountryLimitService} from '../../lpb-money-transfer-limit-service/shared/services/country-limit.service';
import {MatDialog} from '@angular/material/dialog';
import {FileService} from '../../../shared/services/file.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {UniStorageService} from '../../../shared/services/uni-storage.service';
import {NavigationExtras, Router} from '@angular/router';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../shared/constants/view-mode';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {Cccd, ICccd} from '../model/cccd.model';

@Component({
  selector: 'app-cccd',
  templateUrl: './cccd.component.html',
  styleUrls: ['./cccd.component.scss']
})
export class CccdComponent implements OnInit {
  apiServiceUrl = '/cccd-service/api/cccds';
  cccd: ICccd | null = null;
  formSearch = this.fb.group({
    fromDate: [],
    toDate: [],
    cccdNo: []
  }, {
    validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
  });

  columns = [
    {
      headerName: 'ID',
      headerProperty: 'id',
      headerIndex: 0,
      className: 'w-50-px',
    },

    {
      headerName: 'Số CCCD',
      headerProperty: 'cccdNo',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Số CMT cũ',
      headerProperty: 'cmndBefore',
      headerIndex: 3,
      className: 'w-200-px'
    },
    {
      headerName: 'Họ và tên',
      headerProperty: 'fullName',
      headerIndex: 4,
      className: 'w-100-px text-break',
    },
    {
      headerName: 'Ngày sinh',
      headerProperty: 'birthDay',
      headerIndex: 5,
      className: 'w-100-px',
    },
    {
      headerName: 'Giới tính',
      headerProperty: 'title',
      headerIndex: 6,
      className: 'w-50-px',
    },
    {
      headerName: 'Địa chỉ thường trú',
      headerProperty: 'address',
      headerIndex: 7,
      className: 'w-200-px text-break',
    },
    {
      headerName: 'Ngày cấp',
      headerProperty: 'dayProvide',
      headerIndex: 8,
      className: 'w-100-px',
    },
    {
      headerName: 'Người quét',
      headerProperty: 'employeeId',
      headerIndex: 9,
      className: 'w-100-px',
    },
    {
      headerName: 'Thời gian quét',
      headerProperty: 'scanTime',
      headerIndex: 10,
      className: 'w-150-px',
    }
  ];

  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: false,
    hasPaging: true,
    hasSelection: false,
    filterDefault: '',
    defaultSort: 'scanTime:DESC',
    hasAddtionButton: true,
    cccdPrint: true
  };
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];


  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private countryLimitService: CountryLimitService,
              private dialog: MatDialog,
              private fileService: FileService,
              private customNotificationService: CustomNotificationService,
              private uniStorageService: UniStorageService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    this.buildSearchCondition();
  }

  buildSearchCondition(): void {
    // this.uniStorageService.setItem(SessionStorageKey.COUNTRY_STATUS, this.formSearch.controls['status.code'].value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      console.log('key', key);
      if (this.formSearch.controls[key].value) {
        if (key === 'fromDate') {
          condition.push({
            property: 'scanTime',
            operator: FilterOperator.GREATER_THAN_EQUAL,
            value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : ''
          });
        } else if (key === 'toDate') {
          condition.push({
            property: 'scanTime',
            operator: FilterOperator.LESSER_THAN_EQUAL,
            value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : ''
          });
        } else {
          condition.push({
            property: key,
            operator: FilterOperator.EQUAL,
            value: this.formSearch.controls[key].value
          });
        }
      }

      // console.log(key, this.formSearch.controls[key].value);
    });
    // condition.push({
    //   property: 'deleted',
    //   operator: FilterOperator.EQUAL,
    //   value: '0'
    // });
    this.searchCondition = condition;
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.VIEW},
      fragment: 'anchor'
    };
    this.router.navigate(['/cccd-service/cccd/view'], navigationExtras);
  }

  getRowSelected(row): void {
    this.cccd = row;
  }

  exportExcel(): void {
    this.onSearch();
    // console.log(this.searchCondition);
    const params = {
      filter: this.fileService.handleValueFilter(this.searchCondition)
    };
    this.fileService.downloadFileMethodGet(
      'cccd-service/api/cccds/export-excel',
      params
    );
  }
}
