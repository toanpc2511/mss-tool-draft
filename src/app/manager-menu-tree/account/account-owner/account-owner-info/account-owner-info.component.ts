import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-account-owner-info',
  templateUrl: './account-owner-info.component.html',
  styleUrls: ['./account-owner-info.component.scss']
})
export class AccountOwnerInfoComponent implements OnInit, OnChanges {

  @Input()
  processId: string;
  objectCustomerInfo: any = {};
  @Output() processDetail = new EventEmitter<object>();

  constructor(
    private helpService: HelpsService,
    private missionService: MissionService

  ) { }

  // tslint:disable-next-line:typedef
  ngOnChanges() {
    this.getCustomerInfo();
  }
  ngOnInit(): void {
  }

  getCustomerInfo(): void {
    this.missionService.setProcessId(this.processId);
    if (this.processId) {
      const body = {
        id: this.processId
      };
      this.helpService.callApi({
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.objectCustomerInfo = res.item;
            this.processDetail.emit(this.objectCustomerInfo);
          }
        }
      });
    }
  }
}
