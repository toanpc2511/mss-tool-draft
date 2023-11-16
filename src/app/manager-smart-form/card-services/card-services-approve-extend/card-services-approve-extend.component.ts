import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { isHoiSo } from 'src/app/shared/utilites/role-check';
import { APPROVE_STEP } from '../shared/constants/card-service-constants';
import { ValidatorHelper } from '../shared/helpers/validators.helper';
import { EbsServicesApproveObject } from '../shared/models/card-services-approve';
declare var $: any;

const atLeastOne =
  (validator: ValidatorFn, controls: string[] = null) =>
  (group: FormGroup): ValidationErrors | null => {
    if (!controls) {
      controls = Object.keys(group.controls);
    }
    const hasAtLeastOne =
      group &&
      group.controls &&
      controls.some((k) => !validator(group.controls[k]));

    return hasAtLeastOne ? null : { atLeastOne: true };
  };

@Component({
  selector: 'app-card-services-approve-extend',
  templateUrl: './card-services-approve-extend.component.html',
  styleUrls: ['./card-services-approve-extend.component.scss'],
})
export class CardServicesApproveExtendComponent implements OnInit {
  cardEbsServiceSelected: EbsServicesApproveObject;
  constructor(private fb: FormBuilder) {}

  APPROVE_STEP = APPROVE_STEP;
  step: string = APPROVE_STEP.HOME;
  cardHistorySearchForm: FormGroup;

  approveSearchForm: FormGroup;

  ngOnInit(): void {
    $('.parentName').html('Dịch vụ Hỗ trợ thẻ');
    $('.childName').html('Phê duyệt dịch vụ thẻ');

    let userBrandCode = '';
    const userInfoTxt = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoTxt);
    try {
      if (userInfo.branchCode) {
        userBrandCode = userInfo.branchCode;
      }
    } catch (error) {}

    this.approveSearchForm = this.fb.group(
      {
        type: ['CIF'],
        txtSearch: [''],
        cardProductCode: [null],
        branchCode: [
          {
            value: userBrandCode === '001' ? '110' : userBrandCode,
            disabled: userBrandCode !== '001',
          },
        ],
        actionCode: [null],
        inputBy: [''],
      },
      {
        validator: atLeastOne(ValidatorHelper.required, [
          'txtSearch',
          'inputBy',
        ]),
      }
    );

    this.cardHistorySearchForm = this.fb.group({
      type: ['CIF'],
      txtSearch: [''],
      inputBy: [''],
      branchCodeDo: [
        {
          value: userBrandCode === '001' ? '110' : userBrandCode,
          disabled: userBrandCode !== '001',
        },
      ],
      actionCode: [null],
      serviceStatus: [null],
      searchType: [''],
      approveBy: [''],
      fromDate: [null],
      toDate: [null],
      pageIndex: [null],
      pageSize: [null],
    });

    if (!isHoiSo) {
      this.approveSearchForm.controls['branchCode'].setValidators([
        Validators.required,
      ]);
      this.cardHistorySearchForm.controls['branchCodeDo'].setValidators([
        Validators.required,
      ]);
    }
  }

  changeStep(evt): void {
    this.cardEbsServiceSelected = evt.selectedItem;
    this.step = evt.step;
  }

  backToSearch(): void {
    this.step = APPROVE_STEP.HOME;
  }

  backHistory(): void {
    this.step = APPROVE_STEP.HISTORY;
  }
}
