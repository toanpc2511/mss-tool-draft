import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CHARGE_TYPES } from 'src/app/shared/constants/finance';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import {
  FOOTER_ACTIONS
} from '../../constants/internal';
import { NAPAS_SEARCH_TYPES } from '../../constants/napas';
import { TransferFormService } from '../../interface/common';
import {
  ApproveRequest,
  CommonTransfer,
  HiddenButton,
  SearchResponseData
} from '../../models/common';
import { NapasTransfer } from '../../models/napas';
import { CommonService } from '../common.service';
import { NapasTransferService } from './napas-tranfer.service';
import { TRANS_STATUS_CODES } from '../../constants/common';

@Injectable({
  providedIn: 'root',
})
export class NapasTransferFormService implements TransferFormService {
  private commonService: CommonService;
  constructor(
    private napasTransferService: NapasTransferService,
    private dialog: MatDialog,
    private dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private router: Router
  ) {
    this.dialogService.setDialog(this.dialog);

    this.commonService = new CommonService(
      this.napasTransferService,
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

  parseFormToRequest(form: FormGroup): NapasTransfer {
    const frmValues = form.getRawValue();
    const isFree = frmValues.feeType === CHARGE_TYPES.FREE;
    const feeJSON = {
      exchangeAmount: isFree ? 0 : Number(frmValues.feeEx),
      exchangeVAT: isFree ? 0 : Number(frmValues.feeVATEx),
      vnAmount: isFree ? 0 : Number(frmValues.fee),
      vnVAT: isFree ? 0 : Number(frmValues.feeVAT),
    };

    let recipientAcn, recipientCardNum, recipientBankId;

    if(frmValues.recipientTxtType === NAPAS_SEARCH_TYPES.ACN){
      recipientAcn = frmValues.recipientAcn;
      recipientBankId = frmValues.recipientBankId,
      recipientCardNum = '';
    } else {
      recipientAcn = '';
      recipientBankId = '';
      recipientCardNum = frmValues.recipientCardNum;
    }

    let request: NapasTransfer = {
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
      accountName: frmValues.senderAccountName,

      intermediaryAcn: frmValues.intermediaryAcn,
      intermediaryAcnName: frmValues.intermediaryAcnName,

      employeeId: frmValues.employeeId,
      recipientBankId,
      recipientBankName: frmValues.recipientBankName,
      recipientFullName: frmValues.recipientFullName,
      recipientAcn,
      recipientCardNum,
    };

    if(frmValues.id){
      request.id = frmValues.id;
    }

    if(frmValues.version !== null){
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

  patchDataToForm(form: FormGroup, data: NapasTransfer): void {
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
    };

    if (data.recipientAcn) {
      patchValueData.recipientTxtType = NAPAS_SEARCH_TYPES.ACN;
    } else {
      patchValueData.recipientTxtType = NAPAS_SEARCH_TYPES.CARD_NO;
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
      disabledForm
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
    this.commonService.reverse(data, callback);
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
    this.commonService.navigateToDetail(queryParams, 'NAPAS');
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
}
