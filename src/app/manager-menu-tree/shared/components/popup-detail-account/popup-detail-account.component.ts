import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-popup-detail-account',
  templateUrl: './popup-detail-account.component.html',
  styleUrls: ['./popup-detail-account.component.scss']
})
export class PopupDetailAccountComponent implements OnInit, OnChanges {
  @Input() accountId ;
  accountInfo: any;


  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private _LOCATION: Location,
    private missionService: MissionService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
      this.getAccountDetail();
  }

  ngOnInit(): void {

  }

  getAccountDetail(): void {
    const body = {
      id: this.accountId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/account/account/detail',
      data: body,
      process: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
           this.accountInfo = res.item;
        }
      }
    });
  }
}
