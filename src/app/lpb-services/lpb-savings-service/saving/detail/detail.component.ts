import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LpbFooterComponent } from 'src/app/shared/components/lpb-footer/lpb-footer.component';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import {
  ValidatorHelper,
  viRegStr,
} from 'src/app/shared/utilites/validators.helper';
import { SavingFormComponent } from '../../shared/components/saving-form/saving-form.component';
import {
  DATE_FORMAT_VN_SIMPLE,
  DOC_TYPES,
} from '../../shared/constants/common';
import { MoneyListFormService } from '../../shared/services/money-list-form.service';
import { SavingFormService } from '../../shared/services/saving-form.service';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  id: string;
  transactionData: any;
  detailForm: FormGroup;
  builder: any;

  actions: ActionModel[];
  hiddenButtons = [];

  @ViewChild('formSavingForm', { read: ElementRef }) savingFormRef: ElementRef;
  @ViewChild(SavingFormComponent) savingForm: SavingFormComponent;
  @ViewChild(LpbFooterComponent) footer: LpbFooterComponent;

  constructor(
    private fb: FormBuilder,
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private moneyListFormService: MoneyListFormService,
    private savingFormService: SavingFormService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.dialogService.setDialog(this.dialog);

    this.actions = [
      {
        actionIcon: 'keyboard_backspace',
        actionName: 'Quay lại',
        actionClick: () => this.navigateBack(),
      },
      {
        actionIcon: 'print',
        actionName: 'Demo In chứng từ',
        actionClick: () => this.openPrintDialog(),
      },
    ];
  }

  ngOnInit() {
    BreadCrumbHelper.setBreadCrumb(['Dịch vụ tài chính', '']);
    this.initForm();
  }

  initForm() {
    const crrDateStr = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    this.detailForm = this.fb.group({
      sender: this.fb.group({
        senderCif: [null, ValidatorHelper.required],
        senderDocNum: [null, ValidatorHelper.required],
        senderDocType: [{ value: DOC_TYPES.CCCD, disabled: true }],
        senderFullName: [null],
      }),

      account: this.fb.group({
        productType: [null, Validators.required],
        classCode: [{ value: null, disabled: true }],
        interestRate: [{ value: null, disabled: true }],
        curCode: [null, Validators.required],
        serialNo: [null, Validators.required],
        forecastInterest: [{ value: null, disabled: true }],
        termCode: [null, Validators.required],
        term: [null, Validators.required],
        acn: [{ value: null, disabled: true }],
        finalizeMethod: [null, Validators.required],
        startDate: [{ value: crrDateStr, disabled: true }, Validators.required],
        maturityDate: [{ value: null, disabled: true }, Validators.required],
        depositAmount: [null, Validators.required],
        note: [
          '',
          [
            ValidatorHelper.required,
            Validators.pattern(`^([A-Za-z0-9-,./\\s]|[${viRegStr()}])+$`),
          ],
        ],
      }),

      moneyList: this.moneyListFormService.getDefaultMoneyList(),
    });

    this.savingFormService.setSavingAccountCurCodeControl(
      this.detailForm.get('account').get('curCode')
    );

    this.detailForm.addControl(
      'depositArr',
      this.savingFormService.getDefaultDepositFormArray()
    );
    this.detailForm.addControl(
      'receiptArr',
      this.savingFormService.getDefaultReceiptFormArray()
    );
  }

  openPrintDialog(): void {
    const dialogParams: ILpbDialog = {
      title: 'Chọn biểu mẫu',
      messages: [],
      buttons: {
        confirm: { display: true, label: 'Đồng ý' },
        dismiss: { display: true, label: 'Quay lại' },
      },
      form: [
        {
          name: 'fileType',
          defaultValue: 'pdf',
          disabled: false,
          type: CONTROL_TYPES.radio,
          label: 'Định dạng',
          isHorizontal: true,
          group: [
            {
              label: 'PDF',
              value: 'pdf',
            },
            {
              label: '.doc',
              value: 'doc',
            },
          ],
        },
        {
          name: 'form',
          defaultValue: ['dsJAH', 'ds'],
          disabled: false,
          type: CONTROL_TYPES.checkbox,
          label: 'Biểu mẫu',
          group: [
            { label: 'Sổ tiết kiệm', value: 'sb' },
            { label: 'Giấy gửi tiết kiệm', value: 'ds' },
            { label: 'Giấy gửi tiết kiệm có ĐSH', value: 'dsJAH' },
            {
              label: 'Giấy gửi tiết kiệm có người đại diện pháp luật',
              value: 'dsLR',
            },
            { label: 'Giấy gửi tiết kiệm có người ủy quyền', value: 'dsAP' },
          ],
        },
      ],
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      console.log(result);
    });
  }

  navigateBack(): void {
    this.router
      .navigate(['../'], { relativeTo: this.activatedRoute })
      .then(() => {})
      .catch((e) => {});
  }
}
