import { Component, OnInit } from '@angular/core';
import { HelpsService } from '../../shared/services/helps.service';
import { ActivatedRoute } from '@angular/router';
import { HTTPMethod } from '../../shared/constants/http-method';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { MatDialog } from '@angular/material/dialog';
import { RegistrableService } from 'src/app/_models/registrable-service';
import { PopUpSendServiceComponent } from '../sendForApproval/pop-up/pop-up-send-service/pop-up-send-service.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ProcessItem } from 'src/app/_models/process/ProcessItem';
import { ResponseStatus } from 'src/app/_models/response';
import { NotificationService } from 'src/app/_toast/notification_service';
import { MissionService } from '../../services/mission.service';
import { Location } from '@angular/common';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;

@Component({
  selector: 'app-send-apporve',
  templateUrl: './send-apporve.component.html',
  styleUrls: ['./send-apporve.component.scss']
})
export class SendApporveComponent implements OnInit {
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  tabIndex = 1;
  processDetail: any;
  processId: any;
  tableDetail: any;
  listSaved = [];
  listPending = [];
  listWaiting = [];
  listApproved = [];
  listRefuse = [];
  userId: string;
  listPendingCount: any;
  listSavedCount: any;
  listWaitingCount: any;
  listRefuseCount: any;
  listApprovedCount: any;
  response: ResponseStatus;
  customerCode = '';
  processItem = new ProcessItem();
  isCustomer = false;
  isCustomerSelect = '';
  isShowPopupCustomerDetail = false;
  isShowPopupAccountDetail = false;
  isAccount = false;
  isAuthority = false;
  isSignature = false;
  accountId: any;
  dwItemId: any;
  authorityId: any;
  isMainCard = false;
  isSupCard = false;
  cardId: any;
  signatureId: any;
  isAttachment = false;
  attachmentId: any;
  // biến check quyền
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  isAccountOwner = false;
  ownerId: any;
  isLienViet24 = false;
  lienViet24Id: any;
  statusCode: any;
  createdBy: any;
  branchCode: any;
  userInfo: any;
  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private missionService: MissionService,
    private _LOCATION: Location
  ) {
  }
  ngOnInit(): void {
    $('.childName').html('Gửi duyệt');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userId = this.userInfo.userId;
    // Hàm lấy giá trị param từ url
    this.route.paramMap.subscribe(params => {
      this.processId = params.get('processId');
      // Nếu có giá trị processId thì mới call function lấy thông tin Khách hàng
      if (this.processId) {
        this.missionService.setProcessId(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }
  showDetailLienViet24(lienViet24Id): void {
    this.isLienViet24 = true;
    this.lienViet24Id = lienViet24Id;
  }


  showDetailSignature(signatureId): void {
    this.isSignature = true;
    this.signatureId = signatureId;
  }

  showDetailAttachment(attachmentId): void {
    this.isAttachment = true;
    this.attachmentId = attachmentId;
  }

  showDetailAuthority(authorityId): void {
    this.isAuthority = true;
    this.authorityId = authorityId;
  }

  showDetailAccount(accountId): void {
    this.isAccount = true;
    this.accountId = accountId;
    this.isShowPopupAccountDetail = true;
  }

  showAccountOwner(owner): void {
    this.isAccountOwner = true;
    if (owner.typeCode === 'PCO') {
      this.ownerId = owner.dwItemIds;
    }
    if (owner.typeCode === 'COOWNER') {
      this.ownerId = owner.dwItemId;
    }

  }

  getCustomerInfo(processId: any): void {
    const body = {
      id: processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/detail',
      data: body,
      progress: false,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.processDetail = res.item;
          this.customerCode = res.item.customerCode;
          this.statusCode = res.item.statusCode;
          this.createdBy = res.item.createdBy;
          this.processList();
        }
      }
    });
  }

  backPage(): void {
    this._LOCATION.back();
  }

  getTableInfo(processId: any): void {
    const body = {
      processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/processIntegrated/listAll',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.tableDetail = res.items;

        }
        this.getCustomerInfo(this.processId);
      }
    });
  }

  processList(): void {
    // tslint:disable-next-line:no-shadowed-variable
    this.listPending = [];
    this.listSaved = [];
    this.listWaiting = [];
    this.listRefuse = [];
    this.listApproved = [];
    this.listPendingCount = 0;
    this.listSavedCount = 0;
    this.listWaitingCount = 0;
    this.listRefuseCount = 0;
    this.listApprovedCount = 0;
    this.tableDetail.forEach((element) => {
      element.isSendApprove = false;
      // cùng chi nhánh được gửi duyệt
      if (element.branchCode === this.userInfo.branchCode || element.branchCode === null) {
        element.isSendApprove = true;
      }
      // hồ sơ pending
      if (this.createdBy !== this.userId) {
        element.isSendApprove = false;
      }
      if (element.statusCode === 'W') {
        this.listPending.push(element);
        this.listPendingCount = this.listPending.length;
        // console.log(this.listPendingCount);
      } else if (element.statusCode === 'E') {
        this.listSaved.push(element);
        this.listSavedCount = this.listSaved.length;
      } else if (element.statusCode === 'M') {
        this.listWaiting.push(element);
        this.listWaitingCount = this.listWaiting.length;
      } else if (element.statusCode === 'R') {
        this.listRefuse.push(element);
        this.listRefuseCount = this.listRefuse.length;
      } else if (element.statusCode === 'S') {
        this.listApproved.push(element);
        this.listApprovedCount = this.listApproved.length;
      }
    });
    this.switchTab();
  }

  switchTab(): void {
    if (this.listSaved.length === 0 && this.listPending.length !== 0) {
      this.tabIndex = 2;
    } else if (this.listSaved.length === 0 && this.listPending.length === 0 && this.listWaiting.length !== 0) {
      this.tabIndex = 3;
    } else if (this.listSaved.length === 0 && this.listPending.length === 0
      && this.listWaiting.length === 0 && this.listApproved.length !== 0) {
      this.tabIndex = 4;
    } else if (this.listSaved.length === 0 && this.listPending.length === 0
      && this.listWaiting.length === 0 && this.listApproved.length === 0 && this.listRefuse.length !== 0) {
      this.tabIndex = 5;
    } else {
      this.tabIndex = 1;
    }
  }

  sendApprovableOne(id, note: string): void {
    const body: any = {
      id,
      note
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendApproveOne',
      data: body,
      progress: true,
      success: (res) => {
        // console.log(res);
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Gửi duyệt hồ sơ thành công', 'Thành công');
          this.tabIndex = 2;
        } else {
          this.notificationService.showError('Gửi duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.getTableInfo(this.processId);
      }
    });
  }

  sendApproveOne(service: RegistrableService): void {
    const dialogRef = this.dialog.open(PopUpSendServiceComponent, DialogConfig.configDialogConfirm({ number: 26 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendApprovableOne(service.id, rs.note);
      }
    });
  }
  /* Các bước thực hiện hiển thị dịch vụ
  Bước 1: Viết function lấy danh sách dịch vụ (gán listService)
  Bước 2: Cách đơn giản là tạo 5 danh sách: Danh sách chờ duyệt, danh sách bổ sung, .... => tạo được danh sách theo từng tab
  Bước 3: for bên html để vẽ ra bảng
  * */

  checkIndex(num: number): void {
    this.tabIndex = num;
  }

  showDetailCustomer(processId): void {
    this.isCustomerSelect = processId;
  }

  showDetailCif(processId): void {
    this.isCustomer = true;
    this.processId = processId;
  }

  showDetailMainCard(cardId): void {
    this.isMainCard = true;
    this.cardId = cardId;
  }
  showDetaiSubCard(cardId): void {
    this.isSupCard = true;
    this.cardId = cardId;
  }

}
