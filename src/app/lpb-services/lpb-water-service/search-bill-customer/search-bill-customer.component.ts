import { Component, OnInit } from '@angular/core';
import {COLUMNS_BILLS_CREATE} from '../shared/constants/water.constant';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {WaterService} from '../shared/services/water.service';
import {HandleErrorService} from '../shared/services/handleError.service';
import {forkJoin} from 'rxjs';
import {ultis} from '../../../shared/utilites/function';
import {IListBillInfo} from '../shared/models/water.interface';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {PaymentPeroidType, PaymentType} from '../../../shared/enums/PaymentType';

@Component({
  selector: 'app-search-bill-customer',
  templateUrl: './search-bill-customer.component.html',
  styleUrls: ['./search-bill-customer.component.scss']
})
export class SearchBillCustomerComponent implements OnInit {
  formSearch = this.fb.group({
    supplierCode: [null, Validators.required],
    customerId: ['', Validators.required],
  });
  dataSource: IListBillInfo[] = [];
  searched = false;
  isLoading = false;
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hiddenActionColumn: true,
    hasPaging: false
  };
  columns =  [
    {
      headerName: 'Tên Khách Hàng',
      headerProperty: 'custName',
      headerIndex: 3,
      className: 'w-200-px',
    },
    {
      headerName: 'Địa Chỉ',
      headerProperty: 'custDesc',
      headerIndex: 4,
      className: 'w-300-px',
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'settledAmount',
      headerIndex: 5,
      type: 'currency',
      className: 'w-100-px',
    },
    {
      headerName: 'Kỳ Thanh Toán',
      headerProperty: 'billPeriod',
      headerIndex: 6,
      className: 'w-200-px',
    },
  ];
  constructor(
    public matdialog: MatDialog,
    private router: Router,
    private waterService: WaterService,
    private fb: FormBuilder,
    private handleErrorService: HandleErrorService
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  async search() {
    if (this.formSearch.invalid) {
      this.formSearch.markAllAsTouched();
      return;
    }
    this.searched = false;
    this.isLoading = true;
    const params = {
      customerId: this.formSearch.value.customerId.trim(),
      serviceType: 'WATER_SERVICE',
      supplierCode: this.formSearch.value.supplierCode.trim(),
    };

    forkJoin([
      // this.waterService.getSupplierFromCode(this.formSearch.value.supplierCode),
      this.waterService.getBills(
        params.customerId,
        params.serviceType,
        params.supplierCode
      ),
    ])
      .toPromise()
      .then((res) => {
        // const supplier = res[0].data;
        // this.supplierFormGroups = supplier.supplierFormGroups;
        // if (this.checkRules()) {
        //   return;
        // }
        // this.setRuleConfig();
        //
        const bills = res[0].data;
        let dataSource = bills[0].listBillInfo;
        dataSource = dataSource.map((x) => {
          return {
            ...x,
            billYearMonth: `${x.billCode}/${ultis.formatDay(x.billId)}`,
            billPeriod: `Tháng ${x.billId}/${x.billCode}`,
            custName: bills[0].customerInfo.custName,
            custDesc: bills[0].customerInfo.custDesc,
          };
        });
        this.dataSource = dataSource;
        //
        // this.customerInfo = bills[0]['customerInfo'];
        // this.settleAccountInfo = bills[0]['settleAccountInfo'][0];
        // this.paymentContentStart = bills[0]['prefix'];
        // this.searched = true;
        // setTimeout(() => {
        //   this.paymentInfo.formPayment.patchValue({
        //     accountNumberCredit: this.settleAccountInfo['settleAcNo'],
        //     accountNameCredit: this.settleAccountInfo['settleAcDesc'],
        //   });
        // });
      })
      .catch((err) => {
        this.handleErrorService.handleError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  infoSearchChange(): void {
    this.searched = false;
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }
}
