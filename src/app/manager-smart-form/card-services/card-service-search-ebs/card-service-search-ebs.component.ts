import { Component, OnInit } from '@angular/core';
import {CardEbsInfo, CardSearchInfo} from '../shared/models/card-inssuance';
declare var $: any;

@Component({
  selector: 'app-card-service-search-ebs',
  templateUrl: './card-service-search-ebs.component.html',
  styleUrls: ['./card-service-search-ebs.component.scss']
})
export class CardServiceSearchEbsComponent implements OnInit {
  cardSelectedSearch: CardSearchInfo;
  cardEbsInfoSelected: CardEbsInfo;
  cardInfoDetail: any;
  acctionView: string;
  acctionCode: string;
  constructor() { }
  readonly STEP = {
    HOME: 'HOME',
    DETAIL: 'DETAIL',
    CREATE: 'CREATE'
  };

  step: string = this.STEP.HOME;
  ngOnInit(): void {
    $('.parentName').html('Dịch vụ Hỗ trợ thẻ');
    $('.childName').html('Tìm kiếm danh sách yêu cầu');
  }

  showStepDetail(evt): void {
    this.cardSelectedSearch = evt.cardInfo;
    this.cardEbsInfoSelected = evt.cardEbsInfo;
    this.acctionView = evt.acctionView;
    this.cardInfoDetail = evt.detailedList;
    this.step = this.STEP.DETAIL;
  }

  showStepDetail2(evt): void {
    this.cardSelectedSearch = evt.cardInfo;
    this.cardEbsInfoSelected = evt.cardEbsInfo;
    this.acctionView = evt.acctionView;
    this.cardInfoDetail = evt.detailedList;
    this.acctionCode = evt.acctionCode;
    this.step = this.STEP.DETAIL;
  }

  showStepCreate(): void {
    this.step = this.STEP.CREATE;
  }

  backToSearch(): void {
    this.step = this.STEP.HOME;
  }
}
