import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { ValidatorHelper, NumberValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';
import { CitadTransferFormComponent } from '../../shared/components/external-transfer-form/citad-transfer-form/citad-transfer-form.component';
import { FEE_TYPES } from '../../shared/constants/common';
import { RECIPIENT_SEARCH_TYPE } from '../../shared/constants/internal';
import { ApproveRequest } from '../../shared/models/common';
import { CitadTransferFormService } from '../../shared/services/citad/citad-transfer-form.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;

  @ViewChild('citadForm') citadForm: CitadTransferFormComponent;
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
    private citadTransferFormService: CitadTransferFormService,
    private customNotificationService: CustomNotificationService
  ) {}

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Chuyển tiền',
      'Chuyển tiền đi trong nước khác hệ thống qua kênh Citad',
    ]);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initForm();
  }

  initForm() {
    this.createForm = this.fb.group({
      id: [null],
      transCode: [null],
      productCode: [null, [Validators.required]],
      employeeId: [this.userInfo.employeeId, ValidatorHelper.required],
      routeCode: [null, [Validators.required]],
      nostroAcn: [{ value: '000000010001', disabled: true }],
      nostroName: [{ value: 'TGTT VND - SGD NHNN VN', disabled: true }],

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
      accountingNote: [null, [Validators.maxLength(210)]],

      recipientTxtType: [RECIPIENT_SEARCH_TYPE.ACN],
      recipientAcn: ['', [Validators.required]],
      recipientDocNum: [{ value: '', disabled: true }, [Validators.required]],
      recipientFullName: [null, [ValidatorHelper.required]],
      recipientDocType: [
        { value: null, disabled: true },
        [Validators.required],
      ],
      recipientDocIssueDate: [
        { value: null, disabled: true },
        [
          ValidatorHelper.required,
          ValidatorHelper.dateFormat('DD/MM/YYYY', { maxDate: new Date() }),
        ],
      ],
      recipientDocIssuePlace: [
        { value: null, disabled: true },
        [ValidatorHelper.required],
      ],
      recipientBankId: [null, [ValidatorHelper.required]],
      recipientBank: [null],
      recipientBankName: [null],
      recipientBankAddress: [null, [ValidatorHelper.required]],
      recipientIndirectCode: [null, [ValidatorHelper.required]],
      recipientIndirectCodeId: [null],
      recipientDirectCode: [{ value: null, disabled: true }],
      inDirectCodeDesc: [null],

      feeType: [FEE_TYPES.EXCLUDING],
      fee: [0],
      feeVAT: [0],
      version: [null],
    });
  }

  navigateToDetail(transId: string): void {
    this.citadTransferFormService.navigateToDetail({
      transId,
    });
  }

  onSendApprove() {
    if (!this.citadForm.validateForm() && !this.disabledForm) {
      return;
    }

    this.citadTransferFormService.openSendApproveDialog(
      { acn: this.createForm.get('senderAcn').value },
      () => {
        const transactionId = this.createForm.get('id').value;
        if (!transactionId) {
          this.citadTransferFormService
            .saveTransfer(this.createForm, 'CREATE')
            .subscribe((res) => {
              const request: ApproveRequest = {
                id: res.data.id,
                version: res.data.version,
              };

              this.citadTransferFormService.sendApprove(request).subscribe(
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
          this.citadTransferFormService.sendApprove(request).subscribe(
            (res) => {
              this.navigateToDetail(request.id);
            },
            (error) => {}
          );
        }
      }
    );
  }

  onSave(callBack?: (request: ApproveRequest) => void) {
    if (!this.citadForm.validateForm()) {
      return;
    }

    this.citadTransferFormService
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
