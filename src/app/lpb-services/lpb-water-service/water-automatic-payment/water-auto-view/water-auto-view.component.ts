import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
import { PAYMENT_TYPES } from '../../shared/constants/water.constant';
import { IAutoPayment, IReqApproveAutoPayment } from '../../shared/models/water.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
import {
  CustomConfirmDialogComponent
} from "../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component";
import { IError } from "../../../../system-configuration/shared/models/error.model";
import { CustomNotificationService } from "../../../../shared/services/custom-notification.service";
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
declare const $: any;

@Component({
  selector: 'app-water-auto-view',
  templateUrl: './water-auto-view.component.html',
  styleUrls: ['./water-auto-view.component.scss']
})
export class WaterAutoViewComponent implements OnInit, OnDestroy {
  isLoading = false;
  rootData: IAutoPayment;
  id = "";
  paymentTypes = PAYMENT_TYPES;
  //
  actions: ActionModel[] = [];

  constructor(public matdialog: MatDialog, private handleErrorService: HandleErrorService,
    private waterService: WaterService, private router: Router, private route: ActivatedRoute, private notifiService: CustomNotificationService) { }

  ngOnInit(): void {
    this.setInit();
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("waterDataRow");
    sessionStorage.removeItem("waterHandleType");
  }

  setTittle(title) {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html(`Thanh toán tự động / ${title}`);
  }

  async setInit() {
    this.isLoading = true;
    let id = this.route.snapshot.queryParamMap.get("id");
    if (!id) {
      let data = sessionStorage.getItem("waterDataRow");
      if (data) {
        this.actions = [];
        this.rootData = JSON.parse(data);
      }
      this.setTittle("Xem chi tiết");
      return;
    }
    this.id = id;
    await this.waterService.getDetailAutoPaymentSignUp(id).toPromise().then(async res => {
      const rootData = res["data"];
      this.rootData = { ...rootData, paymentRuleName: PAYMENT_TYPES.find(x => x.value === rootData.paymentRule)?.label };
      isKSV() ? this.handleActionsKSV(res.data) : this.setAction();
    }).catch(err => {
      this.handleErrorService.handleError(err)
    }).finally(() => {
      this.isLoading = false;
    })
  }

  handleActionsKSV(value: any): void {
    if (value.statusCode === 'APPROVED' || value.statusCode === 'REJECT') {
      this.actions = [];
      return;
    } else {
      this.actions = [
        {
          actionName: value.transactionType === 'APPROVE_REGISTER_AUTO_SETTLE' ? 'Duyệt đăng ký'
            : value.transactionType === 'APPROVE_MODIFY_AUTO_SETTLE' ? 'Duyệt chỉnh sửa'
              : 'Duyệt hủy đăng ký',
          actionIcon: 'save',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.openModalApprove(),
        },
        {
          actionName: 'Từ chối duyệt',
          actionIcon: 'cancel',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.openModalRejectApprove(),
        },
      ];
    }
  }

  openModalApprove(): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn duyệt giao dịch?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.approve();
      }
    });
  }

  approve(): void {
    this.waterService
      .approveAutoPayment(this.handleDataReq())
      .subscribe(
        (res) => {
          if (res.data) {
            this.setInit();
            res.data[0]?.status === 'APPROVED'
              ? this.notifiService.success('Thông báo', `Duyệt thành công`)
              : this.notifiService.warning('Thông báo', `Duyệt thất bại`);
          }
        },
        (error: IError) => this.checkError(error)
      );
  }

  openModalRejectApprove(): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn từ chối duyệt giao dịch?`,
        isReject: true
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        this.reject(confirm);
      }
    });
  }

  reject(reason: string): void {
    this.waterService
      .rejectApproveAutoPayment(this.handleDataReq())
      .subscribe(
        (res) => {
          if (res.data) {
            this.setInit();
            res.data[0]?.status === 'REJECT'
              ? this.notifiService.success('Thông báo', `Từ chối duyệt thành công`)
              : this.notifiService.warning('Thông báo', `Từ chối duyệt thất bại`);
          }
        },
        (error: IError) => this.checkError(error)
      );
  }

  handleDataReq(reason?: string): IReqApproveAutoPayment {
    const dataSelected = [{
      settleId: this.rootData.id,
      lastModifiedDate: this.rootData.lastModifiedDate
    }];
    return {
      transactionType: this.rootData.transactionType,
      approveSettles: dataSelected,
      reason
    };
  }

  setAction() {
    if (!isGDV()) {
      return;
    }
    const type = sessionStorage.getItem("waterHandleType");
    if (type && type === "view") {
      this.setTittle("Xem chi tiết");
      return;
    }
    if (this.isDelete()) {
      this.actions = [{
        actionName: "Xóa TTTĐ",
        actionIcon: "delete",
        actionClick: () => this.delete()
      }];
      this.setTittle("Xóa TTTĐ");
    }
  }

  isDelete() {
    return ["IN_PROCESS", "REJECT"].includes(this.rootData.statusCode) && this.rootData.transactionType === "APPROVE_REGISTER_AUTO_SETTLE";
  }

  delete() {
    let message = "Bạn có chắc chắn muốn xóa giao dịch này ?";
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "cancel", text: message, title: "Xác nhận", btnOk: { text: "Xác nhận", class: "btn-danger" }, btnCancel: { text: "Quay lại", class: "btn-secondary" } }, hasBackdrop: true, disableClose: true, backdropClass: "bg-none"
    })

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.deleteAction();
      }
    })
  }

  deleteAction() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.waterService.deleteAutoPaymentSignUp(this.id).toPromise().then(res => {
      this.openMessageSuccess();
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  openMessageSuccess() {
    let message = "Xóa đăng ký TTTĐ thành công !";
    let btnOk = { text: "OK", class: "lpb-btn-primary" };
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "ok", text: message, title: "Thành công", btnOk: btnOk }, position: { top: "0px", right: "0px" }
    })
    dialog.afterClosed().subscribe(res => {
      this.router.navigate(['../'], { relativeTo: this.route, });
    })
  }

  checkError(error: IError): void {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message);
    } else {
      this.notifiService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
    }
  }
}
