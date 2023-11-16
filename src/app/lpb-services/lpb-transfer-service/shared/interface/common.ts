import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CommonTransfer, ApproveRequest, PrintedDoc, HiddenButton, SearchResponseData, TRANS_TYPE } from '../models/common';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

export interface FooterAction {
  code: string,
  name: string,
  enableOnlyCrrUser: boolean,
  enableStatus: string[],
  activeWhen: string[],
  roles: string[],
}

export interface TransferHTTPService {
  createTransfer(
    request: CommonTransfer
  ): Observable<DataResponse<CommonTransfer>>;

  updateTransfer(
    request: CommonTransfer
  ): Observable<DataResponse<CommonTransfer>>;

  sendApprove(request: ApproveRequest): Observable<any>;

  getTransactionDetail(id: string): Observable<DataResponse<CommonTransfer>>;

  getPrintedForm(
    id: string,
    isLogo: string
  ): Observable<DataResponse<PrintedDoc>>;

  getPrintedDoc(id: string): Observable<DataResponse<PrintedDoc>>;

  deleteTransfer(id: string): Observable<any>;

  approveTransfer(req: ApproveRequest): Observable<any>;

  rejectTransfer(req: ApproveRequest): Observable<any>;

  sendModifyRequest(req: ApproveRequest): Observable<any>;
}

export interface TransferFormService {
  parseFormToRequest(form: FormGroup): CommonTransfer;

  patchDataToForm(form: FormGroup, data: CommonTransfer): void;

  getHiddenButtons(
    record: CommonTransfer,
    disabledForm: boolean
  ): HiddenButton[];

  checkPermission(data: CommonTransfer, isEditMode: boolean): boolean;

  saveTransfer(
    form: FormGroup,
    type: 'CREATE' | 'UPDATE'
  ): Observable<DataResponse<CommonTransfer>>;

  sendApprove(
    request: ApproveRequest
  ): Observable<DataResponse<CommonTransfer>>;

  openSendApproveDialog(data: { acn: string }, onAccept: () => void): void;

  openNotePopup(data: CommonTransfer): void;

  printForm(id: string): void;

  printDocument(id: string): void;

  delete(data: CommonTransfer | SearchResponseData, callback?: () => void): void

  approve(data: CommonTransfer, callback?: () => void): void

  reverse(data: CommonTransfer, callback?: (data: DataResponse<CommonTransfer>) => void): void

  unReverse(data: CommonTransfer, callback?: (data: DataResponse<CommonTransfer>) => void): void

  backToSearch?(): void

  navigateToDetail?(queryParams: any): void
}

export interface FooterButtonAction{
  icon: string;
  actionName: string;
  actionCode: string;
  hiddenType?: 'disable' | 'none';
}

