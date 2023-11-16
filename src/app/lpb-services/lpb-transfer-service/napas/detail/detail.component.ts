import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { LpbFooterComponent } from 'src/app/shared/components/lpb-footer/lpb-footer.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { isKSV } from 'src/app/shared/utilites/role-check';
import { NapasTransferFormComponent } from '../../shared/components/external-transfer-form/napas-transfer-form/napas-transfer-form.component';
import {
  FEE_TYPES,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES
} from '../../shared/constants/common';
import { NAPAS_SEARCH_TYPES } from '../../shared/constants/napas';
import { FooterButtonAction } from '../../shared/interface/common';
import { ApproveRequest, CommonTransfer, HiddenButton } from '../../shared/models/common';
import { NapasTransfer } from '../../shared/models/napas';
import { NapasTransferService } from '../../shared/services/napas/napas-tranfer.service';
import { NapasTransferFormService } from '../../shared/services/napas/napas-transfer-form.service';
import { ValidatorHelper, NumberValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';
import { InternalTransferService } from '../../shared/services/internal/internal-transfer.service';
import { ErrorHelper } from 'src/app/shared/utilites/error.helper';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  disabledForm = true;
  detailForm: FormGroup;

  initFormData: NapasTransfer;
  @ViewChild('napasForm') napasForm: NapasTransferFormComponent;
  @ViewChild(LpbFooterComponent) footer: LpbFooterComponent;

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
    private napasTransferFormService: NapasTransferFormService,
    private napasTransferService: NapasTransferService,
    private internalTransferService: InternalTransferService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customNotificationService: CustomNotificationService
  ) {
    this.napasTransferFormService.reset();
  }

  ngAfterViewInit(): void {
    this.footerButtonActions = this.footer.buttonActions;

    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          const id = params['transId'];
          this.isEditMode = Boolean(params['status'] === 'open');
          this.disabledForm = true;
          return this.napasTransferService.getTransactionDetail(id);
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
      if (
        button.actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE)
      ) {
        return { ...button, actionName: 'Xử lý', icon: 'check' };
      }
      return button;
    });
  }

  ngOnInit(): void {
    const breadCrumbList = [
      'Chuyển tiền',
      'Chuyển tiền nhanh liên Ngân hàng tại Quầy'
    ];
    BreadCrumbHelper.setBreadCrumb(breadCrumbList);

    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initForm();
  }

  initForm() {
    this.detailForm = this.fb.group({
      id: [null],
      transCode: [null],
      productCode: [null, [Validators.required]],
      employeeId: [null, ValidatorHelper.required],
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
      recipientCardNum: [
        { value: null, disabled: true },
        [Validators.required],
      ],
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

  initData(data: NapasTransfer) {
    if (!this.napasTransferFormService.checkPermission(data, this.isEditMode)) {
      this.router.navigate(['/permission-denied']);
      return;
    }

    this.updateForm(data, true);
    this.napasTransferFormService.patchDataToForm(this.detailForm, data);

    this.napasForm.fetchData().subscribe(() => {
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
        this.napasTransferFormService.openNotePopup(data);
      }
    });
  }

  updateForm(data: CommonTransfer, disabled: boolean = true) {
    if (
      data.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      this.napasTransferFormService.openLimitPopup();
    }

    this.initFormData = { ...data } as NapasTransfer;
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

  getHiddenButtons(record: NapasTransfer, disabledForm: boolean = true) {
    const hiddenButtons = this.napasTransferFormService.getHiddenButtons(
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

    const approveBtn = this.footerButtonActions.find((button) =>
      button.actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE)
    );
    const approveCode = approveBtn?.actionCode;

    if (
      !newHiddenButtons.some((button) => button.actionCode === approveCode) &&
      record.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      newHiddenButtons = [
        ...newHiddenButtons,
        {
          actionCode: approveCode,
          hiddenType: 'disable',
        },
      ];
    }
    return newHiddenButtons;
  }

  handleAfterSubmit(data: CommonTransfer) {
    if (!this.isEditMode) {
      this.updateForm(data);
    } else {
      this.navigateToDetail(data.id);
    }
  }

  navigateToDetail(transId: string): void {
    this.napasTransferFormService.navigateToDetail({
      transId,
    });
  }

  backToSearch(): void {
    this.napasTransferFormService.backToSearch();
  }

  onEdit() {
    this.disabledForm = false;
    this.hiddenButtons = this.getHiddenButtons(this.initFormData, false);
  }

  onSave(callBack?: (request: ApproveRequest) => void) {
    if (!this.napasForm.validateForm()) {
      return;
    }

    this.napasTransferFormService
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
    if (!this.napasForm.validateForm() && !this.disabledForm) {
      return;
    }

    this.napasTransferFormService.openSendApproveDialog(
      { acn: this.detailForm.get('senderAcn').value },
      () => {
        if (!this.disabledForm) {
          this.onSave((request) => {
            this.napasTransferFormService.sendApprove(request).subscribe(
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
          this.napasTransferFormService.sendApprove(request).subscribe(
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
    this.napasTransferFormService.delete(this.initFormData, () => {
      this.backToSearch();
    });
  }

  onApprove(): void {
    this.napasTransferFormService.approve(
      this.initFormData,
      (res) => {
        this.backToSearch();
      },
      (error, req) => {
        if (ErrorHelper.isTimeoutError(error?.code)) {
          this.napasTransferService
            .getTransactionDetail(this.initFormData.id)
            .subscribe((res) => {
              this.updateForm(res.data);
            });
        }
      }
    );
  }

  onReverse(): void {
    this.napasTransferFormService.reverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onUnReverse(): void {
    this.napasTransferFormService.unReverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onPrintForm(): void {
    this.napasTransferFormService.printForm(this.initFormData.id);
  }

  onPrintDocument(): void {
    this.napasTransferFormService.printDocument(this.initFormData.id);
  }
}
