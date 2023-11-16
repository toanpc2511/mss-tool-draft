import { Component, OnInit } from '@angular/core';
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


  columns = [
    {
      headerName: 'Server ID',
      headerProperty: 'id',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Server Name',
      headerProperty: 'name',
      headerIndex: 1,
      className: 'w-200-px',
    },
    {
      headerName: 'Service Name',
      headerProperty: 'serviceName',
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
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        condition.push({
          property: propertyKey,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    return condition;
  }

}
