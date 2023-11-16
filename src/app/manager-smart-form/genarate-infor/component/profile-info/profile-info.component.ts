import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { Process } from 'src/app/_models/process/Process';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  processId: string;
  process: Process = new Process();
  @Output() detail = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.getProcessInformation();
  }
  /**
   * lấy chi tiết hồ sơ
   */
  getProcessInformation(): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    const body = {
      id: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.process.item = res.item;
            const bodyDetail = {
              statusCode: this.process.item.statusCode ? this.process.item.statusCode : '',
              processId: this.processId,
              customerCode: this.process.item.customerCode ? this.process.item.customerCode : null,
              createdByUser: this.process.item.createdByUser,
              createdBy: this.process.item.createdBy
            };
            this.detail.emit(bodyDetail);
          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
        }
      }
    );
  }
}
