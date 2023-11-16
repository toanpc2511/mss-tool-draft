import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-popup-detail-authority',
  templateUrl: './popup-detail-authority.component.html',
  styleUrls: ['./popup-detail-authority.component.scss']
})
export class PopupDetailAuthorityComponent implements OnInit, OnChanges {
  @Input() authorityId;
  authorityDetail: any;
  limitAmount = '';
  freeText = '';
  customerInfo: any;
  processId = '';
  accountDetail: any;
  accountId: any;
  constructor(private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDetailAuthority();
    this.getProcessDetail();
    this.getProcessIdFromUrl();
  }

  ngOnInit(): void {
    this.getDetailAuthority();
    this.getProcessDetail();
    this.getProcessIdFromUrl();
  }

  getAccountDetail(accountId: string): void {
    const body = {
      id: accountId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/account/account/detail',
      data: body,
      process: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.accountDetail = res.item;
        }
      }
    });
  }

  getProcessIdFromUrl(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.missionService.setProcessId(this.processId);
  }

  getProcessDetail(): void {
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
          // Nếu có res (có giá trị response BE trả về và success === true)
          if (res && res.responseStatus.success) {
            this.customerInfo = res.item.customer;
          }
        }
      }
    );
  }

  getDetailAuthority(): void {
    const body = {
      id: this.authorityId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/account/accountAuthor/detail',
      data: body,
      process: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.authorityDetail = res.item;
          this.authorityDetail.authorTypes.forEach(el => {
            if (el.authorTypeCode === 'ALL' || el.authorTypeCode === 'DEPOSIT_AND_WITHDRAW') {
              this.limitAmount = el.limitAmount ? el.limitAmount : '';
            }
            if (el.authorTypeCode === 'OTHER') {
              this.freeText = el.authorTypeFreeText ? el.authorTypeFreeText : '';
            }
          });
          this.getAccountDetail(this.authorityDetail.accountId);
        }
      }
    });
  }
}
