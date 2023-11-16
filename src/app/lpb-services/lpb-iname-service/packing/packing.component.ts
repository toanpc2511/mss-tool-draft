import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LimitService} from '../shared/services/limit.service';
import {ILpbDialog, LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import * as moment from 'moment';
import {finalize} from 'rxjs/operators';
import {PackingService} from '../shared/services/packing.service';
import {FilterOperator} from '../../../shared/constants/filter-operator';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {

  formSearch = this.fb.group({
    name: [],
  });
  columns = [
    {
      headerName: 'Mã gói',
      headerProperty: 'code',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'Tên gói',
      headerProperty: 'name',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: 'Đơn giá',
      headerProperty: 'unitCost',
      type: 'currency',
      headerIndex: 2,
      className: 'w-50-px',
    },
    {
      headerName: 'VAT%',
      headerProperty: 'vatRate',
      headerIndex: 3,
      className: 'w-10-px'
    },
    {
      headerName: 'Rule',
      headerProperty: 'rulesName',
      headerIndex: 3,
      className: 'w-100-px'
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 6,
      className: 'w-50-px',
    },
  ];

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  constructor(private fb: FormBuilder,
              private packingService: PackingService,
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
    console.log(this.formSearch.value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      condition.push({
        property: key,
        operator: FilterOperator.LIKE,
        value: this.formSearch.controls[key].value
      });

      // console.log(key, this.formSearch.controls[key].value);
    });
    this.searchCondition = condition;
  }

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: 'update'},
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/packing/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: 'view'},
      fragment: 'anchor'
    };
    this.router.navigate(['/iname-service/packing/create'], navigationExtras);
  }

  delete(rowData): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa bản ghi?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.packingService
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

}
