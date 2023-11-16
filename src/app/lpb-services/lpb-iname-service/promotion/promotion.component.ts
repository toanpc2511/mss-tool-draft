import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LimitService} from '../shared/services/limit.service';
import {ILpbDialog, LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import * as moment from 'moment';
import {finalize} from 'rxjs/operators';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {PromotionService} from '../shared/services/promotion.service';
import {FilterOperator} from '../../../shared/constants/filter-operator';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  datatableConfig?: LpbDatatableConfig = {
    hasNoIndex: true,
    filterDefault: '',
    hasAddtionButton: true
  };

  formSearch = this.fb.group({
    name: [],
    startDate: [],
    endDate: [],
  });
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];
  columns = [
    {
      headerName: 'Mã CTKM',
      headerProperty: 'code',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'Tên CTKM',
      headerProperty: 'name',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: 'Gói áp dụng',
      headerProperty: 'packingName',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: '% Giảm trừ',
      headerProperty: 'discountRate',
      headerIndex: 1,
      className: 'w-20-px',
    },
    {
      headerName: 'Số tiền giảm trừ',
      headerProperty: 'discountAmount',
      headerIndex: 1,
      type: 'currency',
      className: 'w-50-px',
    },
    {
      headerName: 'Đối tượng áp dụng',
      headerProperty: 'customerTypeName',
      headerIndex: 2,
      className: 'w-100-px'
    },
    {
      headerName: 'Ngày áp dụng',
      headerProperty: 'startDate',
      headerIndex: 2,
      className: 'w-100-px'
    },
    {
      headerName: 'Ngày hết hiệu lực',
      headerProperty: 'endDate',
      headerIndex: 3,
      className: 'w-100-px'
    },

    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 6,
      className: 'w-100-px',
    },
  ];

  constructor(private fb: FormBuilder,
              private promotionService: PromotionService,
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

  buildSearchCondition(): void {
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

  delete(rowData): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa bản ghi?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.promotionService
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
    this.router.navigate(['/iname-service/promotion/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: 'view'},
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/promotion/create'], navigationExtras);
  }

}
