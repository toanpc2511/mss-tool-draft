import {Component, OnInit} from '@angular/core';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {FileService} from '../../../../shared/services/file.service';
import {FilterOperator} from '../../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  formSearch = this.fb.group({
    serviceName: []
  });
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: false,
    filterDefault: '',
    defaultSort: '',
    hasAddtionButton: true,
    hiddenActionColumn: true
  };

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[] = [];
  columns: LpbDatatableColumn[] = [
    {
      headerName: 'Tên dịch vụ',
      headerProperty: 'serviceName',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Tên tài liệu',
      headerProperty: 'fileName',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 1,
      className: 'w-100-px',
    }
  ];

  constructor(private fileService: FileService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  view(rowData): void {
    const params = {
      id: rowData.id
    };
    this.fileService.downloadFileMethodGet('lpb-common-service/file/download/api/public', params);
  }

  onSearch(): void {
    this.buildSearchCondition();
  }

  buildSearchCondition(): void {
    // this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.LIKE;
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        // if (key === 'fromDate') {
        //   operator = FilterOperator.GREATER_THAN_EQUAL;
        //   propertyKey = 'trnDt';
        //   value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : '';
        // } else if (key === 'toDate') {
        //   operator = FilterOperator.LESSER_THAN_EQUAL;
        //   propertyKey = 'trnDt';
        //   value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : '';
        // } else if (key === 'branch') {
        //   operator = FilterOperator.IN;
        // } else if (key === 'eventDescr') {
        //   operator = FilterOperator.LIKE;
        // }

        condition.push({
          property: propertyKey,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    this.searchCondition = condition;
  }
}
