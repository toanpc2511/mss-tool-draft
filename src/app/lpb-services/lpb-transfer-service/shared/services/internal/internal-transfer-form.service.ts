import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CHARGE_TYPES } from 'src/app/shared/constants/finance';
import { ApproveRequest, InternalTransfer, SearchResponseData } from '../../models/internal';
import { FOOTER_ACTIONS, RECIPIENT_SEARCH_TYPE } from '../../constants/internal';
import { TextHelper } from 'src/app/shared/utilites/text';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { InternalTransferService } from './internal-transfer.service';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { MatDialog } from '@angular/material/dialog';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { HiddenButton, TRANS_TYPE } from '../../models/common';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { TRANS_STATUS_CODES } from '../../constants/common';
import { TransferFormService } from '../../interface/common';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { ErrorHelper } from 'src/app/shared/utilites/error.helper';

@Injectable({
  providedIn: 'root',
})
export class InternalTransferFormService implements TransferFormService {
  private commonService: CommonService;
  constructor(
    private customNotificationService: CustomNotificationService,
    private internalTransferService: InternalTransferService,
    private dialog: MatDialog,
    private dialogService: LpbDialogService,
    private router: Router,
  ) {
    this.commonService = new CommonService(
      this.internalTransferService,
      this.customNotificationService,
      this.dialogService,
      this.router
    );
    this.dialogService.setDialog(this.dialog);
  }

  get userInfo(): any{
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  parseFormToRequest(form: FormGroup): InternalTransfer {
    const frmValues = form.getRawValue();
    const isFree = frmValues.feeType === CHARGE_TYPES.FREE;
    const feeJSON = {
      exchangeAmount: isFree ? 0 : Number(frmValues.feeEx),
      exchangeVAT: isFree ? 0 : Number(frmValues.feeVATEx),
      vnAmount: isFree ? 0 : Number(frmValues.fee),
      vnVAT: isFree ? 0 : Number(frmValues.feeVAT),
    };

    let request: InternalTransfer = {
      acn: frmValues.senderAcn,
      branchCode: this.userInfo.branchCode?.trim(),
      cifNo: frmValues.senderCifNo,
      accountBranchCode: frmValues.senderAccountBranchCode,
      curCode: frmValues.senderCurCode,
      productCode: frmValues.productCode,
      feeJson: JSON.stringify(feeJSON),
      note: frmValues.note,
      feeType: frmValues.feeType,
      totalAmount: frmValues.totalAmount,
      transactionAmount: frmValues.transactionAmount,
      customerName: frmValues.senderName,
      address: frmValues.senderAddress,
      recipientCif: frmValues.recipientCif,
      accountName: frmValues.senderAccountName,
      employeeId: frmValues.employeeId
    };

    const recipientSearchType = frmValues.recipientSearchType;

    if (recipientSearchType === RECIPIENT_SEARCH_TYPE.ACN) {
      request = {
        ...request,
        recipientAcn: frmValues.recipientAcn,
        recipientAccountName: frmValues.recipientAccountName,
        recipientBranchCode: frmValues.recipientAccountBranchCode,
        recipientFullName: frmValues.recipientFullNameACN,
        recipientDocIssueDate: '',
        recipientDocIssuePlace: '',
        recipientDocNum: '',
        recipientDocType: '',
      };
    } else {
      request = {
        ...request,
        recipientDocIssueDate: frmValues.recipientDocIssueDate,
        recipientDocIssuePlace: frmValues.recipientDocIssuePlace,
        recipientDocNum: frmValues.recipientDocNum,
        recipientDocType: frmValues.recipientDocType,
        recipientAcn: frmValues.recipientCurrentAcn,
        recipientAccountName: frmValues.recipientCurrentAcnName,
        recipientBranchCode: frmValues.recipientCurrentAcnBranchCode,
        recipientFullName: frmValues.recipientFullNameGTXM,
      };
    }

    Object.keys(request).forEach((key) => {
      if (
        typeof request[key] === 'string' &&
        request[key] &&
        key !== 'feeJson'
      ) {
        request[key] = TextHelper.latinNormalize(request[key]).toUpperCase();
      }
    });

    return request;
  }

  patchDataToForm(form: FormGroup, data: InternalTransfer) {
    const fees = JSON.parse(data.feeJson);

    let patchValueData: any = {
      ...data,
      fee: fees.vnAmount,
      feeVAT: fees.vnVAT,
      feeEx: fees.exchangeAmount,
      feeVATEx: fees.exchangeVAT,
      senderAcn: data.acn,
      senderCifNo: data.cifNo,
      senderAccountBranchCode: data.accountBranchCode,
      senderCurCode: data.curCode,
      senderName: data.customerName,
      senderAddress: data.address,
      recipientCif: data.recipientCif
    };

    if (!data.recipientDocNum) {
      patchValueData = {
        ...patchValueData,
        recipientAcn: data.recipientAcn,
        recipientAccountBranchCode: data.recipientBranchCode,
        recipientCurCode: data.curCode,
        recipientSearchType: RECIPIENT_SEARCH_TYPE.ACN,
        recipientFullNameACN: data.recipientFullName,
      };
    } else {
      patchValueData = {
        ...patchValueData,
        recipientAcn: null,
        recipientDocIssueDate: data.recipientDocIssueDate,
        recipientDocIssuePlace: data.recipientDocIssuePlace,
        recipientDocNum: data.recipientDocNum,
        recipientDocType: data.recipientDocType,
        recipientCurrentAcn: data.recipientAcn,
        recipientCurrentAcnBranchCode: data.recipientBranchCode,
        recipientSearchType: RECIPIENT_SEARCH_TYPE.GTXM,
        recipientFullNameGTXM: data.recipientFullName,
      };
    }

    form.patchValue(patchValueData);
  }

  saveTransfer(
    form: FormGroup,
    type: 'CREATE' | 'UPDATE'
  ): Observable<DataResponse<InternalTransfer>> {
    const request = this.parseFormToRequest(form);
    const frmValues = form.getRawValue();

    let apiCall: Observable<DataResponse<InternalTransfer>>;
    if (type === 'UPDATE') {
      request.version = frmValues.version;
      request.id = frmValues.id;
      apiCall = this.internalTransferService.updateTransfer(request);
    } else {
      apiCall = this.internalTransferService.createTransfer(request);
    }

    return new Observable<DataResponse<InternalTransfer>>((observer) => {
      apiCall.subscribe(
        (res) => {
          observer.next(res);
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
          observer.error(error);
        }
      );
    });
  }

  sendApprove(request: ApproveRequest): Observable<DataResponse<InternalTransfer>> {
    return new Observable<any>((observer) => {
      this.internalTransferService.sendApprove(request).subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success(
              'Thông báo',
              'Gửi duyệt thành công'
            );
            observer.next(res);
          }
        },
        (error) => {
          this.customNotificationService.error('Thông báo', error?.message);
          observer.error(error);
        },
        () => {}
      );
    });
  }

  openSendApproveDialog(data: { acn: string }, onAccept: () => void) {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận gửi duyệt yêu cầu',
      buttons: {},
    };

    dialogParams.buttons = { confirm: { display: true } };
    dialogParams.buttons = { dismiss: { display: true } };

    this.dialogService.openDialog(dialogParams, () => {
      onAccept();
    });
  }

  getHiddenButtons(
    record: InternalTransfer,
    disabledForm: boolean = true
  ): HiddenButton[] {
    let newHiddenButtons: HiddenButton[] = [];
    const approveDate = new Date(record?.approveDate).toDateString();
    const crrDate = new Date().toDateString();

    const hiddenFooterAction: string[] = FOOTER_ACTIONS.filter(
      (footerAction) => {
        const check1 =
          !footerAction.enableStatus.includes(record.status) &&
          footerAction.enableStatus.length !== 0;

        const formStatus = disabledForm ? 'disabled' : 'enabled';
        const check2 =
          footerAction.activeWhen.length === 1 &&
          formStatus !== footerAction.activeWhen[0];

        const checkReverse =
          footerAction.code === FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE &&
          approveDate !== crrDate;

        const checkHO = isHoiSo() && record.branchCode !== '001';

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

  checkPermission(data: InternalTransfer, isEditMode: boolean = true): boolean {
    const hiddenButtons = this.getHiddenButtons(data, true);
    const isEditDisallowed = hiddenButtons.find(
      (button) => button.actionCode === FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT
    );

    if (isEditMode && isEditDisallowed) {
      return false;
    }

    const role = isKSV() ? 'KSV' : 'GDV';
    const isHOUser = this.userInfo.branchCode === '001';

    if (role === 'GDV') {
      const isCreator = data.createdBy === this.userInfo.userName;
      if (!isHOUser && !isCreator) {
        return false;
      }
    }
    // KSV
    else {
      if (isEditMode) {
        return false;
      }
      const isSameBranch = data.branchCode === this.userInfo.branchCode;
      if (!isHOUser && !isSameBranch) {
        return false;
      }
    }

    return true;
  }

  openNotePopup(data: InternalTransfer): void {
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
    if (data.approveRevertNote && data.approveRevertBy) {
      dialogParams.title = `Nội dung phê duyệt Reverse của KSV`;
      dialogParams.form[0].defaultValue = data.approveRevertNote;
      this.dialogService.openDialog(dialogParams, () => {});
      return;
    }

    if (data.approveNote && data.approveBy) {
      dialogParams.form[0].defaultValue = data.approveNote;
      this.dialogService.openDialog(dialogParams, () => {});
    }
  }

  printForm(id: string): void {
    this.internalTransferService.getPrintedForm(id, 'true').subscribe(
      (res) => {
        if (res && res.data) {
          FilesHelper.openPdfFromBase64(res.data.fileContent, () => {
            this.handleError();
          });
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  printDocument(id: string): void {
    this.internalTransferService.getPrintedDoc(id).subscribe(
      (res) => {
        if (res && res.data) {
          FilesHelper.openPdfFromBase64(res.data.fileContent, () => {
            this.handleError();
          });
        }
      },
      (error) => {
        this.handleError(error);
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

  delete(data: InternalTransfer | SearchResponseData, callback?: () => void): void {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận xóa yêu cầu',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.internalTransferService.deleteTransfer(data.id).subscribe(
        (res) => {
          if (res) {
            this.customNotificationService.success(
              'Thông báo',
              'Xóa thành công'
            );

            if(callback){
              callback();
            }
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


  approve(
    data: InternalTransfer,
    callback?: (res: any) => void,
    callbackError?: (error: any, req: ApproveRequest) => void
  ): void {
    this.commonService.approve(data, {callback, callbackError});
  }

  reverse(data: InternalTransfer, callback?: (data: DataResponse<InternalTransfer>) => void): void {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận gửi duyệt yêu cầu reverse',
    };
    const req: ApproveRequest = {
      id: data.id,
      version: data.version,
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.sendApprove(req).subscribe((res) => {
        if(callback){
          callback(res);
        }
      });
    });
  }

  unReverse(data: InternalTransfer, callback?: (data: DataResponse<InternalTransfer>) => void): void {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận un-reverse',
    };
    this.dialogService.openDialog(dialogParams, () => {
      const req: ApproveRequest = {
        id: data.id,
        version: data.version,
      };
      this.internalTransferService.rejectTransfer(req).subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success(
              'Thông báo',
              'Un-reverse thành công'
            );

            if(callback){
              callback(res);
            }
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    });
  }

  backToSearch() {
    this.commonService.backToSearch();
  }

  navigateToDetail(queryParams: any) {
    this.commonService.navigateToDetail(queryParams, 'INTERNAL');
  }

  reset(){
    this.commonService.reset();
  }

  openLimitPopup(){
    this.commonService.openLimitPopup();
  }
}
