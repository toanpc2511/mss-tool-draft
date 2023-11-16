import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { cifCategoryOption } from 'src/app/shared/constants/cif/cif-constants';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-popup-detail-cif',
  templateUrl: './popup-detail-cif.component.html',
  styleUrls: ['./popup-detail-cif.component.scss']
})
export class PopupDetailCifComponent implements OnInit {

  @Input() processId = '';
  // biến bật tắt popup
  isMis = false;
  isUdf = false;
  isReference = false;
  isLegal = false;
  isCoOwner = false;
  isGuardian = false;
  isShowPopupApprove = false;
  isShowConfirmPopupDelete = false;
  // biến hứng dữ liệu trả ra từ api
  objCifDetail: any;
  objPerson: any;
  objMis: any;
  objUdf: any;
  objCifLienQuan: any;
  objCustomerOwnerBenefit: any;
  objGuardian: any;
  objLegal: any;
  cifLienQuan = [];
  customerOwnerBenefit = [];
  guardianList = [];
  legalList = [];
  msgReference = '';
  msgGuardian = '';
  msgOwnerBenefit = '';
  msgLegal = '';
  inEffectGudian = false;
  inEffectReference = false;

  // biến gửbii Duyệt
  customerId;
  process;
  idCustomer = '';

  constructor(
    private helpService: HelpsService,
    private missionService: MissionService
  ) {
  }

  ngOnInit(): void {
    this.getDetailCif();
  }

  /**
   * bật tắt popup
   */
  showMis(): void { this.isMis = true; }
  showUdf(): void { this.isUdf = true; }
  showReference(): void { this.isReference = true; }
  showLegal(): void { this.isLegal = true; }
  showCoOwner(): void { this.isCoOwner = true; }
  showGuardian(): void { this.isGuardian = true; }
  closeMis(): void { this.isMis = false; }
  closeUdf(): void { this.isUdf = false; }
  closeReference(): void { this.isReference = false; }
  closeLegal(): void { this.isLegal = false; }
  closeCoOwner(): void { this.isCoOwner = false; }
  closeGuardian(): void { this.isGuardian = false; }
  /**
   * lấy chi tiết cif
   */
  getDetailCif(): void {
    if (!this.processId) { return; }
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
          if (res && res.item) {
            // console.log('chi tiết', res);
            this.missionService.setProcessId(this.processId);
            this.objCifDetail = res.item.customer;
            this.objPerson = res.item.customer.person;
            this.objMis = res.item.customer.mis;
            this.objUdf = res.item.customer.udf;
            this.cifLienQuan = res.item.customer.cifLienQuan;
            this.customerOwnerBenefit = res.item.customer.customerOwnerBenefit;
            this.guardianList = res.item.customer.guardianList;
            this.legalList = res.item.customer.legalList;
            this.objCifLienQuan = res.item.customer.cifLienQuan.length >= 0 ? res.item.customer.cifLienQuan[0] : '';
            this.objCustomerOwnerBenefit = res.item.customer.customerOwnerBenefit.length >= 0 ? res.item.customer.customerOwnerBenefit[0] : '';
            this.objGuardian = res.item.customer.guardianList.length >= 0 ? res.item.customer.guardianList[0] : '';
            this.objLegal = res.item.customer.legalList.length >= 0 ? res.item.customer.legalList[0] : '';
            this.process = res;
            this.inEffectGudian = this.objGuardian?.inEffect;
            this.inEffectReference = this.objCifLienQuan?.inEffect;
            this.idCustomer = res.item.customer.id;
            this.initMsgInfoData();
          }
        }
      }
    );
  }

  // tslint:disable-next-line:ban-types
  initMsgInfoData(): void {
    const msg = 'Chưa có dữ liệu nhập vào.';
    this.msgGuardian = this.msgLegal = this.msgOwnerBenefit = this.msgReference = msg;
    if (this.cifLienQuan.length > 0) {
      this.msgReference = '';
    }
    if (this.customerOwnerBenefit.length > 0) {
      this.msgOwnerBenefit = '';
    }
    if (this.guardianList.length > 0) {
      this.msgGuardian = '';
    }
    if (this.legalList.length > 0) {
      this.msgLegal = '';
    }
  }
  /**
   * xem từng phần tử trong bảng
   */
  getObjectCifLienQuan(evt): void { this.objCifLienQuan = evt; }
  getObjectCustomerOwnerBenefit(evt): void { this.objCustomerOwnerBenefit = evt; }
  getObjectGuard(evt): void { this.objGuardian = evt; }
  getObjectLegal(evt): void { this.objLegal = evt; }

}
