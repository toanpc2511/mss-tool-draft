import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApprovableProcess, Process } from '../../_models/process';
import { CifCondition } from '../../_models/cif';
import { ProcessService } from '../../_services/process.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { Location } from '@angular/common';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { PopupConfirmComponent } from '../../_popup/popup-confirm.component';
import { ApprovalCifService } from '../../_services/approval-cif.service';
import { RegistrableService } from '../../_models/registrable-service';
import { ResponseStatus } from '../../_models/response';
import { MissionService } from '../../services/mission.service';
import { ProcessItem } from '../../_models/process/ProcessItem';
import { GlobalConstant } from '../../_utils/GlobalConstant';
import { PopUpMaincardComponent } from './pop-up/pop-up-maincard/pop-up-maincard/pop-up-maincard.component';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/_toast/notification_service';
import { RefuseFileComponent } from '../refuse-file/refuse-file.component';
import { SendRejectOneComponent } from './pop-up/send-reject-one/send-reject-one.component';
import { SendModifyOneComponent } from './pop-up/send-modify-one/send-modify-one.component';

declare var $: any;

@Component({
  selector: 'app-service-browsing',
  templateUrl: './service-browsing.component.html',
  styleUrls: ['./service-browsing.component.scss']
})
export class ServiceBrowsingComponent implements OnInit {
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  processId: string;
  process: Process = new Process();
  serviceLst: RegistrableService[];
  response: ResponseStatus;
  processItem = new ProcessItem();
  msgBody: any;
  userId: string;
  idSelected = '';
  idSupCardSelected = '';
  isAccountSelected = '';
  isCustomerSelect = '';
  isEbankingSelect = '';
  isCoOwnerSelected = '';
  isShowPopupDetail = false;
  isShowPopupDetailSubCard = false;
  isShowPopupDetailAccount = false;
  isShowPopupCustomerDetail = false;
  isShowPopupEbankingDetail = false;
  isShowPopupCoOwnerDetail = false;
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private approvalCifService: ApprovalCifService,
    private location: Location,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private missionService: MissionService) {
  }

  ngOnInit(): void {
    $('.childName').html('Duyệt dịch vụ');
    this.route.paramMap.subscribe(paramMap => this.getApprovalInformation(paramMap.get('processId')));
    // console.log('aaaxxx', this.processItem);
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.userId = JSON.parse(localStorage.getItem('userInfo')).userId;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
  }

  backPage(): void {
    this.location.back();
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

  getProcessInformation(processId: string): void {
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      const condition = new CifCondition();
      condition.id = processId;
      this.cifService.detailProcess(processId).subscribe(data => {
        this.processItem = data.item;
        console.log('đây', this.processItem);
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
          console.log('nữa nè', this.serviceLst);
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

  closeApprovableProcess(processId: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.approverClose(new ApprovableProcess(processId)).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
        } else if (data && data.success === false) {
          this.response = data;

        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Đóng hồ sơ thành công');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  closeRefusedFileDialog(): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 9 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.closeApprovableProcess(this.processId);
      }
    }
    );
  }

  approvalOne(id: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.approval(id).subscribe(
      data => {
        // tslint:disable-next-line:no-string-literal
        const statusCode = data['item'].statusCode;
        if (statusCode === 'S') {
          this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Duyệt dịch vụ');
          this.response = data;
        } else if (statusCode === 'F') {
          this.errorHandler.showError('Duyệt dịch vụ thất bại');
          this.response = data;
        }
      }, error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        // this.errorHandler.showError('Có lỗi xảy ra');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  approvalOneDialog(service: RegistrableService): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 8 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.approvalOne(service.id);
      }
    }
    );
  }

  approvalAll(processId): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.approvalAll(processId).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
          this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.response = data;
          this.errorHandler.showError('Duyệt dịch vụ thất bại');
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        // this.errorHandler.showError('Duyệt tất cả dịch vụ thất bại');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  approvalAllDialog(): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 10 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.approvalAll(this.processId);
      }
    }
    );
  }

  // sendRejectProcess(): void {
  //   const dialogRef = this.dialog.open(RefuseFileComponent, DialogConfig.configDialogConfirm({ number: 22 }));
  //   dialogRef.afterClosed().subscribe(rs => {
  //     console.log('reject', rs);
  //     if (rs === 0) {
  //       this.missionService.setLoading(true);
  //       return this.approvalCifService.sendReject(this.processId).subscribe(
  //         data => {
  //           if (data && data.success === true) {
  //             this.response = data;
  //             this.notificationService.showSuccess('Từ chối hồ sơ thành công', 'Duyệt dịch vụ');
  //           } else if (data && data.success === false) {
  //             this.notificationService.showError('Từ chối hồ sơ thất bại', 'Duyệt dịch vụ');
  //             this.response = data;
  //           }
  //           // else {this.errorHandler.showError('Có lỗi xảy ra') }
  //         },
  //         error => {
  //           this.missionService.setLoading(false);
  //           this.errorHandler.showError('Từ chối hồ sơ thất bại');
  //           this.errorHandler.showError(error);
  //         },
  //         () => {
  //           this.missionService.setLoading(false);
  //           this.errorHandler.messageHandler(this.response, 'Từ chối hồ sơ thành công');
  //           this.getApprovalInformation(this.processId);
  //         }
  //       );
  //     } else if (rs === 2) {
  //       this.missionService.setLoading(true);
  //       return this.approvalCifService.sendModify(this.processId).subscribe(
  //         data => {
  //           if (data && data.success === true) {
  //             this.response = data;
  //             this.notificationService.showSuccess('Yêu cầu bổ sung thành công', 'Duyệt dịch vụ');
  //           } else if (data && data.success === false) {
  //             this.notificationService.showError('Yêu cầu bổ sung thất bại', 'Duyệt dịch vụ');
  //             this.response = data;
  //           }
  //           // else {this.errorHandler.showError('Có lỗi xảy ra') }
  //         },
  //         error => {
  //           this.missionService.setLoading(false);
  //           this.errorHandler.showError('Yêu cầu bổ sung thất bại');
  //           this.errorHandler.showError(error);
  //         },
  //         () => {
  //           this.missionService.setLoading(false);
  //           this.notificationService.showSuccess('Yêu cầu bổ sung thành công', 'Duyệt dịch vụ');
  //           this.getApprovalInformation(this.processId);
  //         }
  //       );
  //     }
  //   }
  //   );
  // }

  sendRejectProcess(id: string, note?: string, userId?: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.sendReject({id, note, userId}).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
          this.notificationService.showSuccess('Từ chối dịch vụ thành công', 'Duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.notificationService.showError('Từ chối dịch vụ thất bại', 'Duyệt dịch vụ');
          this.response = data;
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError('Từ chối dịch vụ thất bại');
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Từ chối dịch vụ thành công');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  sendRejectDialog(): void {
    const dialogRef = this.dialog.open(SendRejectOneComponent, DialogConfig.configDialogConfirm({ number: 27 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendRejectProcess(this.processId, rs.note, this.userId);
      }
    });
  }

  sendModify(id: string, note?: string, userId?: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.sendModify({id, note, userId}).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
          this.notificationService.showSuccess('Yêu cầu bổ sung thành công', 'Duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.notificationService.showError('Yêu cầu bổ sung thất bại', 'Duyệt dịch vụ');
          this.response = data;
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError('Yêu cầu bổ sung thất bại');
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Yêu cầu bổ sung thành công');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  sendModifyDialog(): void {
    const dialogRef = this.dialog.open(SendModifyOneComponent, DialogConfig.configDialogConfirm({ number: 27 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendModify(this.processId, rs.note, this.userId);
      }
    });
  }

  sendRejectOne(id: string, note?: string, userId?: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.sendRejectOne({id, note, userId}).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
          this.notificationService.showSuccess('Từ chối dịch vụ thành công', 'Duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.notificationService.showError('Từ chối dịch vụ thất bại', 'Duyệt dịch vụ');
          this.response = data;
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError('Từ chối dịch vụ thất bại');
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Từ chối dịch vụ thành công');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  sendRejectOneDialog(service: RegistrableService): void {
    const dialogRef = this.dialog.open(SendRejectOneComponent, DialogConfig.configDialogConfirm({ number: 27 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendRejectOne(service.dwItemId, rs.note, this.userId);
      }
    });
  }

  sendModifyOne(id: string, note?: string, userId?: string): Subscription {
    this.missionService.setLoading(true);
    return this.approvalCifService.sendModifyOne({id, note, userId}).subscribe(
      data => {
        if (data && data.success === true) {
          this.response = data;
          this.notificationService.showSuccess('Yêu cầu bổ sung thành công', 'Duyệt dịch vụ');
        } else if (data && data.success === false) {
          this.notificationService.showError('Yêu cầu bổ sung thất bại', 'Duyệt dịch vụ');
          this.response = data;
        }
        // else {this.errorHandler.showError('Có lỗi xảy ra') }
      },
      error => {
        this.missionService.setLoading(false);
        this.errorHandler.showError('Yêu cầu bổ sung thất bại');
        this.errorHandler.showError(error);
      },
      () => {
        this.missionService.setLoading(false);
        this.errorHandler.messageHandler(this.response, 'Yêu cầu bổ sung thành công');
        this.getApprovalInformation(this.processId);
      }
    );
  }

  sendModifyOneDialog(service: RegistrableService): void {
    const dialogRef = this.dialog.open(SendModifyOneComponent, DialogConfig.configDialogConfirm({ number: 28 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs.index === 1) {
        this.sendModifyOne(service.dwItemId, rs.note, this.userId);
      }
    });
  }
  // sendApproveOne(service: RegistrableService): void {
  //   const dialogRef = this.dialog.open(SendModifyOneComponent, DialogConfig.configDialogConfirm({ number: 26}));
  //   dialogRef.afterClosed().subscribe(rs => {
  //     if (rs.index === 1) {
  //       this.sendModifyOne(service.id, rs.note, this.userId);
  //       this.getProcessInformation(this.processId);
  //     }
  //   });
  // }
  closeProcess(): void {
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 9 }));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.missionService.setLoading(true);
        return this.approvalCifService.sendClose(this.processId).subscribe(
          data => {
            if (data && data.success === true) {
              this.response = data;
              this.notificationService.showSuccess('Đóng hồ sơ thành công', 'Duyệt dịch vụ');
            } else if (data && data.success === false) {
              this.notificationService.showError('Đóng hồ sơ thất bại', 'Duyệt dịch vụ');
              this.response = data;
            }
            // else {this.errorHandler.showError('Có lỗi xảy ra') }
          },
          error => {
            this.missionService.setLoading(false);
            this.errorHandler.showError('Đóng hồ sơ thất bại');
            this.errorHandler.showError(error);
          },
          () => {
            this.missionService.setLoading(false);
            this.errorHandler.messageHandler(this.response, 'Đóng hồ sơ thành công');
            this.getApprovalInformation(this.processId);
          }
        );
      }
    }
    );

  }

  showApproveAllButton(): boolean {
    return this.process.statusId === 'W' ||
      this.process.statusId === 'P';
  }

  showPopUp(): void {

    this.dialog.open(PopUpMaincardComponent, DialogConfig.configDialogDataCard());
  }

  showDetailMainCard(id): void {
    this.idSelected = id;
    this.isShowPopupDetail = true;
  }

  showDetaiSubCard(id): void {
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
  showDetailCoOwner(coOwnerId): void{
    this.isCoOwnerSelected = coOwnerId;
    this.isShowPopupCoOwnerDetail = true;
  }
}
