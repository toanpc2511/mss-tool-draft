import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { switchMap, finalize } from 'rxjs/operators';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import {
  FOOTER_BUTTON_CODE
} from 'src/app/shared/constants/constants';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { isKSV } from 'src/app/shared/utilites/role-check';
import { TextHelper } from 'src/app/shared/utilites/text';
import { NumberValidatorHelper, ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import { CurrentAccFormPrintComponent } from '../shared/components/current-acc-form-print/current-acc-form-print.component';
import { DepositFormComponent } from '../shared/components/deposit-form/deposit-form.component';
import {
  CHARGE_TYPES,
  CURRENCIES,
  DENOMINATIONS,
  DEPOSIT_PRODUCTS,
  DOC_TYPES,
  FOOTER_ACTIONS,
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES
} from '../shared/constants/deposit-common';
import { Deposit, DepositApproveRequest } from '../shared/models/deposit';
import { DepositService } from '../shared/services/deposit.service';
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

  initFormData: Deposit;
  @ViewChild('depositForm') depositForm: DepositFormComponent;

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
  ];

  draftRevertStatus = [
    TRANS_STATUS_CODES.WAIT_APPROVE,
    TRANS_STATUS_CODES.WAIT_MODIFY,
  ];

  currentAccPrintForm: FormGroup;

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
    private depositService: DepositService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customNotificationService: CustomNotificationService,
    public dialogService: LpbDialogService,
    private dialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.role = isKSV() ? 'KSV' : 'GDV';
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['transId'];
      this.isEditMode = Boolean(params['status'] === 'open');
      this.disabledForm = true;

      this.depositService
        .getTransactionDetail(id)
        .pipe(
          switchMap((res) => {
            if (
              this.isEditMode &&
              this.draftRevertStatus.includes(res.data.status)
            ) {
              const req: DepositApproveRequest = {
                id: res.data.id,
                version: res.data.version,
              };
              return this.depositService.revertToDraft(req);
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

              this.depositService
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

  checkPermission(data: Deposit): void {
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

  updateHiddenButtons(data?: Deposit): void {
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

  getHiddenButtons(record: Deposit): HiddenButton[] {
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
    $('.parentName').html('Nộp tiền');
    if (this.role === 'KSV') {
      $('.childName').html('Duyệt yêu cầu nộp tiền');
    } else {
      $('.childName').html('Chi tiết yêu cầu nộp tiền');
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

  updateForm(data: Deposit, disabled: boolean = true) {
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
      this.depositForm.disableForm();
    } else {
      this.depositForm.enableForm();
    }

    this.status = TRANSACTION_STATUSES.find(
      (stat) => stat.code === data?.status
    );
    this.initFormData = data;

    if (!this.showApproveInfoStatusCodes.includes(data.status)) {
      this.initFormData.approveBy = null;
      this.initFormData.approveDate = null;
      this.initFormData.approveRevertBy = null;
      this.initFormData.approveRevertDate = null;
    }
  }

  parseDataToForm(data: Deposit) {
    const feeJSON = JSON.parse(this.initFormData.feeJson);
    const fees = feeJSON;
    const receiptJson = JSON.parse(this.initFormData.receiptJson);
    const receiptTotal = receiptJson.total;

    const patchValueData = {
      ...this.initFormData,
      fee: fees.vnAmount,
      feeVAT: fees.vnVAT,
      feeEx: fees.exchangeAmount,
      feeVATEx: fees.exchangeVAT,
      moneyListSum: receiptTotal === '' ? null : receiptTotal,
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
      this.depositForm.isAddMoneyList = false;
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
      const formGroup = this.depositForm.createMoneyForm(till);
      formGroup.disable({ emitEvent: false });
      moneyListFormArr.push(formGroup);
    });
    this.depositForm.crrMoneyListCurCode =
      this.approveForm.get('curCode').value;

    this.depositForm.setDocIssueDate(this.initFormData.docIssueDate);
    this.depositForm.getCustomerInfo(
      'cifNo',
      this.initFormData.cifNo,
      (data) => {
        const accounts = data[0].accounts;
        const crrAcc = accounts.find(
          (acc) => acc.acn === this.initFormData.acn
        );
        this.depositForm.loadAccountInfo(crrAcc);

        this.depositForm.getFeeAndVAT(() => {
          if (this.initFormData.feeType === CHARGE_TYPES.FREE) {
            this.depositForm.updateFee();
          }

          if (this.isEditMode) {
            this.disabledForm = false;
            this.depositForm.enableForm();
            this.updateHiddenButtons();
          }
        });
      },
      (error) => {
        this.approveForm.patchValue(patchValueData, {emitEvent: false});
        this.depositForm.setDocIssueDate(this.initFormData.docIssueDate);
      }
    );
    this.depositForm.getBranchInfo(this.initFormData.accountBranchCode);
    this.depositForm.getEmployeeInfo(this.initFormData.employeeId, true);
    this.depositForm.crrProduct = DEPOSIT_PRODUCTS.find(
      (product) => product.code === this.initFormData.productCode.trim()
    );

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
      productCode: [null, [Validators.required]],
      cifNo: [null, [ValidatorHelper.required]],
      acn: [null, [ValidatorHelper.required]],
      accountBranchCode: [{ value: null, disabled: true }],
      accountName: [{ value: null, disabled: true }],
      customerName: [{ value: null, disabled: true }],
      docNum: [null, [ValidatorHelper.required]],
      docType: [{ value: DOC_TYPES.CCCD, disabled: true }],
      docIssueDate: [{ value: null, disabled: true }],
      docIssuePlace: [{ value: null, disabled: true }],
      curCode: [{ value: null, disabled: true }],
      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      employeeId: [null],
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      feeType: [CHARGE_TYPES.FREE],
      fee: [0],
      feeVAT: [0],
      feeEx: [0],
      feeVATEx: [0],
      // currentBalance: [null],

      negotiatorFullName: [null, [ValidatorHelper.required]],
      negotiatorDocNum: [null, [ValidatorHelper.required]],
      negotiatorDocType: [null, [Validators.required]],

      negotiatorPhone: [null, [ValidatorHelper.required]],
      negotiatorAddress: [null, [ValidatorHelper.required]],
      note: [null, [ValidatorHelper.required]],

      moneyList: this.fb.array([]),
      moneyListSum: [null],
    });
    this.approveForm.disable();

    this.currentAccPrintForm = this.fb.group({
      transId: [null],
      customerName: [null, [ValidatorHelper.required]],
      acn: [null, [ValidatorHelper.required]],
      docNum: [null, [ValidatorHelper.required]],
      docIssuePlace: [null, [ValidatorHelper.required]],
      docIssueDate: [
        null,
        [
          ValidatorHelper.required,
          ValidatorHelper.dateFormat('DD/MM/YYYY', { maxDate: new Date() }),
        ],
      ],
      withBank: [null, [ValidatorHelper.required]],
      branchName: [null, [ValidatorHelper.required]],
      branchCityName: [null, [ValidatorHelper.required]],
      version: [null],
    });
  }

  backToSearch(): void {
    this.router.navigate(['../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  isMoneyListEmpty(): boolean {
    const frmValues = this.approveForm.getRawValue();
    const emptyRows = frmValues.moneyList.filter(
      (row) => row.quantity === null
    );
    return emptyRows?.length === frmValues.moneyList?.length;
  }

  handleAfterSubmit(data: Deposit) {
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
    const frmValue = this.approveForm.getRawValue();
    if (!this.depositForm.validateForm()) {
      return;
    }

    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {},
    };

    const handleSave = () => {
      this.saveDeposit({
        successMsg: 'Lưu thành công',
      });
    };

    if (frmValue.curCode !== CURRENCIES.VND) {
      handleSave();
      return;
    }

    if (frmValue.curCode === CURRENCIES.VND && this.isMoneyListEmpty()) {
      handleSave();
      return;
    }

    const diff = Math.abs(frmValue.moneyListSum - frmValue.totalAmount);
    if (diff === 0) {
      handleSave();
      return;
    }

    if (diff >= 100) {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch hơn 100 VND.',
      ];
      dialogParams.buttons = {
        dismiss: { display: true },
        confirm: { display: false },
      };

      this.dialogService.openDialog(dialogParams, () => {});
    }
    //
    else {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch nhỏ hơn 100 VND.',
      ];
      dialogParams.buttons = {
        confirm: { display: true },
        dismiss: { display: true },
      };
      this.dialogService.openDialog(dialogParams, () => {
        handleSave();
      });
    }
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
      if (!this.disabledForm) {
        this.saveDeposit({
          callback: (data) => {
            this.initFormData = data;
            this.sendDepositApprove('Gửi duyệt thành công');
          },
        });
      } else {
        this.sendDepositApprove('Gửi duyệt thành công');
      }
    });
  }

  onSendApprove(): void {
    if (!this.depositForm.validateForm()) {
      return;
    }
    const frmValue = this.approveForm.getRawValue();
    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {},
    };

    if (frmValue.curCode !== CURRENCIES.VND) {
      this.openApproveDialog();
      return;
    }

    if (frmValue.curCode === CURRENCIES.VND && this.isMoneyListEmpty()) {
      this.openApproveDialog();
      return;
    }

    const diff = Math.abs(frmValue.moneyListSum - frmValue.totalAmount);
    if (diff === 0) {
      this.openApproveDialog();
      return;
    }

    if (diff >= 100) {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch hơn 100 VND.',
      ];
      dialogParams.buttons = {
        dismiss: { display: true },
        confirm: { display: false },
      };
      this.dialogService.openDialog(dialogParams, () => {});
    }
    //
    else {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch nhỏ hơn 100 VND.',
      ];
      dialogParams.buttons = {
        confirm: { display: true },
        dismiss: { display: true },
      };

      this.dialogService.openDialog(dialogParams, () => {
        this.openApproveDialog();
      });
    }
  }

  saveDeposit({
    successMsg,
    callback,
  }: {
    successMsg?: string;
    callback?: (data: Deposit) => void;
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
    receiptJson.total = this.isMoneyListEmpty() ? '' : receiptJson.total;

    const negotiatorAddress = TextHelper.latinNormalize(
      frmValues.negotiatorAddress?.trim()?.toUpperCase()
    );
    const note = TextHelper.latinNormalize(
      frmValues.note?.trim()?.toUpperCase()
    );
    const negotiatorFullName = TextHelper.latinNormalize(
      frmValues.negotiatorFullName?.trim()?.toUpperCase()
    );

    const request: Deposit = {
      id: this.initFormData.id,
      accountBranchCode: frmValues.accountBranchCode?.trim(),
      acn: frmValues.acn?.trim(),
      branchCode: this.userInfo.branchCode?.trim(),
      cifNo: frmValues.cifNo?.trim(),
      accountName: frmValues.accountName?.trim(),
      customerName: frmValues.customerName,
      curCode: frmValues.curCode?.trim(),
      docIssueDate: frmValues.docIssueDate?.trim(),
      docIssuePlace: frmValues.docIssuePlace?.trim(),
      docNum: frmValues.docNum?.trim(),
      docType: frmValues.docType?.trim(),
      employeeId: frmValues.employeeId?.trim(),
      feeJson: JSON.stringify(feeJSON),
      feeType: frmValues.feeType?.trim(),
      negotiatorAddress,
      negotiatorDocNum: frmValues.negotiatorDocNum?.trim(),
      negotiatorDocType: frmValues.negotiatorDocType?.trim(),
      negotiatorFullName,
      negotiatorPhone: frmValues.negotiatorPhone?.trim(),
      note,
      productCode: frmValues.productCode?.trim(),
      receiptJson: JSON.stringify(receiptJson),
      totalAmount: frmValues.totalAmount,
      transactionAmount: frmValues.transactionAmount,
      version: this.initFormData.version,
    };

    this.depositService.updateDeposit(request).subscribe(
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

  sendDepositApprove(successMsg: string): void {
    this.depositService
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
      const req: DepositApproveRequest = {
        id: this.initFormData.id,
        version: this.initFormData.version,
      };
      this.depositService.revertToDraft(req).subscribe(
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
    this.depositForm.enableForm();
    this.updateHiddenButtons();
  }

  onDelete(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa giao dịch?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.depositService.deleteDeposit(this.initFormData.id).subscribe(
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
      this.sendDepositApprove('Gửi duyệt thành công');
    });
  }

  onUnReverse(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có muốn un-reverse giao dịch?'],
      title: 'Xác nhận un-reverse',
    };
    this.dialogService.openDialog(dialogParams, () => {
      const req: DepositApproveRequest = {
        id: this.initFormData.id,
        version: this.initFormData.version,
      };
      this.depositService.rejectDeposit(req).subscribe(
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
      const req: DepositApproveRequest = {
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
          this.depositService.rejectDeposit(req).subscribe(
            (res) => {
              this.customNotificationService.success(
                'Thông báo',
                'Từ chối thành công'
              );
              this.updateForm(res.data);
            },
            (error) => {
              this.handleError(error);
            }
          );
          break;
        }
        case TRANS_STATUS_CODES.WAIT_MODIFY: {
          this.depositService.sendModifyRequest(req).subscribe(
            (res) => {
              this.customNotificationService.success(
                'Thông báo',
                'Yêu cầu bổ sung thành công'
              );
              this.updateForm(res.data);
            },
            (error) => {
              this.handleError(error);
            }
          );
          break;
        }
      }
    });
  }

  handleApprove(req: DepositApproveRequest) {
    this.depositService.approveDeposit(req).subscribe(
      (res) => {
        this.customNotificationService.success('Thông báo', 'Duyệt thành công');
        this.updateForm(res.data);
      },
      (error) => {
        const suffix = error?.code?.split('-').pop();
        switch (suffix) {
          case ErrorCodes.TIME_OUT: {
            this.isTimeout = true;
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

  retryApprove(req: DepositApproveRequest) {
    this.depositService.getTransactionDetail(req.id).subscribe(
      (res) => {
        this.updateForm(res.data);
        const retryReq: DepositApproveRequest = {
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
          name: 'option',
          defaultValue: 'print_logo',
          disabled: false,
          type: CONTROL_TYPES.radio,
          group: [
            {
              label: 'In có logo',
              value: 'print_logo',
            },
            {
              label: 'In không có logo',
              value: 'print_no_logo',
            },
            {
              label: 'In biểu mẫu nộp tiền vãng lai',
              value: 'print_current_acc',
            },
          ],
        },
      ],
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      const option = result.value?.option;

      switch (option) {
        case 'print_logo':
        case 'print_no_logo': {
          const isLogo = option === 'print_logo' ? 'true' : 'false';
          this.depositService
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
          break;
        }

        case 'print_current_acc': {
          this.currentAccPrintForm
            .get('transId')
            .setValue(this.initFormData.id);

          this.depositService
            .getCurrentInfo(this.currentAccPrintForm.get('transId').value)
            .subscribe(
              (res) => {
                if (res && res.data) {
                  this.currentAccPrintForm.patchValue(res.data);
                  this.openCurrentAccFormPrint();
                }
              },
              (error) => {
                if (ErrorHelper.isNotFoundError(error?.code)) {
                  this.openCurrentAccFormPrint();
                } else {
                  this.customNotificationService.error(
                    'Thông báo',
                    error?.message
                  );
                }
              }
            );
          break;
        }
      }
    });
  }

  openCurrentAccFormPrint() {
    const formDiaglog = this.dialog.open(CurrentAccFormPrintComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '830px',
      data: {
        form: this.currentAccPrintForm,
      },
    });

    formDiaglog.afterClosed().subscribe((result) => {
      if (result?.type === 'dismiss' || !result?.type) {
        return;
      }

      let frmValues = this.currentAccPrintForm.getRawValue();
      frmValues = TextHelper.objectLatinNormalize(frmValues);
      frmValues = FormHelpers.trimValues(frmValues);
      this.depositService.getPrintedCurrentForm(frmValues).subscribe(
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
    this.depositService.getPrintedDoc(this.initFormData.id).subscribe(
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
