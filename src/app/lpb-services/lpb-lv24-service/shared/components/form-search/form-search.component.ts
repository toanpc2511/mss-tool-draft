import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import {
  CUSTOMER_SELECT_TYPE_ARR,
  REQUEST_STATUS_TYPE_ARR,
  REQUEST_TYPE_ARR,
  SERVICE_TYPE_ARR,
} from '../../constants/common';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['../../styles/common.scss', './form-search.component.scss'],
})
export class FormSearchComponent implements OnInit, AfterViewInit {
  userInfo: any;
  CUSTOMER_SELECT_TYPE_ARR = CUSTOMER_SELECT_TYPE_ARR;
  REQUEST_TYPE_ARR = REQUEST_TYPE_ARR;
  SERVICE_TYPE_ARR = SERVICE_TYPE_ARR;
  REQUEST_STATUS_TYPE_ARR: any[];
  branchList = [];

  @Input() form: FormGroup;
  @ViewChild('searchFormRef') searchFormRef: ElementRef;

  @ViewChild('createdDate', { static: false })
  createdDate: LpbDatePickerComponent; // Từ ngày
  @ViewChild('toCreatedDate', { static: false })
  toCreatedDate: LpbDatePickerComponent; // Đến ngày
  maxDate = new Date();

  @Output() searchTransaction = new EventEmitter<string>();

  isHoiSo = isHoiSo();

  constructor() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    // check requestType
    this.form.get('requestType').valueChanges.subscribe((e) => {
      this.REQUEST_STATUS_TYPE_ARR = undefined;
      if (e === 'status') {
        this.REQUEST_STATUS_TYPE_ARR = REQUEST_STATUS_TYPE_ARR;
      }

      // Nếu người dùng là gdv và không phải hội sở thì fill control ===  this.userInfo.userName
      if (e === 'createdBy' && !isHoiSo() && isGDV()) {
        this.form.get('requestValue').setValue(this.userInfo.userName);
        this.form.get('requestValue').disable();
      } else {
        this.form.get('requestValue').setValue(null);
        this.form.get('requestValue').enable();
      }
    });
    // check requestType

    // Nếu người dùng không phải hội sở thì láy branchList từ local storage
    if (!isHoiSo()) {
      this.branchList = [
        {
          branchCodeName:
            this.userInfo.branchCode + ' - ' + this.userInfo.branchFullName,
          code: this.userInfo.branchCode,
        },
      ];
      this.form.get('branchCode').setValue(this.userInfo.branchCode);
      this.form.get('branchCode').disable();
    }
  }

  ngAfterViewInit(): void {
    this.createdDate.setSelectedDate(new Date());
    this.toCreatedDate.setSelectedDate(new Date());

    this.form.get('createdDate').setValue(this.createdDate.getValue() || null);
    this.form
      .get('toCreatedDate')
      .setValue(this.toCreatedDate.getValue() || null);
  }

  searchTransactionAction(): void {
    if (this.createdDate.errorMsg || this.toCreatedDate.errorMsg) {
      FormHelpers.focusToInValidControl(this.searchFormRef);
      return;
    }
    this.searchTransaction.emit();
  }
  createdDateChange(): boolean {
    if (this.createdDate.haveValue() && !this.createdDate.haveValidDate()) {
      this.createdDate.setErrorMsg('Ngày tạo sai định dạng');
      return;
    } else {
      this.createdDate.setErrorMsg('');
    }
    this.form.get('createdDate').setValue(this.createdDate.getValue() || null);
    if (!this.validatorDate()) {
      return;
    }
    return true;
  }

  toCreatedDateChange(): boolean {
    if (this.toCreatedDate.haveValue() && !this.toCreatedDate.haveValidDate()) {
      this.toCreatedDate.setErrorMsg('Đến ngày sai định dạng');
      return;
    } else {
      this.toCreatedDate.setErrorMsg('');
    }
    this.form
      .get('toCreatedDate')
      .setValue(this.toCreatedDate.getValue() || null);
    if (!this.validatorDate()) {
      return;
    }
    return true;
  }

  validatorDate(): boolean {
    if (this.createdDate.haveValue() && this.toCreatedDate.haveValue()) {
      const f = moment(this.createdDate.getSelectedDate(), 'DD/MM/YYYY');
      const t = moment(this.toCreatedDate.getSelectedDate(), 'DD/MM/YYYY');
      if (this.compareDate(f, t) > 0) {
        this.toCreatedDate.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
        return false;
      } else {
        this.toCreatedDate.setErrorMsg('');
      }
    }
    return true;
  }
  compareDate(fDate: any, tDate: any): any {
    const from = moment(fDate, 'DD/MM/YYYY').toDate().getTime();
    const to = moment(tDate, 'DD/MM/YYYY').toDate().getTime();
    if (from > to) {
      return 1;
    } else if (from < to) {
      return -1;
    } else {
      return 0;
    }
  }

  onBranchCodeClear(): void {
    this.form.get('branchCode').setValue('', { emitEvent: false });
  }
}
