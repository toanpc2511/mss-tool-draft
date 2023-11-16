import { Component, OnInit } from '@angular/core';
import {CustomerInfo} from '../shared/models/card-update-phone-number';
declare var $: any;

@Component({
  selector: 'app-card-request-update-phone-number',
  templateUrl: './card-request-update-phone-number.component.html',
  styleUrls: ['./card-request-update-phone-number.component.scss']
})
export class CardRequestUpdatePhoneNumberComponent implements OnInit {
  readonly STEP = {
    HOME: 'HOME',
    DETAIL: 'DETAIL'
  };
  step: string = this.STEP.HOME;
  selectedCustomer: CustomerInfo;
  constructor() { }

  ngOnInit(): void {
    $('.parentName').html('Hỗ trợ thẻ');
    $('.childName').html('Cập nhật số điện thoại SVBO');
  }

  showStepDetail(customer): void {
    this.selectedCustomer = customer;
    this.step = this.STEP.DETAIL;
  }

  backToSearch(): void {
    this.selectedCustomer = null;
    this.step = this.STEP.HOME;
  }
}
