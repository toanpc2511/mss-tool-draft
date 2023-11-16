import { Component, OnInit } from '@angular/core';
import {EbsServicesApproveObject} from '../shared/models/card-services-approve';
declare var $: any;

@Component({
  selector: 'app-card-services-approve',
  templateUrl: './card-services-approve.component.html',
  styleUrls: ['./card-services-approve.component.scss']
})
export class CardServicesApproveComponent implements OnInit {
  readonly STEP = {
    HOME: 'HOME',
    DETAIL: 'DETAIL'
  };
  step: string = this.STEP.HOME;
  cardEbsServiceSelected: EbsServicesApproveObject;
  actionSelected = '';
  view: string;
  constructor() { }

  ngOnInit(): void {
    $('.parentName').html('Dịch vụ Hỗ trợ thẻ');
    $('.childName').html('Phê duyệt dịch vụ thẻ');
  }

  showStepDetail(evt): void {
    this.cardEbsServiceSelected = evt.selectedItem;
    this.view = evt.view;
    this.step = this.STEP.DETAIL;
  }

  backToSearch(): void {
    this.step = this.STEP.HOME;
  }

}
