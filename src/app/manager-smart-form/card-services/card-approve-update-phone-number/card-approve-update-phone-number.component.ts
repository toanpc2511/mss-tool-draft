import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-card-approve-update-phone-number',
  templateUrl: './card-approve-update-phone-number.component.html',
  styleUrls: ['./card-approve-update-phone-number.component.scss']
})
export class CardApproveUpdatePhoneNumberComponent implements OnInit {
  readonly STEP = {
    HOME: 'HOME',
    DETAIL: 'DETAIL'
  };
  step: string = this.STEP.HOME;

  constructor() { }

  ngOnInit(): void {
    $('.parentName').html('Hỗ trợ thẻ');
    $('.childName').html('Phê duyệt cập nhật số điện thoại SVBO');
  }

  showStepDetail(customer): void {
    // this.selectedCustomer = customer;
    this.step = this.STEP.DETAIL;
  }

  backToSearch(): void {
    // this.selectedCustomer = null;
    this.step = this.STEP.HOME;
  }

}
