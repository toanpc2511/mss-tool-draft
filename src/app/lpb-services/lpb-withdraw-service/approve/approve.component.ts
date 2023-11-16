import {
  AfterContentChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  FOOTER_ACTIONS,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES,
} from '../shared/constants/withdraw-common';
import { CHARGE_TYPES } from 'src/app/shared/constants/finance';
import { DOC_TYPES } from 'src/app/shared/constants/identity-certification';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { TextHelper } from 'src/app/shared/utilites/text';
import { WithdrawFormComponent } from '../shared/components/withdraw-form/withdraw-form.component';
import { DENOMINATIONS, WITHDRAW_PRODUCTS } from '../shared/constants/withdraw-common';
import { Withdraw } from '../shared/model/withdraw';
import { WithdrawFormService } from '../shared/services/withdraw-form.service';
import { WithdrawService } from '../shared/services/withdraw.service';
import { ILpbDialog, LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import { isKSV } from 'src/app/shared/utilites/role-check';
import { switchMap, finalize } from 'rxjs/operators'
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { ValidatorHelper, NumberValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import { ApproveRequest } from 'src/app/shared/models/common.interface';
import { ErrorCodes, ErrorHelper } from 'src/app/shared/utilites/error.helper';

declare var $: any;

type HiddenButton = {
  actionCode: string;
  hiddenType: 'disable' | 'none';
};

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnInit, OnDestroy {
  disabledForm = true;

  approveForm: FormGroup;
  noteForm: FormGroup;

  initFormData: Withdraw;
  @ViewChild('withdrawForm') withdrawForm: WithdrawFormComponent;

  role: 'KSV' | 'GDV' = 'GDV';
  userInfo: any;
  TRANS_STATUS_CODES = TRANS_STATUS_CODES;
  hiddenButtons: HiddenButton[] = [];

  isEditMode = false;
  status: { name: string; color: string } = null;
  showApproveInfoStatusCodes = [
    TRANS_STATUS_CODES.APPROVE,
    TRANS_STATUS_CODES.APPROVE_REVERT,
    TRANS_STATUS_CODES.REJECT,
  ]

  draftRevertStatus = [
    TRANS_STATUS_CODES.WAIT_APPROVE,
    TRANS_STATUS_CODES.WAIT_MODIFY,
  ];

  actions: ActionModel[] = [
    {
      actionIcon: 'keyboard_backspace',
      actionName: 'Quay lại',
      actionClick: () => this.backToSearch(),
    },
  ];

  approveRetry = 0;
  isTimeout = false;
  userLimit = null;

  constructor(
    private fb: FormBuilder,
    private withdrawService: WithdrawService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customNotificationService: CustomNotificationService,
    public dialogService: LpbDialogService,
    private dialog: MatDialog,
    private withdrawFormService: WithdrawFormService,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.role = isKSV() ? 'KSV' : 'GDV';
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['transId'];
      this.isEditMode = Boolean(params['status'] === 'open');
      this.disabledForm = true;

      this.withdrawService
        .getTransactionDetail(id)
        .pipe(
          switchMap((res) => {
            if (
              this.isEditMode &&
              this.draftRevertStatus.includes(res.data.status)
            ) {
              const req: ApproveRequest = {
                id: res.data.id,
                version: res.data.version,
              };
              return this.withdrawService.revertToDraft(req);
            } else return of(res);
          })
        )
        .subscribe(
          (res) => {
            if (res && res.data) {
              if(!isKSV()){
                this.updateForm(res.data);
                this.parseDataToForm(res.data);
                return;
              }

              this.withdrawService
                .getLimit()
                .pipe(
                  finalize(() => {
                    this.updateForm(res.data);
                    this.parseDataToForm(res.data);
                  })
                )
                .subscribe((res) => {
                  this.userLimit = res.data;
                });
            }
          },
          (error) => {
            this.handleError(error);
            this.backToSearch();
          }
        );
    });
  }

  checkPermission(data: Withdraw): void {
    const hiddenButtons = this.getHiddenButtons(data);
    const isEditDisallowed = hiddenButtons.find(
      (button) => button.actionCode === FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT
    );

    if (this.isEditMode && isEditDisallowed) {
      this.router.navigate(['/permission-denied']);
    }

    const isHOUser = this.userInfo.branchCode === '001';
    if (this.role === 'GDV') {
      const isCreator = data.createdBy === this.userInfo.userName;
      if (!isHOUser && !isCreator) {
        this.router.navigate(['/permission-denied']);
      }
    }
    // KSV
    else {
      if (this.isEditMode) {
        this.router.navigate(['/permission-denied']);
      }
      const isSameBranch = data.branchCode === this.userInfo.branchCode;
      if (!isHOUser && !isSameBranch) {
        this.router.navigate(['/permission-denied']);
      }
    }
  }

  updateHiddenButtons(data?: Withdraw): void {
    this.hiddenButtons = this.getHiddenButtons(data ? data : this.initFormData);

    const approveCode = FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE;
    if (
      !this.hiddenButtons.some((button) => button.actionCode === approveCode) &&
      data.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      this.hiddenButtons = [
        ...this.hiddenButtons,
        {
          actionCode: FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE,
          hiddenType: 'disable',
        },
      ];
    }
  }

  getHiddenButtons(record: Withdraw): HiddenButton[] {
    let newHiddenButtons: HiddenButton[] = [];
    const approveDate = new Date(record?.approveDate).toDateString();
    const crrDate = new Date().toDateString();
    const isHOUser = this.userInfo.branchCode === '001';

    const hiddenFooterAction: string[] = FOOTER_ACTIONS.filter(
      (footerAction) => {
        const check1 =
          !footerAction.enableStatus.includes(record.status) &&
          footerAction.enableStatus.length !== 0;

        const formStatus = this.disabledForm ? 'disabled' : 'enabled';
        const check2 =
          footerAction.activeWhen.length === 1 &&
          formStatus !== footerAction.activeWhen[0];

        const checkReverse =
          footerAction.code === FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE &&
          approveDate !== crrDate;

        const checkHO = isHOUser && record.branchCode !== '001';

        return check1 || check2 || checkReverse || checkHO;
      }
    ).map((act) => act.code);

    newHiddenButtons = hiddenFooterAction.map(
      (footerAction): HiddenButton => ({
        actionCode: footerAction,
        hiddenType: 'disable',
      })
    );
    return newHiddenButtons;
  }

  ngOnInit(): void {
    this.dialogService.setDialog(this.dialog);
    $('.parentName').html('Rút tiền');
    if (this.role === 'KSV') {
      $('.childName').html('Duyệt yêu cầu rút tiền');
    } else {
      $('.childName').html('Chi tiết yêu cầu rút tiền');
    }
    this.initForm();
  }

  openLimitPopup() {
    const dialogParams: ILpbDialog = {
      title: `Thông báo`,
      messages: ['Số tiền giao dịch vượt quá hạn mức cho phép phê duyệt'],
      buttons: {
        confirm: { display: true, label: 'Quay lại' },
        dismiss: { display: false },
      },
    };

    this.dialogService.openDialog(dialogParams, () => {});
  }

  updateForm(data: Withdraw, disabled: boolean = true) {
    this.checkPermission(data);

    if (
      data.transactionAmount > this.userLimit &&
      typeof this.userLimit === 'number'
    ) {
      this.openLimitPopup();
    }

    this.disabledForm = disabled;
    this.updateHiddenButtons(data);
    if (disabled) {
      this.withdrawForm.disableForm();
    } else {
      this.withdrawForm.enableForm();
    }

    this.status = TRANSACTION_STATUSES.find(
      (stat) => stat.code === data?.status
    );
    this.initFormData = data;

    if(!this.showApproveInfoStatusCodes.includes(data.status)){
      this.initFormData.approveBy = null;
      this.initFormData.approveDate = null;
      this.initFormData.approveRevertBy = null;
      this.initFormData.approveRevertDate = null;
    }

  }

  parseDataToForm(data: Withdraw) {
    const feeJSON = JSON.parse(this.initFormData.feeJson);
    const fees = feeJSON;
    const receiptJson = JSON.parse(this.initFormData.receiptJson);
    const receiptTotal = receiptJson.total;

    let totalWithdrawAmount = data.transactionAmount;
    let fee = Number(fees.vnAmount,);
    let vat = Number(fees.vnVAT);

    if (data.curCode !== 'VND') {
      fee = Number(fees.exchangeAmount);
      vat = Number(fees.exchangeVAT);
    }
    if (data.feeType === CHARGE_TYPES.INCLUDING) {
      totalWithdrawAmount -= fee + vat;
    }

    const patchValueData = {
      ...this.initFormData,
      fee: fees.vnAmount,
      feeVAT: fees.vnVAT,
      feeEx: fees.exchangeAmount,
      feeVATEx: fees.exchangeVAT,
      moneyListSum: receiptTotal === '' ? null : receiptTotal,
      totalWithdrawAmount
    };
    this.approveForm.patchValue(patchValueData);

    const moneyListFormArr = this.approveForm.get('moneyList') as FormArray;
    moneyListFormArr.clear();

    let initMoneyList = [];
    if (Object.keys(DENOMINATIONS).includes(this.initFormData.curCode)) {
      let denoArr: number[] = DENOMINATIONS[this.initFormData.curCode];
      denoArr = denoArr.sort((a, b) => b - a);
      denoArr.forEach((denomination) => {
        const row = receiptJson.receipts.find(
          (rec) => rec.denomination === denomination
        );
        const quantity = row ? row.quantity : null;
        initMoneyList.push({ denomination, quantity });
      });
      this.withdrawForm.isAddMoneyList = false;
    } else {
      initMoneyList = receiptJson.receipts;
    }
    initMoneyList = initMoneyList.map((data) => {
      let total = data.quantity * data.denomination;
      if (!(data.quantity && data.denomination)) {
        total = null;
      }
      return { ...data, total };
    });

    initMoneyList.forEach((till) => {
      const formGroup = this.withdrawForm.createMoneyForm(till);
      formGroup.disable({ emitEvent: false });
      moneyListFormArr.push(formGroup);
    });
    this.withdrawForm.crrMoneyListCurCode = this.approveForm.get('curCode').value;

    this.withdrawForm.setDocIssueDate(
      this.initFormData.negotiatorDocIssueDate
    );
    this.withdrawForm.getCustomerInfo(
      'cifNo',
      this.initFormData.cifNo,
      (data) => {
        const accounts = data[0].accounts;
        const crrAcc = accounts.find(
          (acc) => acc.acn === this.initFormData.acn
        );
       this.withdrawForm.loadAccountInfo(crrAcc);

        this.withdrawForm.getFeeAndVAT(() => {
          if (this.initFormData.feeType === CHARGE_TYPES.FREE) {
            this.withdrawForm.updateFee();
          }

          if (this.isEditMode) {
            this.disabledForm = false;
            this.withdrawForm.enableForm();
            this.updateHiddenButtons();
          }
        });
      },
      (error) => {
        this.approveForm.patchValue(patchValueData, {emitEvent: false});
        this.withdrawForm.setDocIssueDate(this.initFormData.negotiatorDocIssueDate);
      }
    );
    this.withdrawForm.getBranchInfo(this.initFormData.accountBranchCode);
    this.withdrawForm.getEmployeeInfo(this.initFormData.employeeId, true);
    this.withdrawForm.crrProduct = WITHDRAW_PRODUCTS.find(
      (product) => product.code === this.initFormData.productCode.trim()
    );
    this.withdrawForm.updateFeeTypeDisabled(this.withdrawForm.crrProduct);

    if (
      this.initFormData.status === TRANS_STATUS_CODES.REJECT ||
      this.initFormData.status === TRANS_STATUS_CODES.APPROVE ||
      this.initFormData.status === TRANS_STATUS_CODES.WAIT_MODIFY ||
      this.initFormData.status === TRANS_STATUS_CODES.APPROVE_REVERT
    ) {
      this.openNotePopup();
    }
  }

  initForm(): void {
    this.approveForm = this.fb.group({
      transactionCode: [null],
      productCode: [null, [Validators.required]],
      cifNo: [null, [ValidatorHelper.required]],
      acn: [null, [ValidatorHelper.required]],
      accountBranchCode: [{ value: null, disabled: true }],
      accountName: [{ value: null, disabled: true }],
      customerName: [{ value: null, disabled: true }],
      docNum: [null, [ValidatorHelper.required]],
      docType: [{ value: DOC_TYPES.CCCD, disabled: true }],
      docIssueDate: [{ value: null, disabled: true }],
      curCode: [{ value: null, disabled: true }],
      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      employeeId: [null],
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      totalWithdrawAmount: [{ value: null, disabled: true }], // Tổng số tiền chi
      feeType: [CHARGE_TYPES.FREE],
      fee: [0],
      feeVAT: [0],
      feeEx: [0],
      feeVATEx: [0],
      availableBalance: [null],

      negotiatorFullName: [null, [ValidatorHelper.required]],
      negotiatorDocNum: [null, [ValidatorHelper.required]],
      negotiatorDocType: [null, [Validators.required]],

      negotiatorPhone: [null, [ValidatorHelper.required]],
      negotiatorAddress: [null, [ValidatorHelper.required]],
      negotiatorDocIssueDate: [null, [ValidatorHelper.required]],
      negotiatorDocIssuePlace: [null, [ValidatorHelper.required]],
      note: [null, [ValidatorHelper.required]],

      moneyList: this.fb.array([]),
      moneyListSum: [null],
    });
    this.withdrawFormService.setForm(this.approveForm);
    this.approveForm.disable();
  }

  backToSearch(): void {
    this.router.navigate(['../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  handleAfterSubmit(data: Withdraw) {
    if (!this.isEditMode) {
      this.updateForm(data);
    } else {
      this.navigateToDetail(data.id);
    }
  }

  navigateToDetail(transId: string): void {
    const url = window.location.href;
    const newUrl = new URL(url).pathname;
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([newUrl], { queryParams: { transId } }));
  }

  onSave(): void {
    if (!this.withdrawForm.validateForm()) {
      return;
    }

    this.withdrawFormService.checkAccountRelation(() => {
      this.withdrawFormService.validateMoney(() => {
        this.saveWithdraw({
          successMsg: 'Lưu thành công',
        });
      });
    });
  }

  openApproveDialog(): void {
    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Xác nhận gửi duyệt',
      buttons: {},
    };

    dialogParams.messages = [
      'Bạn có chắc chắn muốn gửi duyệt giao dịch?',
      `Số tài khoản: ${this.approveForm.get('acn').value}.`,
    ];
    dialogParams.buttons = {
      confirm: { display: true },
      dismiss: { display: true },
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.saveWithdraw({
        callback: (data) => {
          this.initFormData = data;
          this.sendWithdrawApprove('Gửi duyệt thành công');
        },
      });
    });
  }

  onSendApprove(): void {
    if (!this.withdrawForm.validateForm()) {
      return;
    }

    this.withdrawFormService.checkAccountRelation(() => {
      this.withdrawFormService.validateMoney(() => {
        this.openApproveDialog();
      });
    })
  }

  saveWithdraw({
    successMsg,
    callback,
  }: {
    successMsg?: string;
    callback?: (data: Withdraw) => void;
  }): void {
    const frmValues = this.approveForm.getRawValue();
    const isFree = frmValues.feeType === CHARGE_TYPES.FREE;
    const feeJSON = {
      exchangeAmount: isFree ? 0 : Number(frmValues.feeEx),
      exchangeVAT: isFree ? 0 : Number(frmValues.feeVATEx),
      vnAmount: isFree ? 0 : Number(frmValues.fee),
      vnVAT: isFree ? 0 : Number(frmValues.feeVAT),
    };
    const receiptJson: { total: number | string; receipts: any[] } = {
      total: 0,
      receipts: [],
    };
    frmValues.moneyList.forEach((till) => {
      receiptJson.total = Number(receiptJson.total) + Number(till.total);
      const { quantity, denomination, total } = till;
      if (quantity && denomination) {
        receiptJson.receipts.push({ quantity, denomination, amount: total });
      }
    });
    receiptJson.total = this.withdrawFormService.isMoneyListEmpty() ? '' : receiptJson.total;

    const negotiatorAddress = TextHelper.latinNormalize(
      frmValues.negotiatorAddress?.trim()?.toUpperCase()
    );
    const note = TextHelper.latinNormalize(
      frmValues.note?.trim()?.toUpperCase()
    );
    const negotiatorFullName = TextHelper.latinNormalize(
      frmValues.negotiatorFullName?.trim()?.toUpperCase()
    );

    const request: Withdraw = {
      id: this.initFormData.id,
      accountBranchCode: frmValues.accountBranchCode?.trim(),
      acn: frmValues.acn?.trim(),
      branchCode: this.userInfo.branchCode?.trim(),
      cifNo: frmValues.cifNo?.trim(),
      accountName: frmValues.accountName?.trim(),
      customerName: frmValues.customerName,
      curCode: frmValues.curCode?.trim(),
      docNum: frmValues.docNum?.trim(),
      docType: frmValues.docType?.trim(),
      employeeId: frmValues.employeeId?.trim(),
      feeJson: JSON.stringify(feeJSON),
      feeType: frmValues.feeType?.trim(),
      negotiatorAddress,
      negotiatorDocNum: frmValues.negotiatorDocNum?.trim(),
      negotiatorDocType: frmValues.negotiatorDocType?.trim(),
      negotiatorFullName,
      negotiatorDocIssueDate: frmValues.negotiatorDocIssueDate?.trim(),
      negotiatorDocIssuePlace: frmValues.negotiatorDocIssuePlace?.trim(),
      negotiatorPhone: frmValues.negotiatorPhone?.trim(),
      note,
      productCode: frmValues.productCode?.trim(),
      receiptJson: JSON.stringify(receiptJson),
      totalAmount: frmValues.totalAmount,
      transactionAmount: frmValues.transactionAmount,
      version: this.initFormData.version,
    };

    this.withdrawService.updateWithdraw(request).subscribe(
      (res) => {
        if (res && res.data) {
          if (callback) {
            callback(res.data);
          } else {
            this.handleAfterSubmit(res.data);
          }
          if (successMsg) {
            this.customNotificationService.success('Thông báo', successMsg);
          }
        }
      },
      (error) => {
        this.handleError(error);
      },
      () => {}
    );
  }

  sendWithdrawApprove(successMsg: string): void {
    this.withdrawService
      .sendApprove(this.initFormData.id, this.initFormData.version)
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success('Thông báo', successMsg);
            this.handleAfterSubmit(res.data);
          }
        },
        (error) => {
          this.handleError(error);
        },
        () => {}
      );
  }

  onEdit(): void {
    if (this.draftRevertStatus.includes(this.initFormData.status)) {
      const req: ApproveRequest = {
        id: this.initFormData.id,
        version: this.initFormData.version,
      };
      this.withdrawService.revertToDraft(req).subscribe(
        (res) => {
          this.updateForm(res.data, false);
        },
        (error) => {
          this.handleError(error);
        }
      );
      return;
    }

    this.disabledForm = false;
    this.withdrawForm.enableForm();
    this.updateHiddenButtons();
  }

  onDelete(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa giao dịch?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.withdrawService.deleteWithdraw(this.initFormData.id).subscribe(
        (res) => {
          if (res) {
            this.customNotificationService.success(
              'Thông báo',
              'Xóa thành công'
            );
            this.backToSearch();
          } else {
            this.handleError();
          }
        },
        (error) => {
          this.handleError(error);
        },
        () => {}
      );
    });
  }

  openNotePopup(): void {
    const dialogParams: ILpbDialog = {
      title: `Nội dung phê duyệt của KSV`,
      messages: [],
      buttons: {
        confirm: { display: true, label: 'Quay lại' },
        dismiss: { display: false },
      },
      form: [
        {
          name: 'note',
          placeholder: 'Nhập nội dung',
          defaultValue: '',
          disabled: true,
          type: CONTROL_TYPES.textarea,
        },
      ],
    };
    if (
      this.initFormData.approveRevertNote &&
      this.initFormData.approveRevertBy
    ) {
      dialogParams.title = `Nội dung phê duyệt Reverse của KSV`;
      dialogParams.form[0].defaultValue = this.initFormData.approveRevertNote;
      this.dialogService.openDialog(dialogParams, () => {});
      return;
    }

    if (this.initFormData.approveNote && this.initFormData.approveBy) {
      dialogParams.form[0].defaultValue = this.initFormData.approveNote;
      this.dialogService.openDialog(dialogParams, () => {});
    }
  }

  onReverse(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có muốn reverse giao dịch?'],
      title: 'Xác nhận reverse',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.sendWithdrawApprove('Gửi duyệt thành công');
    });
  }

  onUnReverse(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có muốn un-reverse giao dịch?'],
      title: 'Xác nhận un-reverse',
    };
    this.dialogService.openDialog(dialogParams, () => {
      const req: ApproveRequest = {
        id: this.initFormData.id,
        version: this.initFormData.version,
      };
      this.withdrawService.rejectWithdraw(req).subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success(
              'Thông báo',
              'Un-reverse thành công'
            );
            this.updateForm(res.data);
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    });
  }

  onApprove(): void {
    const dialogParams: ILpbDialog = {
      title: 'Xác nhận phê duyệt yêu cầu?',
      messages: [
        `Bạn có chắc chắn phê duyệt giao dịch số tài khoản: ${
          this.approveForm.get('acn').value
        }`,
      ],
      buttons: {
        confirm: { display: false },
        dismiss: { display: false },
        customs: [
          {
            type: TRANS_STATUS_CODES.REJECT,
            label: 'Từ chối',
            bgColor: '#f47326',
          },
          {
            type: TRANS_STATUS_CODES.APPROVE,
            label: 'Phê duyệt',
            bgColor: '#23388f',
          },
          {
            type: TRANS_STATUS_CODES.WAIT_MODIFY,
            label: 'Yêu cầu bổ sung',
            bgColor: '#4EC1AD',
          },
        ],
      },
      form: [
        {
          name: 'note',
          placeholder: 'Nhập nội dung',
          defaultValue: null,
          disabled: false,
          type: CONTROL_TYPES.textarea,
          maxlength: 255,
        },
      ],
    };

    if (this.initFormData.status === TRANS_STATUS_CODES.WAIT_REVERT) {
      dialogParams.buttons.customs = dialogParams.buttons.customs.filter(
        (button) => button.type !== TRANS_STATUS_CODES.WAIT_MODIFY
      );
    }

    const suspiciousCodes = [
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT
    ]

    if (suspiciousCodes.includes(this.initFormData.status)) {
      dialogParams.buttons.customs = dialogParams.buttons.customs.filter(
        (button) =>
          button.type !== TRANS_STATUS_CODES.WAIT_MODIFY &&
          button.type !== TRANS_STATUS_CODES.REJECT
      );
    }

    this.dialogService.openDialog(dialogParams, (result) => {
      const note = result?.value?.note?.trim();
      const req: ApproveRequest = {
        id: this.initFormData.id,
        note,
        version: this.initFormData.version,
      };

      switch (result?.type) {
        case TRANS_STATUS_CODES.APPROVE: {
          this.approveRetry = 0;
          this.handleApprove(req);
          break;
        }
        case TRANS_STATUS_CODES.REJECT: {
          this.withdrawService.rejectWithdraw(req).subscribe(
            (res) => {
              this.customNotificationService.success('Thông báo', 'Từ chối thành công');
              this.updateForm(res.data);
            },
            (error) => {
              this.handleError(error);
            }
          );
          break;
        }
        case TRANS_STATUS_CODES.WAIT_MODIFY: {
          this.withdrawService.sendModifyRequest(req).subscribe(
            (res) => {
              this.customNotificationService.success('Thông báo', 'Yêu cầu bổ sung thành công');
              this.updateForm(res.data);
            },
            (error) => {
              this.handleError(error);
            }
          )
          break;
        }
      }
    });
  }

  handleApprove(req: ApproveRequest) {
    this.withdrawService.approveWithdraw(req).subscribe(
      (res) => {
        this.customNotificationService.success('Thông báo', 'Duyệt thành công');
        this.updateForm(res.data);
      },
      (error) => {
        const suffix = error?.code?.split('-').pop();
        switch (suffix) {
          case ErrorCodes.TIME_OUT: {
            if(this.approveRetry < 3){
              this.approveRetry += 1;
              this.retryApprove(req);
              return;
            }

            const dialogParams: ILpbDialog = {
              title: 'Thông báo',
              messages: [error?.message],
              buttons: {
                confirm: { display: false },
                dismiss: { display: true, label: 'Đóng' },
              },
            };

            this.dialogService.openDialog(dialogParams, () => {});
            break;
          }

          case ErrorCodes.VERSION: {
            if (this.isTimeout) {
              this.retryApprove(req);
            } else {
              this.handleError(error);
            }
            break;
          }

          default: {
            this.handleError(error);
          }
        }
      }
    );
  }

  retryApprove(req: ApproveRequest){
    this.withdrawService.getTransactionDetail(req.id).subscribe(
      (res) => {
        this.updateForm(res.data);
        const retryReq: ApproveRequest = {
          ...req,
          version: res.data.version,
        };

        this.handleApprove(retryReq);
      },
      (error) => {
        this.handleError(error);
        return;
      }
    );
  }

  handleError(error?: any): void {
    const message = error?.message
      ? error?.message
      : 'Có lỗi xảy ra xin vui lòng thử lại';
    if (ErrorHelper.isVersionError(error?.code)) {
      const dialogParams: ILpbDialog = {
        title: 'Thông báo',
        messages: [
          'Bản ghi dữ liệu chưa phải mới nhất, vui lòng thực hiện lại!',
        ],
        buttons: {
          confirm: { display: true, label: 'Tải lại' },
          dismiss: { display: false },
        },
      };

      this.dialogService.openDialog(dialogParams, () => {
        window.location.reload();
      });
    } else {
      this.customNotificationService.error('Thông báo', message);
    }
  }

  onPrintForm(): void {
    const dialogParams: ILpbDialog = {
      title: 'Chọn biểu mẫu',
      messages: [],
      buttons: {
        confirm: { display: true },
        dismiss: { display: true },
      },
      form: [
        {
          name: 'isLogo',
          defaultValue: 'true',
          disabled: false,
          type: CONTROL_TYPES.radio,
          group: [
            {
              label: 'In có logo',
              value: 'true',
            },
            {
              label: 'In không có logo',
              value: 'false',
            },
          ],
        },
      ],
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      const isLogo = result?.value.isLogo;

      this.withdrawService
        .getPrintedForm(this.initFormData.id, isLogo)
        .subscribe(
          (res) => {
            if (res && res.data) {
              this.showPdfInNewTab(res.data.fileContent, res.data.fileName);
            }
          },
          (error) => {
            this.handleError(error);
          }
        );
    });
  }

  onPrintDocument(): void {
    this.withdrawService.getPrintedDoc(this.initFormData.id).subscribe(
      (res) => {
        if (res && res.data) {
          this.showPdfInNewTab(res.data.fileContent, res.data.fileName);
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.dialogService.closeDialog();
  }

  showPdfInNewTab(base64Data, fileName = 'My file'): void {
    FilesHelper.openPdfFromBase64(base64Data, () => {
      this.handleError();
    });
  }
}
