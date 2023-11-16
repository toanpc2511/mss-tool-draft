import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { LpbSelect2Component } from 'src/app/shared/components/lpb-select2/lpb-select2.component';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { ACN_TYPE, TRANSCODE_TYPE } from '../../constants/internal';
import { Product } from '../../models/common';
import { distinctUntilChanged } from 'rxjs/operators';
import { InternalTransferService } from '../../services/internal/internal-transfer.service';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  @Output() create = new EventEmitter<any>();

  userInfo: any;
  isGDV: boolean;
  isKSV: boolean;
  isHoiSo: boolean;

  @Input() formSearch: FormGroup;
  @Input() lstProduct: Product[];
  @Output() submitSearchTransaction: EventEmitter<any> =
    new EventEmitter<any>();

  @ViewChild('createdDate', { static: false })
  createdDate: LpbDatePickerComponent; // Từ ngày
  @ViewChild('toCreatedDate', { static: false })
  toCreatedDate: LpbDatePickerComponent; // Đến ngày
  maxDate = new Date();
  apiUrlUserListAll = '';
  createBysState: {
    data: any;
    setData: any;
  };

  branchList: any[];

  @ViewChild('selectCreatedBy') selectCreatedBy: LpbSelect2Component;
  @Input() TRANSACTION_STATUSES: [];

  @Input() disableSearch = false;
  @Output() showWarningEvent = new EventEmitter();

  TRANSCODE_TYPES = Object.values(TRANSCODE_TYPE);
  ACN_TYPES = Object.values(ACN_TYPE);

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private internalTransferService: InternalTransferService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isGDV = isGDV();
    this.isKSV = isKSV();
    this.isHoiSo = isHoiSo();
  }

  ngOnInit(): void {
    this.formSearch
      .get('branchCode')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((e) => {
        if (isHoiSo()) {
          this.formSearch
            .get('createdBy')
            .setValue(null, { onlySelf: true, emitEvent: true });
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
      this.formSearch.get('branchCode').setValue(this.userInfo.branchCode);
      this.formSearch.get('branchCode').disable();

      if (isGDV()) {
        this.formSearch.get('createdBy').setValue(this.userInfo.userName);
        this.formSearch.get('createdBy').disable();
      }
    } else {
      this.formSearch.get('branchCode').setValue(this.userInfo.branchCode);
    }

    this.lstProduct = [
      { name: 'Tất cả sản phẩm', code: '', type: '' },
      ...this.lstProduct,
    ];
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disableSearch && !changes.disableSearch.firstChange) {
      const disableSearch = changes.disableSearch.currentValue;

      if (disableSearch) {
        this.formSearch.disable();
        this.createdDate.disable();
        this.toCreatedDate.disable();
      } else {
        this.formSearch.enable();
        this.createdDate.enable();
        this.toCreatedDate.enable();
      }
    }
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

  searchTransfer(): boolean {
    this.formSearch.markAllAsTouched();
    if (this.disableSearch) {
      this.showWarningEvent.emit();
      return;
    }
    if (this.formSearch.invalid) {
      return;
    } else if (this.createdDate.errorMsg || this.toCreatedDate.errorMsg) {
      return false;
    } else {
      this.submitSearchTransaction.emit();
      return true;
    }
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }
  createdDateChange(): boolean {
    if (this.createdDate.haveValue() && !this.createdDate.haveValidDate()) {
      this.createdDate.setErrorMsg('Ngày tạo sai định dạng');
      return;
    } else {
      this.createdDate.setErrorMsg('');
    }
    this.formSearch
      .get('createdDate')
      .setValue(this.createdDate.getValue() || null);
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
    this.formSearch
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

  navToCreatePage(): void {
    this.create.emit();
  }
  onClearBranchCode() {
    const { setData: setCreatedBys } = this.createBysState || {};
    setCreatedBys([]);
    this.formSearch
      .get('createdBy')
      .setValue(null, { onlySelf: true, emitEvent: true });
  }
}
