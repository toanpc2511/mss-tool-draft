import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferFormComponent } from '../../shared/components/transfer-form/transfer-form.component';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { ActivatedRoute, Router } from '@angular/router';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NumberValidatorHelper } from 'src/app/manager-smart-form/card-services/shared/helpers/numberHelper';
import { RECIPIENT_SEARCH_TYPE } from '../../shared/constants/internal';
import { InternalTransferFormService } from '../../shared/services/internal/internal-transfer-form.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { ApproveRequest } from '../../shared/models/internal';
import { DOC_TYPES, FEE_TYPES } from '../../shared/constants/common';
import { ValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;

  @ViewChild('transferForm') transferForm: TransferFormComponent;
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
    {
      actionIcon: 'keyboard_backspace',
      actionName: 'Quay lại',
      actionClick: () => this.backToSearch(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private dialog: MatDialog,
    private internalTransferFormService: InternalTransferFormService,
  ) {}

  ngOnInit(): void {
    this.dialogService.setDialog(this.dialog);
    BreadCrumbHelper.setBreadCrumb([
      'Chuyển tiền',
      'Chuyển tiền trong hệ thống',
      'Yêu cầu chuyển tiền',
    ]);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initForm();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      id: [null],
      transCode: [null],
      productCode: [null, [Validators.required]],
      employeeId: [{ value: this.userInfo.employeeId, disabled: true }],
      senderCifNo: [null, [ValidatorHelper.required]],
      senderAcn: [null, [ValidatorHelper.required, Validators.minLength(12)]],
      senderAccountBranchCode: [{ value: null, disabled: true }],
      senderAccountName: [{ value: null, disabled: true }],
      senderAvailableBalance: [null],
      senderName: [null],
      senderCurCode: [{ value: null, disabled: true }],
      senderAddress: [null],

      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      note: [
        '',
        [
          ValidatorHelper.required,
          Validators.pattern(`^([A-Za-z0-9-,./\\s]|[${viRegStr()}])+$`),
        ],
      ],

      recipientSearchType: [RECIPIENT_SEARCH_TYPE.ACN],
      recipientCif: [null, [ValidatorHelper.required]],
      recipientAcn: [null, [ValidatorHelper.required, Validators.minLength(12)]],
      recipientAccountName: [{ value: null, disabled: true }],
      recipientFullNameACN: [null],
      recipientAvailableBalance: [null],
      recipientCurCode: [{ value: null, disabled: true }],
      recipientAccountBranchCode: [{ value: null, disabled: true }],

      recipientFullNameGTXM: [null, [ValidatorHelper.required]],
      recipientDocNum: [null, [ValidatorHelper.required, Validators.minLength(8)]],
      recipientDocType: [DOC_TYPES.CCCD, [Validators.required]],
      recipientDocIssueDate: [null, [ValidatorHelper.required]],
      recipientDocIssuePlace: [null, [ValidatorHelper.required]],
      recipientCurrentAcnBranchCode: [{ value: null, disabled: true }],
      recipientCurrentAcn: [null, [ValidatorHelper.required, Validators.minLength(12)]],
      recipientCurrentAcnName: [null],
      recipientCurrentAcnCurCode: [null],

      feeType: [FEE_TYPES.EXCLUDING],
      fee: [0],
      feeVAT: [0],
      feeEx: [0],
      feeVATEx: [0],
      version: [null],
    });
  }

  backToSearch(): void {
    this.internalTransferFormService.backToSearch();
  }

  navigateToDetail(id: string): void{
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: id,
      },
    });
  }

  onSave(callBack?: (request: ApproveRequest) => void) {
    if (!this.transferForm.validateForm()) {
      return;
    }

    this.internalTransferFormService
      .saveTransfer(this.createForm, 'CREATE')
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.createForm.get('id').setValue(res.data.id);
            this.createForm.get('version').setValue(res.data.version);
            this.disabledForm = true;

            const request: ApproveRequest = {
              id: res.data.id,
              version: res.data.version,
            };
            if (callBack) {
              callBack(request);
            } else {
              this.customNotificationService.success(
                'Thông báo',
                'Lưu thông tin thành công'
              );
              this.navigateToDetail(request.id);
            }
          }
        },
        (error) => {}
      );
  }

  onSendApprove() {
    if (!this.transferForm.validateForm() && !this.disabledForm) {
      return;
    }

    this.internalTransferFormService.openSendApproveDialog(
      { acn: this.createForm.get('senderAcn').value },
      () => {
        const transactionId = this.createForm.get('id').value;
        if (!transactionId) {
          this.onSave((request) => {
            this.internalTransferFormService.sendApprove(request).subscribe(
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
          this.internalTransferFormService.sendApprove(request).subscribe(
            (res) => {
              this.navigateToDetail(request.id);
            },
            (error) => {}
          );
        }
      }
    );
  }
}
