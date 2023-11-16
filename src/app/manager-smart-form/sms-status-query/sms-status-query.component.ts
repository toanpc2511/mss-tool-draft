import { Component, OnInit } from '@angular/core';
import {LvbisService} from '../../lpb-services/lpb-water-service/shared/services/lvbis.service';
import {NotificationService} from '../../_toast/notification_service';
import {SmsService} from '../../_services/sms/sms.service';
declare var $: any;
@Component({
  selector: 'app-sms-status-query',
  templateUrl: './sms-status-query.component.html',
  styleUrls: ['./sms-status-query.component.scss']
})
export class SmsStatusQueryComponent implements OnInit {

  lstResult = [];
  txtSearch = '';

  constructor(
    private lvbisService: SmsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    $('.parentName').html('Dịch vụ LVBIS');
    $('.childName').html('Truy vấn trạng thái SMS');
  }

  searchResult(): void {
    if (this.txtSearch.trim() === '') {
      return;
    }
    this.lvbisService.searchSmsNotiStatus(this.txtSearch).subscribe(res => {
        if (res) {
          this.lstResult = res;
          // console.log(this.lstResult);
        } else {
          this.lstResult = [];
        }
      },
      error => {
        this.lstResult = [];
        this.notificationService.showError('Đã có lỗi xảy ra, vui lòng thử lại.', 'Thông báo');
      });
  }

}
