import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {FilterOperator} from '../../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {FileService} from '../../../../shared/services/file.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  formSearch = this.fb.group({
    fromDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    toDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    branch: [],
    glCode: [],
    formatType: ['EXCEL'],
    reportType: [null, [Validators.required]]
  });
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];
  selectConfig = {
    isNewApi: true,
    isSort: true,
    clearable: true,
    closeOnSelect: false
  };

  get searchFormControl(): any {
    return this.formSearch.controls;
  }

  constructor(private fb: FormBuilder, private fileService: FileService) {
  }

  ngOnInit(): void {
    this.onChange();
  }

  onChange(): void {
    // this.formSearch.get('reportType').valueChanges.subscribe(value => {
    //   this.formSearch.get('branch').setValue('');
    //   this.formSearch.get('branch').disable();
    // });
  }

  onExport(): void {
    if (this.formSearch.invalid) {
      this.formSearch.markAllAsTouched();
      return;
    }
    this.buildSearchCondition();
    const params = {
      filter: this.fileService.handleValueFilter(this.searchCondition),
      reportType: this.formSearch.get('reportType').value
    };
    this.fileService.downloadFileMethodGet(
      'cross-checking-credit-card-service/report',
      params
    );
  }

  buildSearchCondition(): void {
    // this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    let condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.EQUAL;
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        if (key === 'fromDate') {
          operator = FilterOperator.GREATER_THAN_EQUAL;
          propertyKey = 'trnDt';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : '';
        } else if (key === 'toDate') {
          operator = FilterOperator.LESSER_THAN_EQUAL;
          propertyKey = 'trnDt';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : '';
        } else if (key === 'branch') {
          operator = FilterOperator.IN;
        }
        if (key !== 'reportType' && key !== 'formatType') {
          condition.push({
            property: propertyKey,
            operator,
            value
          });
        }

      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    if (this.formSearch.get('reportType').value === 'REPORT_01') {
      condition = condition.filter(item => item.property !== 'branch');
    }
    console.log('condtion', condition);
    this.searchCondition = condition;
  }
}
