import {Component, OnInit} from '@angular/core';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {FormBuilder} from '@angular/forms';
import {FilterOperator} from '../../../../shared/constants/filter-operator';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {JobrunrService} from '../../shared/services/jobrunr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  rowSelected = [];
  actions: ActionModel[] = [
    {
      actionName: 'Trigger',
      actionIcon: 'send',
      actionClick: () => this.triggerRecurringJob()
    }
  ];
  checkboxConfig: {
    clearSelected: boolean
  } = {
    clearSelected: false
  };
  formSearch = this.fb.group({
    serviceName: []
  });


  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: true,
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
      headerName: 'Job ID',
      headerProperty: 'id',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Job Name',
      headerProperty: 'jobName',
      headerIndex: 1,
      className: 'w-200-px',
    },
    {
      headerName: 'Cron Expression',
      headerProperty: 'scheduleExpression',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Cron Description',
      headerProperty: 'cronDescripton',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Timezone',
      headerProperty: 'zoneId',
      headerIndex: 3,
      className: 'w-200-px',
    },
    {
      headerName: 'Service Name',
      headerProperty: 'serviceName',
      headerIndex: 4,
      className: 'w-200-px',
    }
  ];

  constructor(private fb: FormBuilder,
              private customNotificationService: CustomNotificationService,
              private jobrunrService: JobrunrService) {
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
      const operator = FilterOperator.LIKE;
      const value = this.formSearch.controls[key].value;
      const property = key;
      if (this.formSearch.controls[key].value) {
        condition.push({
          property,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    return condition;
  }

  chkAll(rowSelected): void {
    this.rowSelected = rowSelected;
  }

  triggerRecurringJob(): void {
    this.checkboxConfig = {
      clearSelected: false
    };
    // if (this.rowSelected.length === 0) {
    //   this.customNotificationService.error('Lỗi', 'Bạn phải chọn ít nhất 1 bản ghi');
    //   return;
    // }
    console.log(this.rowSelected);
    const request = {
      ids: this.rowSelected.map(item => item.id)
    };
    this.rowSelected.forEach(row => {
      this.jobrunrService.triggerRecurringJob(row.id, row.serviceName).subscribe(
        (res) => {
          this.customNotificationService.handleResponse(res);
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
        },
        () => {
          // this.customNotificationService.success('Thông báo', message);
          this.onSearch();

        }
      );
    });


  }
}
