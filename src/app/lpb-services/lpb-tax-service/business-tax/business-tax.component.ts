import { Component, OnInit } from '@angular/core';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-business-tax',
  templateUrl: './business-tax.component.html',
  styleUrls: ['./business-tax.component.scss']
})
export class BusinessTaxComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán dịch vụ thuế',
      'Thuế doanh nghiệp',
      'Chi tiết'
    ]);
  }

}
