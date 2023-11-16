import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UserInfo} from '../../../_models/user';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {ViettelPostService} from '../shared/services/viettelpost.service';
import {compareDate} from '../../../shared/constants/utils';
import {isHoiSo} from '../../../shared/utilites/role-check';
import {Observable} from 'rxjs';
import {ultis} from '../../../shared/utilites/function';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';
import {FormHelpers} from "../../../shared/utilites/form-helpers";




@Component({
  // tslint:disable-next-line:component-selector
  selector: 'report-transaction',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  billCode: any;
  dsDonVis: any;

  maDvSelected: any;
  tenDvSelected: any;
  userInfo?: UserInfo;
  billId = '';
  formHelpers = FormHelpers;
  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  formReport = this.fb.group({
    billCode: [''],
    branchCode: [''],
  });
  validate = true;
  today = new Date();
  @Input() event: Observable<void>;
  @Input() eventCompleted: Observable<void>;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>(null);

  @ViewChild('startDate', { static: false }) startDate: LpbDatePickerComponent;
  @ViewChild('endDate', { static: false }) endDate: LpbDatePickerComponent;
  //
  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private viettelPostService: ViettelPostService
  ){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.initGetBranchs();
    // debugger;
    this.formReport.get('branchCode')
      .valueChanges.subscribe((value ) => {
      this.maDvSelected = value?.code;
      this.tenDvSelected = value?.name;
    });
  }

  initGetBranchs(): void {
    const url = 'branch';
    this.viettelPostService.getAllBranch(url).subscribe((res) => {
      if (res.data) {
        this.dsDonVis = res.data;
        console.log('chi nhanh', this.dsDonVis);
      }
    });
  }
  exportExcel(): void {
    if (!this.validateEndDate() && !this.validateStartDate()) {
      return;
    }
    const fromDate = this.startDate.getValue();
    const toDate = this.endDate.getValue();
    let branchCode = '';
    if (this.userInfo.branchCode === '001' || this.userInfo.branchCode === '000'){
      if (this.maDvSelected === undefined){
        branchCode = 'ALL';
      }else {
        branchCode = this.formReport.get('branchCode').value?.code;
      }
    }else {
      branchCode = this.userInfo.branchCode;
    }
    console.log('branch', branchCode);
    const url = 'transaction/report';
    this.viettelPostService.downloadFileBc(url, branchCode, fromDate, toDate);
  }

  validateEndDate(): boolean {
    if (!this.endDate.getValue()) {
      this.endDate.setErrorMsg('Bạn phải nhập ngày đến');
      return false;
    } else if (this.endDate.haveValue() && !this.endDate.isValid) {
      this.endDate.setErrorMsg('Ngày đến không hợp lệ');
      return false;
    } else if (compareDate(this.startDate.getValue(), this.endDate.getValue()) === 1) {
      this.endDate.setErrorMsg('Ngày đến không được nhỏ hơn Ngày bắt đầu');
      return false;
    }else {
      this.endDate.setErrorMsg('');
      return true;
    }
  }

  validateStartDate(): boolean {
    if (!this.startDate.getValue()) {
      this.startDate.setErrorMsg('Bạn phải nhập ngày bắt đầu');
      return false;
    }else if (this.startDate.haveValue() && !this.startDate.isValid) {
      this.startDate.setErrorMsg('Ngày đến không hợp lệ');
      return false;
    }else if (compareDate(this.startDate.getValue(), this.endDate.getValue()) === 1) {
      this.startDate.setErrorMsg('Ngày bắt đầu không được lớn hơn ngày đến');
      return false;
    }else {
      this.startDate.setErrorMsg('');
      return true;
    }
  }

  initFormGroup(): void {
    this.formReport = this.fb.group({
      fromDate: [ultis.formatDate(this.today), [Validators.required]],
      toDate: [ultis.formatDate(this.today), [Validators.required]]
    }, {validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]});
  }

  protected readonly FormHelpers = FormHelpers;
}
