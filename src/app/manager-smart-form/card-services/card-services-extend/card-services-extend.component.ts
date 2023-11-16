import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isHoiSo } from 'src/app/shared/utilites/role-check';
import { EXTEND_STEP } from '../shared/constants/card-service-constants';
import { ValidatorHelper } from '../shared/helpers/validators.helper';
import { CardEbsInfo, CardSearchInfo } from '../shared/models/card-inssuance';
declare var $: any;

@Component({
  selector: 'app-card-services-extend',
  templateUrl: './card-services-extend.component.html',
  styleUrls: ['./card-services-extend.component.scss'],
})
export class CardServicesExtendComponent implements OnInit {
  cardSelectedSearch: CardSearchInfo;
  cardEbsInfoSelected: CardEbsInfo;
  cardSearchForm: FormGroup;
  cardHistorySearchForm: FormGroup;
  lstCardServiceHistories: CardSearchInfo[] = [];

  constructor(private fb: FormBuilder) {}

  EXTEND_STEP = EXTEND_STEP;
  step: string = EXTEND_STEP.HOME;

  ngOnInit(): void {
    $('.parentName').html('Hỗ trợ thẻ');

    this.cardSearchForm = this.fb.group({
      type: ['CIF', ValidatorHelper.required],
      txtSearch: ['', ValidatorHelper.required],
      cardProductCode: [null],
      branchCode: [null],
      ebsActionSearch: [null, ValidatorHelper.required],
      cardCoreId: [null],
    });

    let userBrandCode = '';
    let userInfo;
    try {
      const userInfoTxt = localStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfoTxt);
      if (userInfo.branchCode) {
        userBrandCode = userInfo.branchCode;
      }
    } catch (error) {}

    this.cardHistorySearchForm = this.fb.group({
      type: ['CIF'],
      txtSearch: [''],
      inputBy: [
        {
          value: userBrandCode === '001' ? '' : userInfo?.userName,
          disabled: userBrandCode !== '001',
        },
      ],
      branchCodeDo: [
        {
          value: userBrandCode === '001' ? '110' : userBrandCode,
          disabled: userBrandCode !== '001',
        },
      ],
      actionCode: [null],
      serviceStatus: [null],
      searchType: [''],
      fromDate: [null],
      toDate: [null],
      pageIndex: [null],
      pageSize: [null],
    });

    if (!isHoiSo()) {
      this.cardHistorySearchForm.controls['branchCodeDo'].setValidators([
        Validators.required,
      ]);
    }
  }

  changeStep(evt): void {
    this.cardSelectedSearch = evt.cardInfo;
    this.step = evt.step;
  }

  backStep(evt?: string): void {
    this.step = evt || EXTEND_STEP.HOME;
  }
  backHistory(): void {
    this.step = EXTEND_STEP.HISTORY;
  }
}
