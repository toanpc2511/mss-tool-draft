import { Component, OnInit } from '@angular/core';
import {CardEbsInfo, CardSearchInfo} from '../shared/models/card-inssuance';
declare var $: any;

@Component({
  selector: 'app-card-lost-damaged-request',
  templateUrl: './card-lost-damaged-request.component.html',
  styleUrls: ['./card-lost-damaged-request.component.scss']
})
export class CardLostDamagedRequestComponent implements OnInit {
  cardSelectedSearch: CardSearchInfo;
  cardEbsInfoSelected: CardEbsInfo;
  constructor() { }
  readonly STEP = {
    HOME: 'HOME',
    DETAIL: 'DETAIL'
  };
  step: string = this.STEP.HOME;
  ngOnInit(): void {
    $('.parentName').html('Dịch vụ Hỗ trợ thẻ');
    $('.childName').html('Báo mất hỏng thẻ');
  }

  showStepDetail(evt): void {
    this.cardSelectedSearch = evt.cardInfo;
    this.cardEbsInfoSelected = evt.cardEbsInfo;
    this.step = this.STEP.DETAIL;
  }

  backToSearch(): void {
    this.step = this.STEP.HOME;
  }
}
