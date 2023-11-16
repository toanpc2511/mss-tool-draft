import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovableProcess, Process } from '../../_models/process';
import { CifCondition } from '../../_models/cif';
import { ProcessService } from '../../_services/process.service';
import { ApprovalCifService } from '../../_services/approval-cif.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { RegistrableService } from '../../_models/registrable-service';
import { PopupConfirmComponent } from '../../_popup/popup-confirm.component';
import { DialogConfig } from '../../_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { ResponseStatus } from '../../_models/response';
import { MissionService } from '../../services/mission.service';
import { Location } from '@angular/common';
import { PopupHistoryProcessComponent } from '../../_popup/popup-history-process/popup-history-process.component';
import { ProcessItem } from '../../_models/process/ProcessItem';
import { PopUpSendServiceComponent } from './pop-up/pop-up-send-service/pop-up-send-service.component';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { PopUpMaincardComponent } from '../service-browsing/pop-up/pop-up-maincard/pop-up-maincard/pop-up-maincard.component';

declare var $: any;

@Component({
  selector: 'app-send-for-approval.component',
  templateUrl: './send-for-approval.component.html',
  styleUrls: ['./send-for-approval.component.scss']
})
export class SendForApprovalComponent implements OnInit {
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  processId: string;
  process: Process = new Process();
  serviceLst: RegistrableService[];
  messageCif: string;
  response: ResponseStatus;
  processItem = new ProcessItem();
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  userId: string;
  intergratedId: string;
  serviceId: string;
  idSelected = '';
  idSupCardSelected = '';
  isAccountSelected = '';
  isCustomerSelect = '';
  isEbankingSelect = '';
  isShowPopupDetail = false;
  isShowPopupDetailSubCard = false;
  isShowPopupDetailAccount = false;
  isShowPopupCustomerDetail = false;
  isShowPopupEbankingDetail = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private cifService: ProcessService,
    private approvalCifService: ApprovalCifService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private _LOCATION: Location) {
  }

  ngOnInit(): void {
    $('.childName').html('Gửi duyệt');
    this.route.paramMap.subscribe(paramMap => this.getApprovalInformation(paramMap.get('processId')));
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.userId = JSON.parse(localStorage.getItem('userInfo')).userId;
    // console.log('userId', this.userId);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
  }
  getApprovalInformation(processId: string): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      // thong tin ho so
      this.getProcessInformation(processId);
      // danh sach dich vu dang ky
      this.getRegistrableService(processId);
    }
  }
  backPage(): void {
    //  $('.childName').html('Danh sách tài khoản')
    this._LOCATION.back();
  }

  getProcessInformation(processId: string): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      const condition = new CifCondition();
      condition.id = processId;
      this.cifService.detailProcess(processId).subscribe(data => {
        this.processItem = data.item;
        // console.log('abcs', this.processItem);
        if (!this.processItem) {
          this.errorHandler.showError('Không lấy được thông tin hồ sơ');
        }
      },
        error => {
          this.errorHandler.showError(error);
        }
      );
    }
  }

  getRegistrableService(processId: string): void {
    this.approvalCifService.getRegistrableServiceList(processId).subscribe(
      data => {
        if (data && data.items && data.responseStatus.success === true) {
          this.response = data.responseStatus;
          this.serviceLst = data.items.map(service => new RegistrableService(service));
          // console.log('nữa nè', this.serviceLst);
        } else if (data.responseStatus.success === false) {
          this.response = data.responseStatus;
        }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        if (this.response.success === false) {
          this.errorHandler.showError('Không có danh sách dịch vụ');
        }
      }
    );
  }

  // tslint:disable-next-line:typedef
  sendApprovableOne(id: string, note?: string, userId?: string) {
    return this.approvalCifService.sendApproveOne({id, note, userId}).subscribe(
      data => {
        if (data.success && data.success === true) {
          this.response = data;
          this.missionService.setMission('Thông tin duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.response = data;
        }
        this.getProcessInformation(this.processId);
        this.getRegistrableService(this.processId);
        // console.log('sssszzz', data);
        this.errorHandler.messageHandler(this.response, 'Gửi duyệt hồ sơ thành công');
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  sendApproveOne(service: RegistrableService): void {
    const dialogRef = this.dialog.open(PopUpSendServiceComponent, DialogConfig.configDialogConfirm({ number: 26}));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendApprovableOne(service.dwItemId, rs.note, this.userId);
        this.getProcessInformation(this.processId);
      }
    });
  }
  // tslint:disable-next-line:typedef
  closeApprovableProcess(processId: string) {
    this.missionService.setLoading(true);
    return this.approvalCifService.inputterClose(new ApprovableProcess(processId)).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
        } else if (data && data.success === false) {
          this.response = data;
        } else {
          this.errorHandler.showError('Có lỗi xảy ra');
        }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Đóng hồ sơ thành công');
        this.getProcessInformation(this.processId);
      }
    );
  }

  deleteApprovableProcess(processId: string): any {
    this.missionService.setLoading(true);
    return this.cifService.deleteProcess(processId).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus;
        } else if (data.responseStatus && data.responseStatus.success === false) {
          this.response = data.responseStatus;
        } else {
          this.errorHandler.showError('Có lỗi xảy ra');
        }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Xóa hồ sơ thành công');
        this.getProcessInformation(this.processId);
      });
  }

  openDeleteFileDialog(): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 13 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.deleteApprovableProcess(this.processId);
      }
    });
  }

  openCloseFileDialog(): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 9 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.closeApprovableProcess(this.processId);
      }
    });
  }

  sendApprovableProcess(processId: string, note?: string, userId?: string): void {
    // this.missionService.setLoading(true)
    this.approvalCifService.sendApprove({id: processId, note, userId}).subscribe(
      data => {
        if (data.success && data.success === true) {
          this.response = data;
          this.missionService.setMission('Thông tin duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.response = data;
        }
        this.errorHandler.messageHandler(this.response, 'Gửi duyệt hồ sơ thành công');
        this.getProcessInformation(this.processId);
        this.getRegistrableService(this.processId);
      },
      error => {
        // this.missionService.setLoading(false)
        this.errorHandler.showError(error);
      }
    );
  }

  openSendFileDialog(): void {
    const dialogRef = this.dialog.open(PopUpSendServiceComponent, DialogConfig.configDialogConfirm({ number: 12 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendApprovableProcess(this.processId, rs.note, this.userId);
        this.getProcessInformation(this.processId);
      }
    });
  }


  openHistoryDialog(): void {
    const dialogRef = this.dialog.open(PopupHistoryProcessComponent, DialogConfig.configDialogHistory({ number: 13 }));
    dialogRef.afterClosed().subscribe(rs => {
      // if (rs == 1) {
      //   this.deleteApprovableProcess(this.processId)
      // }
    }
    );
  }

  showCloseButton(): boolean {
    return this.process.statusId === 'M';
  }

  showDeleteButton(): boolean {
    return this.process.statusId === 'E';
  }

  showSendButton(): boolean {
    return this.process.statusId === 'E' || this.process.statusId === 'M';
  }

  showPopUp(): void {

    this.dialog.open(PopUpMaincardComponent, DialogConfig.configDialogDataCard());
  }

  showDetailMainCard(id): void {
    this.idSelected = id;
    this.isShowPopupDetail = true;
  }

  showDetaiSubCard(id): void {
    // console.log(id);
    this.idSupCardSelected = id;
    this.isShowPopupDetailSubCard = true;
  }

  showDetailAccount(id): void {
    this.isAccountSelected = id;
    this.isShowPopupDetailAccount = true;
  }

  showDetailCustomer(processId): void {
    this.isCustomerSelect = processId;
    this.isShowPopupCustomerDetail = true;
  }

  showDetailEbanking(id): void {
    this.isEbankingSelect = id;
    this.isShowPopupEbankingDetail = true;
  }

}
