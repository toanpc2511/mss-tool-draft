import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HandleErrorService } from 'src/app/shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IAutoPayment, IBodyCancelAutoPaySignUp } from '../../shared/models/water.interface';
import { FrmMessageComponent } from 'src/app/shared/components/form-message/form-message.component';
declare const $: any;

@Component({
  selector: 'app-water-auto-cancel',
  templateUrl: './water-auto-cancel.component.html',
  styleUrls: ['./water-auto-cancel.component.scss']
})
export class WaterAutoCancelComponent implements OnInit {

  formSearch = this.fb.group({
    supplierCode: [null, Validators.required],
    customerId: ["", Validators.required]
  })

  searched = false;
  isLoading = false;

  rootData: IAutoPayment;
  actions = [{
    actionName: "Hủy TTTĐ",
    actionIcon: "highlight_off",
    actionClick: () => this.cancel()
  }]

  constructor(private fb: FormBuilder, public matdialog: MatDialog, private handleErrorService: HandleErrorService,
    private waterService: WaterService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    this.valueFormChange();
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tự động / Hủy đăng ký thanh toán tự động');
  }

  valueFormChange() {
    this.formSearch.valueChanges.subscribe(x => {
      this.searched = false;
    })
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  search() {
    if (this.formSearch.invalid || this.isLoading) {
      this.formSearch.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.waterService.getCustomerAutoPay(this.formSearch.get("supplierCode").value, this.formSearch.get("customerId").value).toPromise().then(res => {
      if (res.data && res.data.length === 0) {
        this.handleErrorService.openMessageError("Khách hàng này chưa được đăng ký TTTĐ hoặc đã hủy đăng ký !");
        return;
      }
      this.rootData = res.data[0];
      this.searched = true;
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  cancel() {
    let message = "Bạn có chắc chắn muốn hủy giao dịch này ?";
    const dialog = this.matdialog.open(FrmMessageComponent, {
      data: { type: "cancel", text: message, title: "Xác nhận", btnOk: { text: "Xác nhận", class: "btn-danger" }, btnCancel: { text: "Quay lại", class: "btn-secondary" } }, hasBackdrop: true, disableClose: true, backdropClass: "bg-none"
    })

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.cancelAction();
      }
    })
  }

  cancelAction() {
    if (this.isLoading) {
      return;
    }
    let transactionType = "CANCEL_AUTO_SETTLE";
    let body: IBodyCancelAutoPaySignUp = {
      lastModifiedDate: this.rootData.lastModifiedDate,
      reason: "",
      settleId: this.rootData.id,
      transactionType: transactionType
    }
    this.isLoading = true;
    this.waterService.cancelAutoPaymentSignUp(body).toPromise().then(res => {
      this.openMessageSuccess();
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  openMessageSuccess() {
    const message = "Tạo yêu cầu hủy đăng ký TTTĐ thành công !";
    const btnOk = { text: "OK", class: "lpb-btn-primary" };
    const dialog = this.matdialog.open(FrmMessageComponent, {
      data: { type: "ok", text: message, title: "Thành công", btnOk: btnOk }, position: { top: "0px", right: "0px" }
    })
    dialog.afterClosed().subscribe(res => {
      this.router.navigate(['../'], { relativeTo: this.route, });
    })
  }

}
