import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { IError } from 'src/app/shared/models/error.model';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { PAYMENT_TYPES } from '../../shared/constants/electric.constant';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { ElectricService } from '../../shared/services/electric.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

@Component({
  selector: 'app-electric-auto-view',
  templateUrl: './electric-auto-view.component.html',
  styleUrls: ['./electric-auto-view.component.scss']
})
export class ElectricAutoViewComponent implements OnInit, OnDestroy {
  isLoading = false;
  rootData: any;
  id = "";
  paymentTypes = PAYMENT_TYPES;
  //
  actions: ActionModel[] = [];

  constructor(public matdialog: MatDialog, private formMessageService: FormMessageService,
    private electricService: ElectricService, private router: Router, private route: ActivatedRoute, private notifiService: CustomNotificationService) { }

  ngOnInit(): void {
    this.setInit();
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("electricDataRow");
    sessionStorage.removeItem("electricHandleType");
  }

  setTittle(title) {
    BreadCrumbHelper.setBreadCrumb([
      "Thanh toán hóa đơn điện",
      "Thanh toán tự động"
    ])    
  }

  async setInit() {
    this.isLoading = true;
    let id = this.route.snapshot.queryParamMap.get("id");
    if (!id) {
      let data = sessionStorage.getItem("electricDataRow");
      if (data) {
        this.actions = [];
        this.rootData = JSON.parse(data);
      }
      this.setTittle("Xem chi tiết");
      return;
    }
    this.id = id;
    await this.electricService.getDetailAutoPaymentSignUp(id).toPromise().then(async res => {
      const rootData = res["data"];
      this.rootData = { ...rootData, paymentRuleName: PAYMENT_TYPES.find(x => x.value === rootData.paymentRule)?.label };
      isKSV() ? this.handleActionsKSV(res.data) : this.setAction();
    }).catch(err => {
      this.formMessageService.handleError(err)
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
    this.electricService
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
    this.electricService
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

  handleDataReq(reason?: string) {
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
    const btnOk = { text: "Xác nhận", class: "btn-danger" };
    const btnCancel = { text: "Quay lại", class: "btn-secondary" };
    this.formMessageService.confirm("Xác nhận",message, btnOk, btnCancel).then((res) => {
      if (res.accept) {
        this.deleteAction();  
      }      
    })    
  }

  deleteAction() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.electricService.deleteAutoPaymentSignUp(this.id).toPromise().then(res => {
      this.formMessageService.openMessageSuccess("Xóa đăng ký TTTĐ thành công !").then(() => {
        this.router.navigate(['../'], { relativeTo: this.route, });  
      })      
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
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
