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
import { NumberValidatorHelper, ValidatorHelper, viRegStr } from 'src/app/shared/utilites/validators.helper';
import { CitadTransferFormComponent } from '../../shared/components/external-transfer-form/citad-transfer-form/citad-transfer-form.component';
import {
  FEE_TYPES,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES
} from '../../shared/constants/common';
import { RECIPIENT_SEARCH_TYPE } from '../../shared/constants/internal';
import { FooterButtonAction } from '../../shared/interface/common';
import { CitadTransfer } from '../../shared/models/citad';
import { ApproveRequest, CommonTransfer, HiddenButton } from '../../shared/models/common';
import { CitadTransferFormService } from '../../shared/services/citad/citad-transfer-form.service';
import { CitadTransferService } from '../../shared/services/citad/citad-transfer.service';
import { ILpbDialog, LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
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

  initFormData: CitadTransfer;
  @ViewChild('citadForm') citadForm: CitadTransferFormComponent;
  @ViewChild('footer') footer: LpbFooterComponent;

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
    private citadTransferFormService: CitadTransferFormService,
    private internalTransferService: InternalTransferService,
    private citadTransferService: CitadTransferService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customNotificationService: CustomNotificationService
  ) {
    this.citadTransferFormService.reset();
  }

  ngAfterViewInit(): void {
    this.footerButtonActions = this.footer.buttonActions;

    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          const id = params['transId'];
          this.isEditMode = Boolean(params['status'] === 'open');
          this.disabledForm = true;
          return this.citadTransferService.getTransactionDetail(id);
        }),
        finalize(() => {
          this.cdr.detectChanges();
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            if (!isKSV()) {
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
      if (button.actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE)) {
        return { ...button, actionName: 'Xử lý', icon: 'check' };
      }
      return button;
    });
  }

  ngOnInit(): void {
    const breadCrumbList = [
      'Chuyển tiền',
      'Chuyển tiền đi trong nước khác hệ thống qua kênh Citad',
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
      routeCode: [null, [Validators.required]],
      nostroAcn: [{ value: '000000010001', disabled: true }],
      nostroName: [{ value: 'TGTT VND - SGD NHNN VN', disabled: true }],

      senderCifNo: [null, [ValidatorHelper.required]],
      senderAcn: [
        null,
        [ValidatorHelper.required, Validators.minLength(12)],
      ],
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
      recipientAcn: [null, [Validators.required]],
      recipientDocNum: [{ value: '', disabled: true }, [Validators.required]],
      recipientFullName: [null, [ValidatorHelper.required]],
      recipientDocType: [{ value: null, disabled: true }, [Validators.required]],
      recipientDocIssueDate: [
        { value: null, disabled: true },
        [
          ValidatorHelper.required,
          ValidatorHelper.dateFormat('DD/MM/YYYY', { maxDate: new Date() }),
        ],
      ],
      recipientDocIssuePlace: [{ value: null, disabled: true }, [ValidatorHelper.required]],
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

  initData(data: CitadTransfer) {
    if (!this.citadTransferFormService.checkPermission(data, this.isEditMode)) {
      this.router.navigate(['/permission-denied']);
      return;
    }

    this.updateForm(data, true);
    this.citadTransferFormService.patchDataToForm(this.detailForm, data);

    this.citadForm.fetchData().subscribe(() => {
      if (this.isEditMode) {
        this.disabledForm = false;
        this.hiddenButtons = this.getHiddenButtons(
          this.initFormData,
          false
        );
      }

      if (
        this.initFormData.status === TRANS_STATUS_CODES.REJECT ||
        this.initFormData.status === TRANS_STATUS_CODES.APPROVE ||
        this.initFormData.status === TRANS_STATUS_CODES.WAIT_MODIFY ||
        this.initFormData.status === TRANS_STATUS_CODES.APPROVE_REVERT
      ) {
        this.citadTransferFormService.openNotePopup(data);
      }
    })
  }

  updateForm(data: CommonTransfer, disabled: boolean = true) {
    if (
      data.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      this.citadTransferFormService.openLimitPopup();
    }

    this.initFormData = {...data} as CitadTransfer;
    this.detailForm.get('id').setValue(data.id);
    this.detailForm.get('version').setValue(data.version);
    this.status = TRANSACTION_STATUSES.find(
      (stat) => stat.code === this.initFormData?.status
    );

    if(!this.showApproveInfoStatusCodes.includes(data.status)){
      this.initFormData.approveBy = null;
      this.initFormData.approveDate = null;
      this.initFormData.approveRevertBy = null;
      this.initFormData.approveRevertDate = null;
    }

    this.hiddenButtons = this.getHiddenButtons(
      this.initFormData
    );
    this.disabledForm = disabled;
  }

  getHiddenButtons(record: CitadTransfer, disabledForm: boolean = true) {
    const hiddenButtons = this.citadTransferFormService.getHiddenButtons(
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

  handleAfterSubmit(data: CommonTransfer){
    if(!this.isEditMode){
      this.updateForm(data);
    } else {
      this.navigateToDetail(data.id);
    }
  }

  navigateToDetail(transId: string): void {
    this.citadTransferFormService.navigateToDetail(
      {
        transId,
      },
    );
  }

  backToSearch(): void {
    this.citadTransferFormService.backToSearch();
  }

  onEdit() {
    this.disabledForm = false;
    this.hiddenButtons = this.getHiddenButtons(
      this.initFormData,
      false
    );
  }

  onSave(callBack?: (request: ApproveRequest) => void) {
    if (!this.citadForm.validateForm()) {
      return;
    }

    this.citadTransferFormService
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
            }else {
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
    if (!this.citadForm.validateForm() && !this.disabledForm) {
      return;
    }

    this.citadTransferFormService.openSendApproveDialog(
      { acn: this.detailForm.get('senderAcn').value },
      () => {
        if (!this.disabledForm) {
          this.onSave((request) => {
            this.citadTransferFormService.sendApprove(request).subscribe(
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
          this.citadTransferFormService.sendApprove(request).subscribe(
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
    this.citadTransferFormService.delete(this.initFormData, () => {
      this.backToSearch();
    });
  }

  onApprove(): void {
    this.citadTransferFormService.approve(
      this.initFormData,
      () => {
        this.backToSearch();
      },
      (error, req) => {
        if (ErrorHelper.isTimeoutError(error?.code)) {
          this.citadTransferService
            .getTransactionDetail(this.initFormData.id)
            .subscribe((res) => {
              this.updateForm(res.data);
            });
        }
      }
    );
  }

  onReverse(): void {
    this.citadTransferFormService.reverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onUnReverse(): void {
    this.citadTransferFormService.unReverse(this.initFormData, (res) => {
      this.handleAfterSubmit(res.data);
    });
  }

  onPrintForm(): void {
    this.citadTransferFormService.printForm(this.initFormData.id);
  }

  onPrintDocument(): void {
    this.citadTransferFormService.printDocument(this.initFormData.id);
  }
}
