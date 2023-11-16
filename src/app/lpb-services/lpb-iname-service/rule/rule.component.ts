import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ILpbDialog, LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {finalize} from 'rxjs/operators';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {RuleService} from '../shared/services/rule.service';
import {NavigationExtras, Router} from '@angular/router';

import {FilterOperator} from '../../../shared/constants/filter-operator';

declare const $: any;

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
  formSearch = this.fb.group({
    code: [],
    'customerType.id': [],
  });
  columns = [
    {
      headerName: 'Mã rule',
      headerProperty: 'code',
      headerIndex: 1,
      className: 'w-80-px',
    },
    {
      headerName: 'Tên rule',
      headerProperty: 'name',
      headerIndex: 2,
      className: 'w-150-px',
    },
    {
      headerName: 'Đối tượng',
      headerProperty: 'customerTypeName',
      headerIndex: 3,
      className: 'w-80-px',
    },
    {
      headerName: 'Loại Rule',
      headerProperty: 'ruleTypeName',
      headerIndex: 4,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 5,
      type: 'date',
      className: 'w-100-px',
    },
  ];
  filterDefault = '';
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  constructor(private fb: FormBuilder,
              private ruleService: RuleService,
              private dialogService: LpbDialogService,
              private customNotificationService: CustomNotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    $('.parentName').html('Dịch vụ iName');
    $('.childName').html('Danh sách rule');
  }

  buildSearchCondition(): void {
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      // let newKey = '';
      // if (key === 'customerType') {
      //   newKey = key + '.id';
      // } else {
      //   newKey = key;
      // }
      condition.push({
        property: key,
        operator: FilterOperator.LIKE,
        value: this.formSearch.controls[key].value
      });
      console.log(key, this.formSearch.controls[key].value);
    });
    this.searchCondition = condition;
  }

  onSearch(): void {
    this.buildSearchCondition();
  }

  delete(rowData): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa bản ghi?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.ruleService
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
      queryParams: { id: rowData.id, mode: 'update' },
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/rule/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: rowData.id, mode: 'view' },
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/rule/create'], navigationExtras);
  }

}
