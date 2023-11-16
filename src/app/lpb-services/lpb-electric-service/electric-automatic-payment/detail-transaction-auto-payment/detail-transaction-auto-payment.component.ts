import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ElectricService } from '../../shared/services/electric.service';
import { ActionModel } from '../../../../shared/models/ActionModel';
import { BreadCrumbHelper } from '../../../../shared/utilites/breadCrumb-helper';
import { ITransactionSettle } from '../../shared/models/electric.interface';
import { isKSV } from 'src/app/shared/utilites/role-check';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

@Component({
  selector: 'app-detail-transaction-auto-payment',
  templateUrl: './detail-transaction-auto-payment.component.html',
  styleUrls: ['./detail-transaction-auto-payment.component.scss']
})
export class DetailTransactionAutoPaymentComponent implements OnInit {
  id: string;
  transaction: ITransactionSettle;
  actions: ActionModel[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private destroy$: DestroyService,
    private electricService: ElectricService,
    private cdr: ChangeDetectorRef,
    private formMessageService: FormMessageService,
  ) {
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động',
      'Chi tiết'
    ]);
    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          if (params.id) {
            this.id = params.id;
            this.getDetailTransaction();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getDetailTransaction(): void {
    this.electricService.detailTransactionSettle(this.id)
      .subscribe((res) => {
        this.transaction = res.data;
        this.setActions();
        this.cdr.detectChanges();
      });
  }

  setActions() {
    if (isKSV()) {
      if (["APPROVED", "REJECT"].includes(this.transaction.auditStatus)) {
        this.actions = [];
        return;
      }
      this.actions = [
        { actionName: "Duyệt giao dịch", actionIcon: "check", actionClick: () => this.approve() },
        { actionName: "Từ chối duyệt", actionIcon: "cancel", actionClick: () => this.reject() },
      ]
    } else {
      this.actions = [];
    }
  }

  async approve() {
    let dataConfirm
    const title = "Xác nhận duyệt";
    const message = "Bạn có chắc chắn duyệt không ?";
    const btnOk = { text: 'Xác nhận', class: 'lpb-btn-primary' };
    const btnCancel = { text: 'Hủy', class: 'btn-secondary' };
    await this.formMessageService.confirm(title, message, btnOk, btnCancel).then(res => {
      dataConfirm = res;
    })

    if (!dataConfirm.accept) {
      return;
    }
    let body = {
      approveSettles: [
        { lastModifiedDate: this.transaction.lastModifiedDate, settleId: this.id }
      ],
      reason: "", transactionType: this.transaction.transactionType
    }
    this.electricService.approveAutoPayment(body).toPromise().then(res => {
      this.actions = [];
      this.formMessageService.openMessageSuccess("Duyệt thành công !")
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  async reject() {
    let dataConfirm
    const title = "Xác nhận  từ chối duyệt";
    const message = "Nhập lý do từ chối duyệt";
    const btnOk = { text: 'Xác nhận', class: 'lpb-btn-primary' };
    const btnCancel = { text: 'Hủy', class: 'btn-secondary' };
    const hasContent = true;
    await this.formMessageService.confirm(title, message, btnOk, btnCancel, hasContent).then(res => {
      dataConfirm = res
    })
    if (!dataConfirm.accept) {
      return;
    }
    let body = {
      approveSettles: [
        { lastModifiedDate: this.transaction.lastModifiedDate, settleId: this.id }
      ],
      reason: dataConfirm.content, transactionType: this.transaction.transactionType
    }
    this.electricService.rejectApproveAutoPayment(body).toPromise().then(res => {
      this.actions = [];
      this.formMessageService.openMessageSuccess("Từ chối duyệt thành công !")
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

}
