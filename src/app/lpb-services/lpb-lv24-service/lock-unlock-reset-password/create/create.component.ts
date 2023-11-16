import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { SERVICE_TYPE } from '../../shared/constants/common';
import {
  CreateTransactionRequest,
  ISubmit,
  TransactionData,
} from '../../shared/models/lv24';
import { LV24Service } from '../../shared/services/lv24.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { errorNeedShowByDialog } from '../../shared/utilites/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  userInfo: any;

  constructor(
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private lv24Service: LV24Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'LienViet24h',
      'Tạo mới yêu cầu LienViet24h',
    ]);
  }

  onSendApprove({ frmValues, customerUserInfo }: ISubmit) {
    const serviceTypeVi = SERVICE_TYPE[frmValues.serviceCode];
    const dialogParams: ILpbDialog = {
      title: `Xác nhận gửi duyệt ${serviceTypeVi}`,
      messages: [
        `Bạn có chắc muốn gửi duyệt yêu cầu ${serviceTypeVi}?`,
        `Username: ${customerUserInfo?.userName}`,
      ],
      buttons: {
        confirm: {
          display: true,
          label: 'Đồng ý',
        },
        dismiss: {
          display: true,
          label: 'Hủy bỏ',
        },
      },
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      const request: CreateTransactionRequest = {
        accountStatus: customerUserInfo.accountStatus,
        address: customerUserInfo.address,
        cif: customerUserInfo.cif,
        cusName: customerUserInfo.cusName,
        cusStatus: customerUserInfo.cusStatus,
        cusTypeDes: customerUserInfo.cusTypeDes,
        docMethod: customerUserInfo.docMethod,
        docNum: customerUserInfo.docNum,
        docType: customerUserInfo.docType,
        phoneNumber: customerUserInfo.phoneNumber,
        userCreatedTime: customerUserInfo.userCreatedTime,
        userMakerId: customerUserInfo.userMakerId,
        userName: customerUserInfo.userName,
        userStatus: customerUserInfo.userStatus,
        wrongPassCount: customerUserInfo.wrongPassCount,
        email: customerUserInfo.email,
        note: frmValues.note,
        serviceCode: frmValues.serviceCode,
        branchCode: this.userInfo?.branchCode,
      };
      this.lv24Service.create(request).subscribe(
        (result: DataResponse<TransactionData>) => {
          this.lv24Service.handleSuccess('Gửi duyệt thành công', () => {
            this.navigateToDetail(result.data?.id);
          });
        },

        (error) => {
          if (errorNeedShowByDialog(error?.code)) {
            this.dialogService.openDialog(
              {
                title: 'Thông báo',
                messages: [error.message],
                catchDismiss: true,
                className: 'w-fit-content',
                buttons: {
                  confirm: {
                    display: true,
                    label: 'Quay lại',
                  },
                  dismiss: {
                    display: false,
                  },
                },
              },
              () => {}
            );
            return;
          }
          this.lv24Service.handleError('Gửi duyệt thất bại');
        }
      );
    });
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: id,
      },
    });
  }
}
