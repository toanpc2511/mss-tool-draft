import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FILE_UPLOAD_COLUMNS, STATUSS } from '../shared/constants/water.constant';
import {Router} from '@angular/router';
import {isKSV} from '../../../shared/utilites/role-check';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {ultis} from '../../../shared/utilites/function';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import * as moment from 'moment/moment';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';
import {WaterService} from '../shared/services/water.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {IError} from '../../../shared/models/error.model';
import {
  CustomConfirmDialogComponent
} from "../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  EStatusTransactionSettleElectric
} from "../../lpb-electric-service/shared/constants/status-transaction-electric.constant";

@Component({
  selector: 'app-water-offline',
  templateUrl: './water-offline.component.html',
  styleUrls: ['./water-offline.component.scss']
})
export class WaterOfflineComponent implements OnInit {
  isKSV: boolean;
  formHelpers = FormHelpers;
  today = new Date();

  statuss = STATUSS;
  formSearch: FormGroup;
  // formSearch = this.fb.group({
  //   supplierCode: [null],
  //   status: [""],
  // })

  isLoading = false;
  //
  columns = FILE_UPLOAD_COLUMNS;
  config = {
    filterDefault: isKSV() ? this.getFilterDefault() : 'status|eq|IN_PROCESS',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: true,
    hasPaging: true
  };
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  constructor(private fb: FormBuilder, private router: Router, private waterService: WaterService, private notify: CustomNotificationService, private matDialog: MatDialog) {
    this.isKSV = isKSV();
    this.initForm();
  }
  initForm(): void {
    this.formSearch = this.fb.group({
      status: [this.statuss[0].value],
      supplierCode: [],
      fromDate: [ultis.formatDate(this.today), Validators.required],
      toDate: [ultis.formatDate(this.today), Validators.required]
    }, {
      validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán Offline'
    ]);
  }

  search(): any {
    this.formSearch.markAllAsTouched();
    if (this.isKSV && this.formSearch.invalid) {
      return;
    }
    const valueForm = this.formSearch.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    const searchCondition = [
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('status').value
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: (this.isKSV && valueForm.fromDate) ? fromDate : ''
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: (this.isKSV && valueForm.toDate) ? toDate : ''
      }
    ];
    this.searchConditions = searchCondition;
  }

  async onViewDetail($event): Promise<any> {
    if (!$event) {
      return;
    }
    await this.router.navigate(['/water-service/data-offline/view'], {queryParams: {id: $event.id}});
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  get searchControls(): any {
    return this.formSearch.controls;
  }

  resetForm(): void {
    this.initForm();
  }

  onDelete($event): void {
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn xóa giao dịch?`
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        this.waterService.deleteOffline($event.id).
        subscribe((res) => {
          if (res.meta.code === 'uni01-00-200') {
            this.notify.success('Thông báo', 'Xóa thành công');
          }
          this.search();
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row.statusCode !== 'IN_PROCESS';
  }
}
