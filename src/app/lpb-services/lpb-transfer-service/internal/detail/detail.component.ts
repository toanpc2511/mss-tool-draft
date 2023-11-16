import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { ApproveRequest, InternalTransfer } from '../../shared/models/internal';
import { TransferFormComponent } from '../../shared/components/transfer-form/transfer-form.component';
import {
  DOC_TYPES,
  FEE_TYPES,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES,
} from '../../shared/constants/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { InternalTransferFormService } from '../../shared/services/internal/internal-transfer-form.service';
import { InternalTransferService } from '../../shared/services/internal/internal-transfer.service';
import { isKSV } from 'src/app/shared/utilites/role-check';
import { RECIPIENT_SEARCH_TYPE } from '../../shared/constants/internal';
import { HiddenButton } from '../../shared/models/common';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { LpbFooterComponent } from 'src/app/shared/components/lpb-footer/lpb-footer.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { finalize, switchMap } from 'rxjs/operators';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FooterButtonAction } from '../../shared/interface/common';
import { ValidatorHelper, NumberValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';
import { ILpbDialog, LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { ErrorHelper } from 'src/app/shared/utilites/error.helper';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  disabledForm = true;
  detailForm: FormGroup;
  noteForm: FormGroup;

  initFormData: InternalTransfer;
  @ViewChild('transferForm') transferForm: TransferFormComponent;
  @ViewChild('footer') footer: LpbFooterComponent;

  role: 'KSV' | 'GDV' = 'GDV';
  userInfo: any;
  TRANS_STATUS_CODES = TRANS_STATUS_CODES;
  hiddenButtons: HiddenButton[] = [];
  footerButtonActions: FooterButtonAction[] = [];

  isEditMode = false;
  status: { name: string; color: string } = null;

  showApproveInfoStatusCodes = [
    TRANS_STATUS_CODES.APPROVE,
    TRANS_STATUS_CODES.APPROVE_REVERT,
    TRANS_STATUS_CODES.REJECT,
  ];

  actions: ActionModel[] = [
    {
      actionIcon: 'keyboard_backspace',
      actionName: 'Quay lại',
      actionClick: () => this.backToSearch(),
    },
  ];

  approveRetryVersion = 0;
  userLimit = null;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customNotificationService: CustomNotificationService,
    private internalTransferService: InternalTransferService,
    private internalTransferFormService: InternalTransferFormService,
    private cdr: ChangeDetectorRef
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.role = isKSV() ? 'KSV' : 'GDV';
    this.internalTransferFormService.reset();
  }

  ngAfterViewInit(): void {
    this.transferForm.disableForm();
    this.footerButtonActions = this.footer.buttonActions;

    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          const id = params['transId'];
          this.isEditMode = Boolean(params['status'] === 'open');
          this.disabledForm = true;
          return this.internalTransferService.getTransactionDetail(id);
        }),
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            if(!isKSV()){
              this.initData(res.data);
              return;
            }

            this.internalTransferService
              .getLimit()
              .pipe(
                finalize(() => {
                  this.initData(res.data);
                })
              )
              .subscribe((res) => {
                this.userLimit = res.data;
              });
          }
        },
        (error) => {
          this.backToSearch();
        }
      );

    this.footer.buttonActions = this.footer.buttonActions.map((button) => {
      if (button.actionCode === FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE) {
        return { ...button, actionName: 'Xử lý', icon: 'check' };
      }
      return button;
    });
  }

  initData(data: InternalTransfer) {
    this.updateForm(data, true);
    this.validatePermission(data);
    this.internalTransferFormService.patchDataToForm(this.detailForm, data);

    const getSenderInfoObs = new Observable((observer) => {
      this.transferForm.getCustomerInfo({
        type: 'SENDER',
        input: 'cif',
        txtSearch: data.cifNo,
        callback: (data) => {
          const accounts = data?.[0]?.accounts;
          const senderAcc = accounts?.find(
            (acc) => acc?.acn === this.initFormData.acn
          );
          this.transferForm.loadAccountInfo('SENDER', senderAcc, 'senderCif');
          observer.next(data);
          observer.complete();
        },
      });
    });

    const getRecipientInfoObs = new Observable((observer) => {
      const input = data.recipientDocNum ? 'gtxm' : 'acn';
      if (input === 'gtxm') {
        observer.next(true);
        observer.complete();
        return;
      }
      const txtSearch = data.recipientAcn;
      this.transferForm.getCustomerInfo({
        type: 'RECIPIENT',
        input: input,
        txtSearch: txtSearch,
        callback: (data) => {
          observer.next(data);
          observer.complete();
        },
      });
    });

    const getFeeObs = new Observable((observer) => {
      this.transferForm.getFeeAndVAT(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (error) => {
          observer.next(null);
          observer.complete();
        }
      );
    });

    const observableList = [getSenderInfoObs, getRecipientInfoObs, getFeeObs];
    if (data.recipientDocNum) {
      const getRecipientCrrAccInfoObs = new Observable((observer) => {
        this.transferForm.getCrrAccountInfo(data.recipientAcn, (data) => {
          observer.next(data);
          observer.complete();
        });
      });
      observableList.push(getRecipientCrrAccInfoObs);
    }

    forkJoin(observableList).subscribe(() => {
      if (this.isEditMode) {
        this.disabledForm = false;
        this.hiddenButtons = this.getHiddenButtons(this.initFormData, false);
      }

      if (
        this.initFormData.status === TRANS_STATUS_CODES.REJECT ||
        this.initFormData.status === TRANS_STATUS_CODES.APPROVE ||
        this.initFormData.status === TRANS_STATUS_CODES.WAIT_MODIFY ||
        this.initFormData.status === TRANS_STATUS_CODES.APPROVE_REVERT
      ) {
        this.internalTransferFormService.openNotePopup(data);
      }
    });
  }

  ngOnInit(): void {
    const breadCrumbList = ['Chuyển tiền', 'Chuyển tiền trong hệ thống'];
    if (this.role === 'KSV') {
      breadCrumbList.push('Duyệt yêu cầu chuyển khoản');
    } else {
      breadCrumbList.push('Chi tiết yêu cầu chuyển khoản');
    }
    BreadCrumbHelper.setBreadCrumb(breadCrumbList);
    this.initForm();
  }

  initForm(): void {
    this.detailForm = this.fb.group({
      id: [null],
      transCode: [null],
      productCode: [null, [Validators.required]],
      employeeId: [{ value: null, disabled: true }],
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
      recipientAcn: [
        null,
        [ValidatorHelper.required, Validators.minLength(12)],
      ],
      recipientAccountName: [{ value: null, disabled: true }],
      recipientFullNameACN: [null],
      recipientAvailableBalance: [null],
      recipientCurCode: [{ value: null, disabled: true }],
      recipientAccountBranchCode: [{ value: null, disabled: true }],

      recipientFullNameGTXM: [null, [ValidatorHelper.required]],
      recipientDocNum: [
        null,
        [ValidatorHelper.required, Validators.minLength(8)],
      ],
      recipientDocType: [DOC_TYPES.CCCD, [Validators.required]],
      recipientDocIssueDate: [null, [ValidatorHelper.required]],
      recipientDocIssuePlace: [null, [ValidatorHelper.required]],
      recipientCurrentAcnBranchCode: [{ value: null, disabled: true }],
      recipientCurrentAcn: [
        null,
        [ValidatorHelper.required, Validators.minLength(12)],
      ],
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

  getHiddenButtons(record: InternalTransfer, disabledForm: boolean = true) {
    const hiddenButtons = this.internalTransferFormService.getHiddenButtons(
      record,
      disabledForm
    );

    let newHiddenButtons: HiddenButton[] = hiddenButtons
      .map((hiddenButton) => {
        const buttonAction = this.footerButtonActions.find((button) =>
          button.actionCode.includes(hiddenButton.actionCode)
        );

        if (!buttonAction) {
          return null;
        }

        return {
          actionCode: buttonAction.actionCode,
          hiddenType: hiddenButton.hiddenType,
        };
      })
      .filter((button) => button);

    const approveCode = FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE;
    if (
      !newHiddenButtons.some((button) => button.actionCode === approveCode) &&
      record.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      newHiddenButtons = [
        ...newHiddenButtons,
        {
          actionCode: FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE,
          hiddenType: 'disable',
        },
      ];
    }

    return newHiddenButtons;
  }

  backToSearch(): void {
    this.internalTransferFormService.backToSearch();
  }

  navigateToDetail(transId: string): void {
    const url = window.location.href;
    const newUrl = new URL(url).pathname;
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([newUrl], { queryParams: { transId } }));
  }

  handleAfterSubmit(data: InternalTransfer) {
    if (!this.isEditMode) {
      this.updateForm(data);
    } else {
      this.navigateToDetail(data.id);
    }
  }

  validatePermission(data: InternalTransfer) {
    if (
      !this.internalTransferFormService.checkPermission(data, this.isEditMode)
    ) {
      this.router.navigate(['/permission-denied']);
    }
  }

  onEdit() {
    this.disabledForm = false;
    this.hiddenButtons = this.getHiddenButtons(this.initFormData, false);
  }

  updateForm(data: InternalTransfer, disabled: boolean = true) {
    if (
      data.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      this.internalTransferFormService.openLimitPopup();
    }

    this.initFormData = { ...data };
    this.detailForm.get('id').setValue(data.id);
    this.detailForm.get('version').setValue(data.version);
    this.status = TRANSACTION_STATUSES.find(
      (stat) => stat.code === this.initFormData?.status
    );

    if (!this.showApproveInfoStatusCodes.includes(data.status)) {
      this.initFormData.approveBy = null;
      this.initFormData.approveDate = null;
      this.initFormData.approveRevertBy = null;
      this.initFormData.approveRevertDate = null;
    }

    this.hiddenButtons = this.getHiddenButtons(this.initFormData);
    this.disabledForm = disabled;
  }

  onSave(callBack?: (request: ApproveRequest) => void) {
    if (!this.transferForm.validateForm()) {
      return;
    }

    this.internalTransferFormService
      .saveTransfer(this.detailForm, 'UPDATE')
      .subscribe(
        (res) => {
          if (res && res.data) {
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
              this.handleAfterSubmit(res.data);
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
      { acn: this.detailForm.get('senderAcn').value },
      () => {
        const transactionId = this.detailForm.get('id').value;
        if (!this.disabledForm) {
          this.onSave((request) => {
            this.internalTransferFormService.sendApprove(request).subscribe(
              (res) => {
                this.handleAfterSubmit(res.data);
              },
              (error) => {}
            );
          });
        } else {
          const request: ApproveRequest = {
            id: this.detailForm.get('id').value,
            version: this.detailForm.get('version').value,
          };
          this.internalTransferFormService.sendApprove(request).subscribe(
            (res) => {
              this.handleAfterSubmit(res.data);
            },
            (error) => {}
          );
        }
      }
    );
  }

  onDelete(): void {
    this.internalTransferFormService.delete(this.initFormData, () => {
      this.backToSearch();
    });
  }

  onApprove(): void {
    this.internalTransferFormService.approve(
      this.initFormData,
      () => {
        this.backToSearch();
      },
      (error, req) => {
        if (ErrorHelper.isTimeoutError(error?.code)) {
          this.internalTransferService
            .getTransactionDetail(this.initFormData.id)
            .subscribe((res) => {
              this.updateForm(res.data);
            });
        }
      }
    );
  }

  onReverse(): void {
    this.internalTransferFormService.reverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onUnReverse(): void {
    this.internalTransferFormService.unReverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onPrintForm(): void {
    this.internalTransferFormService.printForm(this.initFormData.id);
  }

  onPrintDocument(): void {
    this.internalTransferFormService.printDocument(this.initFormData.id);
  }
}
