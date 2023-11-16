import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
import { COLUMNS_TRANSACTIONS, STATUS_TRANSACTION } from '../../shared/constants/tuition.constant';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { TuitionService } from '../../shared/services/tuition.service';

import {
  ICustomerInfo,
  IFilterCreatePayment,
  IListBillInfo,
  IRuleResponses,
  ISchool,
  ISettleAccountInfo,
  ISupplierFormGroups,
  ITranPost,
  ITransaction
} from '../../shared/models/tuition.interface';

declare var $: any;

@Component({
  selector: 'app-tuition-edit-cancel-transaction',
  templateUrl: './tuition-edit-cancel-transaction.component.html',
  styleUrls: ['./tuition-edit-cancel-transaction.component.scss']
})
export class TuitionEditCancelTransactionComponent implements OnInit {

  statusTransactions = STATUS_TRANSACTION;
  formSearch = this.fb.group({
    univerCode: [null],
    studentCode: [""],
    statusTransaction: [this.statusTransactions[0]["value"]]
  })

   dataSource: ITransaction[] = [];
   schoolSource: ISchool[];
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

  constructor(public matdialog: MatDialog,
    private tuitionService: TuitionService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private handleErrorService: HandleErrorService) {
  }

  ngOnInit() {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Nộp học phí');
    $('.childName').html('Thanh toán tại quầy');

    this.tuitionService
    .getListUniversityActive()
    .pipe()
    .subscribe((res) => {      
      if (res.data) {        
        this.schoolSource = res.data;   
      }
    });
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  search(): any {

    const searchCondition = [
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('statusTransaction').value
      },
      {
        property: 'universityCode',
        operator: 'eq',
        value: this.formSearch.get('univerCode').value
      },
      {
        property: 'studentCode',
        operator: 'eq',
        value: this.formSearch.get('studentCode').value
      },
    ];
    this.searchConditions = searchCondition;

    // this.isLoading = true;
    //this.tuitionService
    //.getTransaction(this.formSearch.get('statusTransaction').value, this.formSearch.get('schoolCode').value,this.formSearch.get('studentCode').value.trim())
    // .pipe()
    // .subscribe((res) => {
    //   if (res.data) {
    //    let transactions = res['data'];
    //    let dataSource = transactions;
    //    this.dataSource = dataSource;
    //   }
    // });
    //  this.isLoading = false;
  }

  // editTransaction(row) {
  //   if (row["statusCode"] !== "IN_PROCESS") {
  //     this.handleErrorService.openMessageError("Không sửa được giao dịch ở trạng thái đã duyệt !");
  //     return;
  //   }
  //   this.router.navigate(["edit"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  // }

  viewTransaction(row) {
    let status_ht = '';

     if(row["accountingStatusCode"] === 'TIMEOUT')
     {
       status_ht = 'TIMEOUT';
     }
     else
     {
       status_ht = row["statusCode"];
     }

    //status_ht = row["accountingStatusCode"];

    let myQueryParams = [
      { id: row["id"], status: status_ht }     
  ];

    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["id"], status: status_ht, } });
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
          transID: row["id"]       
    }
    this.tuitionService.cancelTransaction(body).toPromise().then(res => {
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
