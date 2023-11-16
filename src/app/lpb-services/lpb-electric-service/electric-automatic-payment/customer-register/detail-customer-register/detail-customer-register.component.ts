import { ElectricService } from './../../../shared/services/electric.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActionModel } from '../../../../../shared/models/ActionModel';
import { BreadCrumbHelper } from '../../../../../shared/utilites/breadCrumb-helper';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { IInfoCustomerRegister } from '../../../shared/models/electric.interface';
import { IError } from 'src/app/shared/models/error.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { STATUS_ACTIVE } from '../../../shared/constants/electric.constant';
import { EStatusActive } from '../../../shared/constants/status-transaction-electric.constant';
import { MatDialog } from '@angular/material/dialog';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'app-detail-customer-register',
  templateUrl: './detail-customer-register.component.html',
  styleUrls: ['./detail-customer-register.component.scss'],
})
export class DetailCustomerRegisterComponent implements OnInit {
  actions: ActionModel[] = [];
  id: string;
  data: IInfoCustomerRegister;

  constructor(
    private activatedRoute: ActivatedRoute,
    private destroy$: DestroyService,
    private electricService: ElectricService,
    private notify: CustomNotificationService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động',
      'Danh sách KH đăng ký TTTĐ',
      'Chi tiết',
    ]);

    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          if (params.id) {
            this.id = params.id;
            this.getDetailCustomer();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getDetailCustomer(): void {
    this.electricService.getDetailCustomerRegister(this.id).subscribe(
      (res) => {
        if (res.data) {
          this.data = res.data;
          this.actions = [
            {
              actionName: 'Hủy đăng ký',
              actionIcon: 'cancel',
              hiddenType:
                res.data.status === STATUS_ACTIVE[1].value ? 'disable' : 'none',
              actionClick: () => this.cancelRegister(),
            },
          ];
        }
      },
      (error: IError) => this.notify.handleErrors(error)
    );
  }

  cancelRegister(): void {
    if (this.data.status !== EStatusActive.ACTIVE) {
      return;
    }

    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn hủy đăng ký thanh toán tự động?',
        isReject: true,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const body = {
          lastModifiedDate: this.data.lastModifiedDate,
          settleId: this.data.id,
          transactionType: 'CANCEL_AUTO_SETTLE',
        };
        this.electricService.cancelRegisterAutoPayment(body).subscribe(
          (res) => {
            if (res.data) {
              this.notify.success('Thông báo', 'Tạo giao dịch hủy thành công');
              this.getDetailCustomer();
            }
          },
          (error: IError) => this.notify.handleErrors(error)
        );
      }
    });
  }
}
