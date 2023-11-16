import { Component, OnInit } from '@angular/core';
import {FormBuilder, AbstractControl, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
import { COLUMNS_TRANSACTIONS, STATUS_TRANSACTION } from '../../shared/constants/water.constant';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
import { handleBackRouter } from 'src/app/shared/utilites/handle-router';
import {ultis} from "../../../../shared/utilites/function";
import {FormHelpers} from "../../../../shared/utilites/form-helpers";
import * as moment from "moment/moment";
import {LbpValidators} from "../../../../shared/validatetors/lpb-validators";
declare const $: any;

@Component({
  selector: 'app-water-edit-cancel-transaction',
  templateUrl: './water-edit-cancel-transaction.component.html',
  styleUrls: ['./water-edit-cancel-transaction.component.scss']
})
export class WaterEditCancelTransactionComponent implements OnInit {
  today = new Date();
  formHelpers = FormHelpers;

  statusTransactions = STATUS_TRANSACTION;
  formSearch = this.fb.group({
    supplierCode: [null],
    customerId: [""],
    statusTransaction: [this.statusTransactions[0]["value"]],
    fromDate: [ultis.formatDate(this.today), [Validators.required]],
    toDate: [ultis.formatDate(this.today), [Validators.required]]
  }, {
    validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate', 90)]
  });

  isLoading = false;
  //
  columns = COLUMNS_TRANSACTIONS;
  config = {
    filterDefault: 'status|eq|IN_PROCESS',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: true,
    hasPaging: true
  }
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  //

  constructor(
    public matdialog: MatDialog,
    private waterService: WaterService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private handleErrorService: HandleErrorService
  ) {
    if (handleBackRouter.handleValueFormSearch(this.router, "valueFormSearchEditCancel", this.formSearch)) {
      this.search();
    }
  }

  ngOnInit() {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tại quầy');
  }

  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  search(): any {
    const valueForm = this.formSearch.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    const searchCondition = [
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('statusTransaction').value
      },
      {
        property: 'customerId',
        operator: 'eq',
        value: this.formSearch.get('customerId').value.trim()
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: valueForm.fromDate ? fromDate : ''
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: valueForm.toDate ? toDate : ''
      }
    ];
    this.searchConditions = searchCondition;
    handleBackRouter.setItemStorageForm("valueFormSearchEditCancel", this.formSearch);
  }

  editTransaction(row) {
    if (row["statusCode"] !== "IN_PROCESS") {
      this.handleErrorService.openMessageError("Không sửa được giao dịch ở trạng thái đã duyệt !");
      return;
    }
    this.router.navigate(["edit"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }

  viewTransaction(row) {
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }

  cancelTransaction(row) {
    if (row["statusCode"] !== "IN_PROCESS") {
      this.handleErrorService.openMessageError("Không xóa được giao dịch ở trạng thái đã duyệt !");
      return;
    }
    let message = "Bạn có chắc chắn muốn xóa giao dịch này ?"
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "cancel", text: message, title: "Xác nhận", btnOk: { text: "Xác nhận", class: "btn-danger" }, btnCancel: { text: "Quay lại", class: "btn-secondary" } }, hasBackdrop: true, disableClose: true, backdropClass: "bg-none"
    })

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.deleteRow(row);
      }
    })
  }

  deleteRow(row) {
    this.isLoading = true;
    let body = {
      rejectTransList: [
        {
          lastModifiedDate: row["lastModifiedDate"],
          transactionId: row["id"]
        }
      ]
    }
    this.waterService.cancelTransaction(body).toPromise().then(res => {
      this.search();
      this.openMessageSuccess(row)
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  openMessageSuccess(row) {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "ok", text: "Xóa giao dịch thành công !", title: "Thành công", btnOk: { text: "Giao dịch khác", class: "btn-success" } }, backdropClass: "bg-none", position: { top: "0px", right: "0px" }
    })
    dialog.afterClosed().subscribe(res => {

    })
  }

}
