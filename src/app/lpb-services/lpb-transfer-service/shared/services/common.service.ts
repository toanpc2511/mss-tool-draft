import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { FilesHelper } from 'src/app/shared/utilites/files';
import { isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { TRANS_STATUS_CODES } from '../constants/common';
import {
  FooterAction,
  TransferHTTPService
} from '../interface/common';
import {
  ApproveRequest,
  CommonTransfer,
  HiddenButton,
  SearchResponseData,
  TRANS_TYPE,
} from '../models/common';
import { ErrorCodes, ErrorHelper } from 'src/app/shared/utilites/error.helper';

interface GetHiddenButtonsParams {
  record: CommonTransfer,
  FOOTER_ACTIONS: FooterAction[],
  disabledForm: boolean,
  ignoreCheck?: {
     hoiSO?: boolean,
     reverseWithinDay?: boolean,
  }
}

interface CheckPermissionParams {
  data: CommonTransfer,
  hiddenButtons: HiddenButton[],
  isEditMode: boolean
}

export class CommonService {
  constructor(
    private apiService: TransferHTTPService,
    private customNotificationService: CustomNotificationService,
    private dialogService: LpbDialogService,
    private router: Router
  ) {}

  private isTimeOut = false;

  get userInfo(): any {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  saveTransfer(
    request: CommonTransfer,
    type: 'CREATE' | 'UPDATE'
  ): Observable<DataResponse<CommonTransfer>> {
    let apiCall: Observable<DataResponse<CommonTransfer>>;
    if (type === 'UPDATE') {
      apiCall = this.apiService.updateTransfer(request);
    } else {
      apiCall = this.apiService.createTransfer(request);
    }

    return new Observable<DataResponse<CommonTransfer>>((observer) => {
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

  sendApprove(
    request: ApproveRequest
  ): Observable<DataResponse<CommonTransfer>> {
    return new Observable<any>((observer) => {
      this.apiService.sendApprove(request).subscribe(
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
      title: 'Xác nhận gửi duyệt',
      buttons: {},
    };

    dialogParams.buttons = { confirm: { display: true } };
    dialogParams.buttons = { dismiss: { display: true } };

    this.dialogService.openDialog(dialogParams, () => {
      onAccept();
    });
  }

  getHiddenButtons({
    record,
    FOOTER_ACTIONS,
    disabledForm,
    ignoreCheck,
  }: GetHiddenButtonsParams): HiddenButton[] {
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

        let checkReverse = false;
        if (!ignoreCheck?.reverseWithinDay) {
          checkReverse =
            footerAction.code === FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE &&
            approveDate !== crrDate;
        }

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

  checkPermission({
    data,
    hiddenButtons,
    isEditMode,
  }: CheckPermissionParams): boolean {
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

  openNotePopup(data: CommonTransfer): void {
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
    this.apiService.getPrintedForm(id, 'true').subscribe(
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
    this.apiService.getPrintedDoc(id).subscribe(
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

  delete(
    data: CommonTransfer | SearchResponseData,
    callback?: () => void
  ): void {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận xóa yêu cầu',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.apiService.deleteTransfer(data.id).subscribe(
        (res) => {
          if (res) {
            this.customNotificationService.success(
              'Thông báo',
              'Xóa thành công'
            );

            if (callback) {
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
    data: CommonTransfer,
    {
      callback,
      callbackError,
      hiddenButtons,
    }: {
      callback?: (res: any) => void,
      callbackError?: (error: any, req: ApproveRequest) => void
      hiddenButtons?: string[];
    }
  ): void {
    const dialogParams: ILpbDialog = {
      title: 'Xác nhận phê duyệt yêu cầu',
      messages: [
        `Bạn có chắc chắn phê duyệt giao dịch số tài khoản: ${data.acn}`,
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

    if (hiddenButtons) {
      dialogParams.buttons.customs = dialogParams.buttons.customs.filter(
        (button) => !hiddenButtons.includes(button.type)
      );
    }

    if (data.status === TRANS_STATUS_CODES.WAIT_REVERT) {
      dialogParams.buttons.customs = dialogParams.buttons.customs.filter(
        (button) => button.type !== TRANS_STATUS_CODES.WAIT_MODIFY
      );
    }

    const suspiciousCodes = [
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT
    ]

    if (suspiciousCodes.includes(data.status)) {
      dialogParams.buttons.customs = dialogParams.buttons.customs.filter(
        (button) =>
          button.type !== TRANS_STATUS_CODES.WAIT_MODIFY &&
          button.type !== TRANS_STATUS_CODES.REJECT
      );
    }

    this.dialogService.openDialog(dialogParams, (result) => {
      const note = result?.value?.note?.trim();
      const req: ApproveRequest = {
        id: data.id,
        note,
        version: data.version,
      };

      switch (result?.type) {
        case TRANS_STATUS_CODES.APPROVE: {
          this.handleApprove({
            callback,
            callbackError,
            req,
          })
          break;
        }
        case TRANS_STATUS_CODES.REJECT: {
          this.apiService.rejectTransfer(req).subscribe(
            (res) => {
              this.customNotificationService.success(
                'Thông báo',
                'Từ chối thành công'
              );
              if (callback) {
                callback(res);
              }
            },
            (error) => {
              if (callbackError) {
                callbackError({ ...error, type: result?.type }, req);
              } else {
                this.handleError(error);
              }
            }
          );
          break;
        }
        case TRANS_STATUS_CODES.WAIT_MODIFY: {
          this.apiService.sendModifyRequest(req).subscribe(
            (res) => {
              this.customNotificationService.success(
                'Thông báo',
                'Yêu cầu bổ sung thành công'
              );
              if (callback) {
                callback(res);
              }
            },
            (error) => {
              if (callbackError) {
                callbackError({ ...error, type: result?.type }, req);
              } else {
                this.handleError(error);
              }
            }
          );
          break;
        }
      }
    });
  }

  handleApprove({
    callback,
    callbackError,
    req,
  }: {
    callback?: (res: any) => void;
    callbackError?: (error: any, req: ApproveRequest) => void;
    req: ApproveRequest;
  }) {
    this.apiService.approveTransfer(req).subscribe(
      (res) => {
        this.customNotificationService.success('Thông báo', 'Duyệt thành công');
        if (callback) {
          callback(res);
        }
      },
      (error) => {
        const suffix = error?.code?.split('-').pop();
        switch (suffix) {
          case ErrorCodes.TIME_OUT: {
            this.isTimeOut = true;
            const dialogParams: ILpbDialog = {
              title: 'Thông báo',
              messages: [error?.message],
              buttons: {
                confirm: { display: false },
                dismiss: { display: true, label: 'Đóng' },
              },
            };

            if (callbackError) {
              callbackError(error, req);
            }

            this.dialogService.openDialog(dialogParams, () => {});
            break;
          }

          case ErrorCodes.VERSION: {
            if (this.isTimeOut) {
              this.retryApprove({
                callback,
                callbackError,
                req,
              });
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

  retryApprove({
    callback,
    callbackError,
    req,
  }: {
    callback?: (res: any) => void;
    callbackError?: (error: any, req: ApproveRequest) => void;
    req: ApproveRequest;
  }) {
    this.apiService.getTransactionDetail(req.id).subscribe(
      (res) => {
        const retryReq: ApproveRequest = {
          ...req,
          version: res.data.version,
        };

        this.handleApprove({
          callback,
          callbackError,
          req: retryReq,
        });
      },
      (error) => {
        this.handleError(error);
        return;
      }
    );
  }

  reverse(
    data: CommonTransfer,
    callback?: (data: DataResponse<CommonTransfer>) => void,
  ): void {
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

  unReverse(
    data: CommonTransfer,
    callback?: (data: DataResponse<CommonTransfer>) => void
  ): void {
    const dialogParams: ILpbDialog = {
      messages: [`Giao dịch số tài khoản: ${data.acn}`],
      title: 'Xác nhận un-reverse',
    };
    this.dialogService.openDialog(dialogParams, () => {
      const req: ApproveRequest = {
        id: data.id,
        version: data.version,
      };
      this.apiService.rejectTransfer(req).subscribe(
        (res) => {
          if (res && res.data) {
            this.customNotificationService.success(
              'Thông báo',
              'Un-reverse thành công'
            );

            if (callback) {
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

  backToSearch(): void {
    this.router.navigate(['/transfer-service/internal']);
  }

  navigateToDetail(queryParams: any, type?: TRANS_TYPE) {
    if (!type) {
      type = 'INTERNAL';
    }
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/transfer-service/${type.toLowerCase()}/detail`], {
        queryParams,
      })
    );
  }

  reset(){
    this.isTimeOut = false;
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
}
