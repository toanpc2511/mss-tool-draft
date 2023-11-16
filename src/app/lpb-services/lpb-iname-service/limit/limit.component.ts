import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RuleService} from '../shared/services/rule.service';
import {ILpbDialog, LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import * as moment from 'moment/moment';
import {LimitService} from '../shared/services/limit.service';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';


@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.scss']
})
export class LimitComponent implements OnInit {
  formSearch = this.fb.group({
    characterName: [],
    startDate: [],
    endDate: [],
    'customerType.id': [],
    'limitType.id': [],
  });
  columns = [
    {
      headerName: 'Ký tự, chuỗi',
      headerProperty: 'characterName',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'Tiêu tức',
      headerProperty: 'methodTypeName',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: 'Đơn giá',
      headerProperty: 'price',
      headerIndex: 1,
      type: 'currency',
      className: 'w-50-px',
    },
    {
      headerName: 'Ngày áp dụng',
      headerProperty: 'startDate',
      headerIndex: 2,
      className: 'w-50-px'
    },
    {
      headerName: 'Ngày hết hiệu lực',
      headerProperty: 'endDate',
      headerIndex: 3,
      className: 'w-50-px'
    },
    {
      headerName: 'Loại',
      headerProperty: 'limitTypeName',
      headerIndex: 4,
      className: 'w-100-px',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 5,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 6,
      className: 'w-100-px',
    },

  ];
  filterDefault = '';
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  selectConfig = {
    isNewApi: true,
    isSort: true
  };

  constructor(private fb: FormBuilder,
              private limitService: LimitService,
              private dialogService: LpbDialogService,
              private customNotificationService: CustomNotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSearch(): void {
    // console.log(this.formSearch.value);
    this.buildSearchCondition();
  }

  delete(rowData): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa bản ghi?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.limitService
        .delete(rowData.id)
        .pipe(
          finalize(() => {
            // this is called on both success and error
            this.buildSearchCondition();
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
          () => {
          }
        );
    });
  }

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: 'update'},
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/limit/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: 'view'},
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/limit/create'], navigationExtras);
  }

  buildSearchCondition(): void {
    console.log(this.formSearch.value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      if (key === 'startDate') {
        condition.push({
          property: key,
          operator: FilterOperator.GREATER_THAN_EQUAL,
          value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : ''
        });
      } else if (key === 'endDate') {
        condition.push({
          property: key,
          operator: FilterOperator.LESSER_THAN_EQUAL,
          value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : ''
        });
      } else {
        condition.push({
          property: key,
          operator: FilterOperator.LIKE,
          value: this.formSearch.controls[key].value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });
    this.searchCondition = condition;
  }

}
