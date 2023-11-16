import {Component, OnInit} from '@angular/core';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {FormBuilder} from '@angular/forms';
import {FilterOperator} from '../../../../shared/constants/filter-operator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  formSearch = this.fb.group({
    serviceName: [],
    state: []
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
  }[];

  statusList = [
    {
      code: 'SCHEDULED',
      name: 'SCHEDULED',
    },
    {
      code: 'ENQUEUED',
      name: 'ENQUEUED',
    },
    {
      code: 'PROCESSING',
      name: 'PROCESSING',
    },
    {
      code: 'SUCCEEDED',
      name: 'SUCCEEDED',
    },
    {
      code: 'FAILED',
      name: 'FAILED',
    },
    {
      code: 'DELETED',
      name: 'DELETED',
    }
  ];

  columns = [
    {
      headerName: 'Job ID',
      headerProperty: 'id',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Service Name',
      headerProperty: 'serviceName',
      headerIndex: 1,
      className: 'w-200-px font-weight-bold'
    },
    {
      headerName: 'Job Name',
      headerProperty: 'jobName',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Status',
      headerProperty: 'state',
      headerIndex: 3,
      className: 'w-200-px',
    },
    {
      headerName: 'Run Time',
      headerProperty: 'createdat',
      headerIndex: 4,
      className: 'w-200-px',
    }
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  onSearch(): void {
    this.searchCondition = this.buildSearchCondition();
  }

  buildSearchCondition(): any {
    // this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.LIKE;
      const value = this.formSearch.controls[key].value;
      if (this.formSearch.controls[key].value) {
        if (key === 'state') {
          operator = FilterOperator.IN;
        }
        condition.push({
          property: key,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    return condition;
  }

}
