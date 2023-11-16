import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { NapasTransferFormComponent } from '../../shared/components/external-transfer-form/napas-transfer-form/napas-transfer-form.component';
import { FEE_TYPES } from '../../shared/constants/common';
import { NAPAS_SEARCH_TYPES } from '../../shared/constants/napas';
import { ApproveRequest } from '../../shared/models/common';
import { NapasTransferFormService } from '../../shared/services/napas/napas-transfer-form.service';
import { ValidatorHelper, NumberValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;

  @ViewChild('napasForm') napasForm: NapasTransferFormComponent;
  dialogRef: any;
  userInfo: any;

  disabledForm: boolean = false;
  actions: ActionModel[] = [
    {
      actionIcon: 'send',
      actionName: 'Gửi duyệt',
      actionClick: () => this.onSendApprove(),
    },
    {
      actionIcon: 'save',
      actionName: 'Lưu thông tin',
      actionClick: () => this.onSave(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private napasTransferFormService: NapasTransferFormService,
    private customNotificationService: CustomNotificationService
  ) {}

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Chuyển tiền',
      'Chuyển tiền nhanh liên Ngân hàng tại Quầy',
    ]);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initForm();
  }

  initForm(){
    this.createForm = this.fb.group({
      id: [null],
      transCode: [null],
      productCode: [null, [Validators.required]],
      employeeId: [this.userInfo.employeeId, ValidatorHelper.required],
      intermediaryAcn: [{ value: '502000006', disabled: true }],
      intermediaryAcnName: [
        {
          value: 'TK TRUNG GIAN CHUYEN TIEN LIEN NGAN HANG - KENH TAI QUAY',
          disabled: true,
        },
      ],

      senderCifNo: [null, [ValidatorHelper.required]],
      senderAcn: [null, [ValidatorHelper.required, Validators.minLength(12)]],
      senderAccountBranchCode: [{ value: null, disabled: true }],
      senderAvailableBalance: [null],
      senderName: [null],
      senderCurCode: [{ value: null, disabled: true }],
      senderAddress: [null],
      senderAddressLine1: [null],
      senderAddressLine2: [null],
      senderAddressLine3: [null],
      senderAddressLine4: [null],
      senderAccountName: [null],

      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      note: [
        '',
        [
          ValidatorHelper.required,
          Validators.pattern(`^([A-Za-z0-9-,./\\s]|[${viRegStr()}])+$`),
        ],
      ],

      recipientTxtType: [NAPAS_SEARCH_TYPES.ACN],
      recipientCardNum: [{value: null, disabled: true}, [Validators.required]],
      recipientAcn: [null, [Validators.required]],
      recipientBankId: [null, [Validators.required]],
      recipientBankName: [{ value: null, disabled: true }, [Validators.required]],
      recipientFullName: [null, [Validators.required]],

      feeType: [FEE_TYPES.EXCLUDING],
      fee: [0],
      feeVAT: [0],
      version: [null],
    });
  }

  navigateToDetail(transId: string): void {
    this.napasTransferFormService.navigateToDetail(
      {
        transId,
      },
    );
  }

  onSendApprove() {
    if (!this.napasForm.validateForm() && !this.disabledForm) {
      return;
    }

    this.napasTransferFormService.openSendApproveDialog(
      { acn: this.createForm.get('senderAcn').value },
      () => {
        const transactionId = this.createForm.get('id').value;
        if (!transactionId) {
          this.napasTransferFormService
            .saveTransfer(this.createForm, 'CREATE')
            .subscribe((res) => {
              const request: ApproveRequest = {
                id: res.data.id,
                version: res.data.version,
              };

              this.napasTransferFormService.sendApprove(request).subscribe(
                (res) => {
                  this.navigateToDetail(res.data.id);
                },
                (error) => {}
              );
            });
        } else {
          const request: ApproveRequest = {
            id: this.createForm.get('id').value,
            version: this.createForm.get('version').value,
          };
          this.napasTransferFormService.sendApprove(request).subscribe(
            (res) => {
              this.navigateToDetail(request.id);
            },
            (error) => {}
          );
        }
      }
    );
  }

  onSave() {
    if (!this.napasForm.validateForm()) {
      return;
    }

    this.napasTransferFormService
      .saveTransfer(this.createForm, 'CREATE')
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success(
              'Thông báo',
              'Lưu thông tin thành công'
            );
            this.navigateToDetail(res.data.id);
          }
        },
        (error) => {}
      );
  }
}
