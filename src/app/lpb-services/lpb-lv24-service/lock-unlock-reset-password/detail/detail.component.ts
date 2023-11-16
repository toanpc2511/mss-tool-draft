import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CONTROL_TYPES } from 'src/app/shared/components/lpb-dialog/lpb-dialog.component';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { ConfirmTransactionRequest, ISubmit } from '../../shared/models/lv24';
import { LV24Service } from '../../shared/services/lv24.service';
import {
  BEFORE_CONFIRM_ERROR,
  SERVICE_TYPE,
} from '../../shared/constants/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import { errorNeedShowByDialog } from '../../shared/utilites/http';
interface IDialogParams {
  userName: string;
  isApproval: boolean;
}
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  userInfo: any;

  constructor(
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private lv24Service: LV24Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    BreadCrumbHelper.setBreadCrumb([
      'LienViet24h',
      'Chi tiết yêu cầu LienViet24h',
    ]);
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }
  ngOnInit(): void {}

  createDialogParams(
    { userName, isApproval }: IDialogParams = { userName: '', isApproval: true }
  ): ILpbDialog {
    let titleSuffix: string;
    let dialogParams: ILpbDialog;

    if (isApproval) {
      titleSuffix = `Duyệt`;
    } else {
      titleSuffix = `Từ chối`;
      dialogParams = {
        ...dialogParams,
        form: [
          {
            name: 'note',
            placeholder: 'Nhập lý do từ chối',
            defaultValue: null,
            disabled: false,
            type: CONTROL_TYPES.textarea,
            maxlength: 255,
            validates: [
              {
                validate: ValidatorHelper.required,
                message: {
                  type: 'required',
                  content: '*Vui lòng nhập lý do từ chối ',
                },
              },
            ],
          },
        ],
      };
    }
    return {
      ...dialogParams,
      title: `Xác nhận ${titleSuffix} yêu cầu`,
      className: 'w-fit-content w-form-full',
      messages: [
        `Bạn có chắc chắn muốn ${titleSuffix} yêu cầu LienViet24h của username: ${userName}?`,
      ],
      buttons: {
        confirm: {
          display: true,
          text: 'Đồng ý',
        },
        dismiss: {
          display: true,
          text: 'Hủy bỏ',
        },
      },
    };
  }

  onApprove({ customerUserInfo, transactionData, id }: ISubmit) {
    const isApproval = true;
    const params: IDialogParams = {
      userName: customerUserInfo?.userName,
      isApproval,
    };
    const dialogParams = this.createDialogParams(params);

    this.confirm({
      customerUserInfo,
      transactionData,
      id,
      dialogParams,
      service: this.lv24Service.approve,
      isApproval,
    });
  }

  onReject({ customerUserInfo, transactionData, id }: ISubmit) {
    const isApproval = false;
    const params: IDialogParams = {
      userName: customerUserInfo?.userName,
      isApproval,
    };
    const dialogParams = this.createDialogParams(params);
    this.confirm({
      customerUserInfo,
      transactionData,
      id,
      dialogParams,
      service: this.lv24Service.reject,
      isApproval,
    });
  }

  confirm({
    customerUserInfo,
    transactionData,
    id,
    dialogParams,
    service,
    isApproval,
  }) {
    this.dialogService.openDialog(dialogParams, (result) => {
      const request: ConfirmTransactionRequest = {
        id,
        note: result?.value?.note?.trim(),
      };
      this.lv24Service
        .callSvcAfterChkStatus(
          request,
          transactionData || customerUserInfo,
          service
        )
        .subscribe(
          (dataResponse) => {
            this.lv24Service.handleSuccess(
              `${
                isApproval
                  ? `${SERVICE_TYPE[transactionData.serviceCode]} thành công`
                  : 'Từ chối yêu cầu thành công'
              }`,
              () => {
                this.navigateToSearch();
              }
            );
          },
          (error) => {
            switch (error?.status) {
              case BEFORE_CONFIRM_ERROR.ERROR:
                this.lv24Service.handleError(error.message);
                break;
              case BEFORE_CONFIRM_ERROR.CHANGED:
                this.dialogService.openDialog(
                  {
                    title: `Thông báo`,
                    messages: [error.message],
                    buttons: {
                      confirm: {
                        display: true,
                        label: 'Quay lại',
                      },
                      dismiss: {
                        display: false,
                      },
                    },
                    catchDismiss: true,
                  },
                  () => {
                    this.navigateToDetail(id);
                  }
                );
                break;
              default:
                if (errorNeedShowByDialog(error?.code)) {
                  this.dialogService.openDialog(
                    {
                      title: `Thông báo`,
                      messages: [error.message],
                      buttons: {
                        confirm: {
                          display: false,
                        },
                        dismiss: {
                          display: true,
                          label: 'Đóng',
                        },
                      },
                      catchDismiss: true,
                    },
                    () => {}
                  );
                } else {
                  this.lv24Service.handleError(
                    `${
                      isApproval
                        ? `${
                            SERVICE_TYPE[transactionData.serviceCode]
                          } thất bại`
                        : 'Từ chối yêu cầu thất bại'
                    }`
                  );
                }
                break;
            }
          }
        );
    });
  }
  navigateToDetail(transId: string): void {
    const url = window.location.href;
    const newUrl = new URL(url).pathname;
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([newUrl], { queryParams: { transId } }));
  }
  navigateToSearch(): void {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
    });
  }
}
