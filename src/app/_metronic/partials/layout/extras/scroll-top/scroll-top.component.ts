import { Component, AfterViewInit } from '@angular/core';
import KTLayoutScrolltop from '../../../../../../assets/js/layout/extended/scrolltop';
import { KTUtil } from '../../../../../../assets/js/components/util';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    KTUtil.ready(() => {
      // Init Scrolltop
      KTLayoutScrolltop.init('kt_scrolltop');
    });
  }
}
