import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../../manager-smart-form/modal/modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { EbankingAddOrEditComponent } from './components/ebanking-add-or-edit/ebanking-add-or-edit.component';
import { MissionService } from 'src/app/services/mission.service';
import { EbankingService } from './shared/ebanking.services';
import { ProcessService } from 'src/app/_services/process.service';
import { EbankingListComponent } from './components/ebanking-list/ebanking-list.component';
import { NotificationService } from 'src/app/_toast/notification_service';
declare var $: any;

@Component({
  selector: 'app-ebanking',
  templateUrl: './ebanking.component.html',
  styleUrls: ['./ebanking.component.scss'],
})
export class EbankingComponent implements OnInit {
  @ViewChild(EbankingAddOrEditComponent, { static: false }) addOrEditComponent: EbankingAddOrEditComponent;
  @ViewChild(EbankingListComponent, { static: false }) ebankListComponent: EbankingListComponent;
  accLst: any[] = [];
  processDetail: any[] = [];
  objEbankSelected: any;
  processId: string;
  id: string;
  customerName = '';
  /** Default step = HOME
   * step: HOME - Hiển thị danh sách
   * step: DETAIL - Chi tiết Ebanking
   * step: CREATE - Thêm mới  Ebanking
   * step: EDIT - Chỉnh sửa Ebanking
   */
  step = 'HOME';

  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private missionService: MissionService,
    private ebankingService: EbankingService,
    private cifService: ProcessService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    $('.childName').html('EBanking');
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.id = paramMap.get('id');
      this.missionService.setProcessId(this.processId);
    });
    this.getProcessInformation(this.processId);
  }

  showStep(step): void {
    this.step = step;
  }

  backStep(): void {
    switch (this.step) {
      case 'DETAIL':
      case 'CREATE':
      case 'EDIT':
        this.step = 'HOME';
        break;
      default:
        this.router.navigate(['/smart-form/manager/fileProcessed']);
        break;
    }
  }

  viewEbankingDetail(evt): void {
    this.objEbankSelected = evt;
    this.showStep('DETAIL');
  }

  createEbanking(): void {
    this.step = 'CREATE';
  }

  editEbanking(evt?: any): void {
    if (evt) {
      this.objEbankSelected = evt;
    }
    this.step = 'EDIT';
  }

  saveEbanking(): void {
    if (this.step === 'CREATE') {
      this.addOrEditComponent.create();
    } else if (this.step === 'EDIT') {
      this.addOrEditComponent.update();
    }
  }
  cancelEbank(evt?: any): void {
    if (evt) {
      this.objEbankSelected = evt;
    }
    const dialogConfig = {
      number: 25
    };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDiaEbankDeadTroy(dialogConfig));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.objEbankSelected.actionCode = 'E';
        this.ebankingService.update(this.objEbankSelected).subscribe(
          res => {
            if (res.responseStatus.success) {
              this.notificationService.showSuccess('Hủy dịch vụ thành công', '');
              // this.changeStep.emit('HOME');
            } else {
              this.notificationService.showError('Hủy dịch vụ thất bại', 'Lỗi hủy mới dịch vụ`');
            }
          }
        );
      }

    }
    );
  }

  delete(): void {
    const dialogConfig = {
      number: 24
    };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDiaEbankDelete(dialogConfig));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        // let id = {}
        // id['id'] = item.id
        this.ebankingService.delete(this.objEbankSelected.id).subscribe(res => {
          if (res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa dịch vụ thành công', '');
            this.showStep('HOME');
          } else {
            this.notificationService.showError('Xóa dịch vụ thất bại', '');
          }
        }, err => {
        });
      }

    }
    );
  }
  getProcessInformation(processId): void {

    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.processDetail = data.item;
        this.customerName = data.item.customer.person.fullName;
      }
    });
  }

  // tslint:disable-next-line:typedef
  // createAccount() {
  //   this.eBankingListShower = false;
  //   this.eBankingUpdating = false;
  //   console.log('create new e-banking account');
  // }

  // tslint:disable-next-line:typedef
  // public onSubmit() {
  //   const newAccount = {};
  //   for (const controlName in this.eBankingForm.controls) {
  //     if (controlName) {
  //       newAccount[controlName] = this.eBankingForm.controls[controlName].value;
  //     }
  //   }
  //   console.log(newAccount);
  //   this.accLst.push(newAccount as EBanking);
  // }

  // tslint:disable-next-line:typedef
  // backToList() {
  //   this.eBankingListShower = true;
  // }

  // tslint:disable-next-line:typedef
  // updateAccount(eBankingAccount: any) {
  //   console.log('update e-banking account');
  //   console.log(eBankingAccount);
  //   this.eBankingListShower = false;
  //   this.eBankingUpdating = true;
  // }

  // tslint:disable-next-line:typedef
  // detailAccount(loginAccount: any) {
  //   console.log(loginAccount);
  //   this.eBankingListShower = false;
  //   this.eBankingUpdating = true;
  // }

  // tslint:disable-next-line:typedef
  // openDeleteModal(data: any) {
  //   data['number'] = 11
  //   data.code = 'UNI123'
  //   let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data))
  //   dialogRef.afterClosed().subscribe(rs => {
  //       if (rs == 1) {
  //         this.approvalFile()
  //       }
  //     }
  //   )
  // }
  // openDeleteModal(eBankingAccount: any) {
  //   const eBankingId = 'eb1';
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false;
  //   dialogConfig.id = 'modal-component';
  //   dialogConfig.height = '211';
  //   dialogConfig.width = '600px';
  //   dialogConfig.data = {
  //     name: 'delete-e-banking-account',
  //     title: 'Bạn chắc chắn thực hiện thao tác?',
  //     description: 'Xóa thông tin dịch vụ EBANKING',
  //     actionButtonText: 'Xóa',
  //     eBankingId
  //   };
  //   this.matDialog.open(ModalComponent, dialogConfig);
  // }
}

export interface EBanking {
  loginAccount: string;
  defaultAccount: string;
  email: string;
  accountPlan: string;
  authorizedMethod: string;
  phone: string;
  employeeId: string;
  processStatus: string;
  serviceStatus: string;
}




