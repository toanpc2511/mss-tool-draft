import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CHARGE_TYPES } from 'src/app/shared/constants/finance';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { ILpbDialog, LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import {
  FOOTER_ACTIONS,
  RECIPIENT_SEARCH_TYPE,
} from '../../constants/internal';
import { TransferFormService } from '../../interface/common';
import { CitadSyncInfo, CitadTransfer } from '../../models/citad';
import {
  ApproveRequest,
  CommonTransfer,
  HiddenButton,
  SearchResponseData,
  TRANS_TYPE,
} from '../../models/common';
import { CommonService } from '../common.service';
import { CitadTransferService } from './citad-transfer.service';
import { Router } from '@angular/router';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { TRANSACTION_STATUSES, TRANS_STATUS_CODES } from '../../constants/common';
import { CITAD_SYNC_STATUS, CITAD_SYNC_STATUS_VI } from '../../constants/citad';
import { ErrorHelper } from 'src/app/shared/utilites/error.helper';

@Injectable({
  providedIn: 'root',
})
export class CitadTransferFormService implements TransferFormService {
  private commonService: CommonService;
  constructor(
    private citadTransferService: CitadTransferService,
    private dialog: MatDialog,
    private dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private router: Router
  ) {
    this.dialogService.setDialog(this.dialog);

    this.commonService = new CommonService(
      this.citadTransferService,
      this.customNotificationService,
      this.dialogService,
      this.router
    );
  }

  get userInfo(): any {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  parseFormToRequest(form: FormGroup): CitadTransfer {
    const frmValues = form.getRawValue();
    const isFree = frmValues.feeType === CHARGE_TYPES.FREE;
    const feeJSON = {
      exchangeAmount: isFree ? 0 : Number(frmValues.feeEx),
      exchangeVAT: isFree ? 0 : Number(frmValues.feeVATEx),
      vnAmount: isFree ? 0 : Number(frmValues.fee),
      vnVAT: isFree ? 0 : Number(frmValues.feeVAT),
    };

    let request: CitadTransfer = {
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
      employeeId: frmValues.employeeId,
      address: frmValues.senderAddress,
      addrSender1: frmValues.senderAddressLine1,
      addrSender2: frmValues.senderAddressLine2,
      addrSender3: frmValues.senderAddressLine3,
      addrSender4: frmValues.senderAddressLine4,
      accountName: frmValues.senderAccountName,

      nostroAcn: frmValues.nostroAcn,
      nostroName: frmValues.nostroName,

      routeCode: frmValues.routeCode,
      recipientBankId: frmValues.recipientBankId,
      recipientBank: frmValues.recipientBank,
      recipientBankName: frmValues.recipientBankName,
      recipientDocIssueDate: frmValues.recipientDocIssueDate || '',
      recipientDocIssuePlace: frmValues.recipientDocIssuePlace || '',
      recipientFullName: frmValues.recipientFullName,
      recipientDocType: frmValues.recipientDocType || '',
      recipientAcn: frmValues.recipientAcn || '',
      recipientDocNum: frmValues.recipientDocNum || '',

      directCode: frmValues.recipientDirectCode,
      inDirectCode: frmValues.recipientIndirectCode,
      inDirectCodeDesc: frmValues.inDirectCodeDesc,
      addrRecipientBank: frmValues.recipientBankAddress,
      crossoverNote: frmValues.accountingNote,
    };

    if (frmValues.id) {
      request.id = frmValues.id;
    }

    if (frmValues.version !== null) {
      request.version = frmValues.version;
    }

    Object.keys(request).forEach((key) => {
      if (
        typeof request[key] === 'string' &&
        request[key] &&
        key !== 'feeJson'
      ) {
        request[key] = request[key].trim();
      }
    });

    return request;
  }

  patchDataToForm(form: FormGroup, data: CitadTransfer): void {
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
      senderAddressLine1: data.addrSender1,
      senderAddressLine2: data.addrSender2,
      senderAddressLine3: data.addrSender3,
      senderAddressLine4: data.addrSender4,
      recipientBankAddress: data.addrRecipientBank,
      accountingNote: data.crossoverNote,
      recipientDirectCode: data.directCode,
      recipientIndirectCode: data.inDirectCode,
    };

    if (data.recipientDocNum) {
      patchValueData.recipientTxtType = RECIPIENT_SEARCH_TYPE.GTXM;
    } else {
      patchValueData.recipientTxtType = RECIPIENT_SEARCH_TYPE.ACN;
    }

    form.patchValue(patchValueData);
  }

  getHiddenButtons(
    record: CommonTransfer,
    disabledForm: boolean = true
  ): HiddenButton[] {
    return this.commonService.getHiddenButtons({
      record,
      FOOTER_ACTIONS,
      disabledForm,
      ignoreCheck: {
        reverseWithinDay: true
      }
    });
  }

  checkPermission(data: CommonTransfer, isEditMode: boolean): boolean {
    return this.commonService.checkPermission({
      data,
      hiddenButtons: this.getHiddenButtons(data),
      isEditMode,
    });
  }

  saveTransfer(
    form: FormGroup,
    type: 'CREATE' | 'UPDATE'
  ): Observable<DataResponse<CommonTransfer>> {
    return this.commonService.saveTransfer(this.parseFormToRequest(form), type);
  }

  sendApprove(
    request: ApproveRequest
  ): Observable<DataResponse<CommonTransfer>> {
    return this.commonService.sendApprove(request);
  }

  openSendApproveDialog(data: { acn: string }, onAccept: () => void): void {
    this.commonService.openSendApproveDialog(data, onAccept);
  }

  openNotePopup(data: CommonTransfer): void {
    this.commonService.openNotePopup(data);
  }

  printForm(id: string): void {
    this.commonService.printForm(id);
  }

  printDocument(id: string): void {
    this.commonService.printDocument(id);
  }

  delete(
    data: CommonTransfer | SearchResponseData,
    callback?: () => void
  ): void {
    this.commonService.delete(data, callback);
  }

  approve(
    data: CommonTransfer,
    callback?: (res: any) => void,
    callbackError?: (error: any, req: ApproveRequest) => void
  ): void {
    this.commonService.approve(data, {
      callback,
      callbackError,
    });
  }

  reverse(
    data: CommonTransfer,
    callback?: (data: DataResponse<CommonTransfer>) => void
  ): void {
    this.citadTransferService.checkProcessCode(data.id).subscribe((res) => {
      this.commonService.reverse(data, callback);
    }, (error) => {
      if (ErrorHelper.isReverseError(error?.code)) {
        const dialogParams: ILpbDialog = {
          title: 'Thông báo',
          messages: [error?.message],
          buttons: {
            confirm: { display: false },
            dismiss: { display: true, label: 'Đóng' },
          },
        };

        this.dialogService.openDialog(dialogParams, () => {});
      } else {
        this.customNotificationService.error('Thông báo', error?.message);
      }
    });
  }

  unReverse(
    data: CommonTransfer,
    callback?: (data: DataResponse<CommonTransfer>) => void
  ): void {
    this.commonService.unReverse(data, callback);
  }

  backToSearch() {
    this.commonService.backToSearch();
  }

  navigateToDetail(queryParams: any) {
    this.commonService.navigateToDetail(queryParams, 'CITAD');
  }

  handleError(error){
    this.commonService.handleError(error);
  }

  reset(){
    this.commonService.reset();
  }

  openLimitPopup(){
    this.commonService.openLimitPopup();
  }

  openCitadWarningPopup(citadSyncInfo: CitadSyncInfo){
    if (
      citadSyncInfo.status !== CITAD_SYNC_STATUS.IN_PROCESS &&
      citadSyncInfo.status !== CITAD_SYNC_STATUS.FAILURE
    ) {
      return;
    }

    let message = '';
    if (citadSyncInfo.status === CITAD_SYNC_STATUS.IN_PROCESS) {
      message = 'Mã Citad đang được cập nhật';
    } else {
      message = 'Mã Citad cập nhật bị lỗi';
    }

    const dialogParams: ILpbDialog = {
      title: `Thông báo`,
      messages: [message],
      buttons: {
        confirm: { display: false },
        dismiss: { display: true, label: 'Đóng' },
      },
    };

    this.dialogService.openDialog(dialogParams, () => {});
  }
}
