import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HTTPMethod } from 'src/app/shared/constants/http-method';

import { HelpsService } from 'src/app/shared/services/helps.service';


@Component({
  selector: 'app-rc-list-customer',
  templateUrl: './rc-list-customer.component.html',
  styleUrls: ['./rc-list-customer.component.scss']
})
export class RcListCustomerComponent implements OnInit {

  customers = [];

  constructor(private helpService: HelpsService) { }

  ngOnInit(): void {
    this.customers = [
      { fullName: 'thanh', identifyDate: '2012-12-12', identifyAddress: 'ĐKQL CƯ TRÚ VÀ DLQG VỀ DÂN CƯ', branch: 'CHI NHANH THUONG TIN' },
      { fullName: 'abc', identifyDate: '2012-12-12', identifyAddress: 'qbvvvvv', branch: 'CHI NHANH THUONG TIN' },
      { fullName: 'xyz', identifyDate: '2012-12-12', identifyAddress: 'abc', branch: 'CHI NHANH THUONG TIN' },
      { fullName: 'mkn', identifyDate: '2012-12-12', identifyAddress: 'ab11c', branch: 'CHI NHANH THUONG TIN' }
    ]
    this.getListCustomer();
  }

  getListCustomer(callBack?: any): void {
    const body = {
      cif: "",
      phone: "0979894779",
      uidName: "",
      uidValue: "",
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            // console.log(res)
          }
        }
      }
    );
  }

}
