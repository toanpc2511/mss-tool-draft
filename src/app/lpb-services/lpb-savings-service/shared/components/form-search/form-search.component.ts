import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import {
  ACCOUNT_STATUSES,
  NO_EMIT,
  PRODUCTS_TYPES,
  TRANS_STATUSES,
  USER_INFO,
} from '../../constants/common';
import { distinctUntilChanged } from 'rxjs/operators';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['../../styles/common.scss', './form-search.component.scss'],
})
export class FormSearchComponent implements OnInit, AfterViewInit {
  REQUEST_STATUS_TYPE_ARR: any[];
  branchList = [];
  userList = [];
  apiUrlUserListAll = '';
  createBysState: {
    data: any;
    setData: any;
  };

  PRODUCTS_TYPES = PRODUCTS_TYPES;
  ACCOUNT_STATUSES = ACCOUNT_STATUSES;
  TRANS_STATUSES = TRANS_STATUSES;

  @Input() form: FormGroup;

  maxDate = new Date();

  @Output() searchTransaction = new EventEmitter<string>();

  isHoiSo = isHoiSo();
  isKSV = isKSV();
  userInfo = USER_INFO();

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    DATE_RANGE_ERROR: 'dateRangeError',
    DATE_FORMAT_ERROR: 'inValidDate',
    DATE_MAX_ERROR: 'maxDate',
    REQUIRED_ONE_IN_MANY: 'requiredOneInMany',
  };

  @ViewChild('searchTransactionForm') searchTransactionForm: ElementRef;
  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.control('branchCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((e) => {
        if (isHoiSo()) {
          this.control('createdBy').setValue(null, NO_EMIT);
          if (e === 'need_all_all_all') {
            this.apiUrlUserListAll = `/transfer-service/redis/userList?branchCode=`;
          } else {
            this.apiUrlUserListAll = `/transfer-service/redis/userList?branchCode=${e}`;
          }
        } else {
          this.apiUrlUserListAll = `/transfer-service/redis/userList?branchCode=${this.userInfo.branchCode}`;
        }
      });
  }

  ngAfterViewInit(): void {
    if (!isHoiSo()) {
      this.control('branchCode').setValue(this.userInfo.branchCode);
      this.control('branchCode').disable();

      if (isGDV()) {
        this.control('createdBy').setValue(this.userInfo.userName);
        this.control('createdBy').disable();
      }
    } else {
      const branchCodeControl = this.control('branchCode');
      if (branchCodeControl?.value) {
        this.apiUrlUserListAll = `/transfer-service/redis/userList?branchCode=${branchCodeControl.value}`;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  filterSendBy({ data, setData }): void {
    // Lấy ra những đối tượng có roleCode là GDV
    const user = data?.filter((e) => e.roleCode === 'UNIFORM.BANK.GDV');
    // Cập nhật trạng thái createBysState
    this.createBysState = {
      data: user,
      setData,
    };
    // Cập nhật dữ liệu
    setData(user);
  }

  searchTransactionAction(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      FormHelpers.focusToInValidControl(this.searchTransactionForm);
      return;
    }
    this.searchTransaction.emit();
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
  onClearBranchCode() {
    const { setData: setCreatedBys } = this.createBysState || {};
    setCreatedBys([]);
    this.control('createdBy').setValue(null, NO_EMIT);
  }
  get control() {
    return (name: string): AbstractControl => {
      return this.form.get(name);
    };
  }
}
