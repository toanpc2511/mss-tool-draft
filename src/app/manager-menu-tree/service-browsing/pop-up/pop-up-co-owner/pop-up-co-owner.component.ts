import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { MisCifComponent } from 'src/app/manager-smart-form/process/create/mis-cif/mis-cif.component';
import { UdfCifComponent } from 'src/app/manager-smart-form/process/create/udf-cif/udf-cif.component';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { CifCondition } from 'src/app/_models/cif';
import { CoOwnerAccount } from 'src/app/_models/CoOwnerAccount';
import { OwnerBenefitsCif } from 'src/app/_models/ownerBenefitsCif';
import { Process } from 'src/app/_models/process/Process';
import { ProcessItemCustomer } from 'src/app/_models/process/ProcessItemCustomer';
import { Mis } from 'src/app/_models/register.cif';
import { ResponseStatus } from 'src/app/_models/response';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { PopupHistoryProcessComponent } from 'src/app/_popup/popup-history-process/popup-history-process.component';
import { AccountService } from 'src/app/_services/account.service';
import { CategoryService } from 'src/app/_services/category/category.service';
import { CoOwnerAccountService } from 'src/app/_services/co-owner-account.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { ProcessService } from 'src/app/_services/process.service';
import { SpinnerOverlayService } from 'src/app/_services/spinner-overlay.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { DetailProcess } from '../../../../_models/process';
declare var $: any;
@Component({
  selector: 'app-pop-up-co-owner',
  templateUrl: './pop-up-co-owner.component.html',
  styleUrls: ['./pop-up-co-owner.component.css']
})
export class PopUpCoOwnerComponent implements OnInit {
  @Input() coOwnerId = '';
  response: ResponseStatus;
  detailProcess: DetailProcess = new DetailProcess(null);
  process: Process = new Process();
  processId: string;
  accountId: string;
  customerId: string;
  ownerBenefitData: OwnerBenefitsCif[] = [];
  mis: Mis = new Mis();
  showContentFATCA = false;
  shownationality2Name = false;
  shownationality3Name = false;
  shownationality4Name = false;
  isKSV: boolean;
  isGDV: boolean;
  show: any = { process: false, coOwner: false };
  categories: CategoryList = new CategoryList();
  roleLogin: any = [];
  coOwnerList: ProcessItemCustomer[];
  isCoOwner = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private location: Location,
    private category: CategoryService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private coOwnerAccountService: CoOwnerAccountService,
    private readonly spinnerOverlayService: SpinnerOverlayService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.getProcessInformation(this.processId);
    });

    console.log('processId:' + this.processId);
    this.missionService.setProcessId(this.processId);

    $('.childName').html('Khách hàng');

    this.checkForCoOwner();

    console.log('this.process', this.process.item);
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;

      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
      console.log(i);
    }
  }

  checkForCoOwner(): void {
    if (this.coOwnerId) {
      this.isCoOwner = false;
    }
  }

  categoriesLoader(): void {
    this.category.getApiFATCA().subscribe(data => this.categories.fatca = data);
  }

  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    if (this.coOwnerId !== '') {
      this.coOwnerAccountService.detailCoOwner(this.coOwnerId).subscribe(data => {
        if (data.item) {
          this.process.item.customer = data.item;
          console.log('thông tin đồng chủ sở hữu', data.item);
          if (data.item.person.fatcaCode != null) {
            this.showContentFATCA = true;
          }
          if (data.item.person.nationality2Name != null) {
            this.shownationality2Name = true;
          }
          if (data.item.person.nationality3Name != null) {
            this.shownationality3Name = true;
          }
          if (data.item.person.nationality4Name != null) {
            this.shownationality4Name = true;
          }
        }
      }, error => {
        this.errorHandler.showError(error);
        // this.missionService.setLoading(false)
      });
    } else {
      this.cifService.detailProcess(processId).subscribe(data => {
        console.log('datatest', data);
        if (data.item) {
          this.process.item = data.item;
          if (data.item.customer.person.fatcaCode != null) {
            this.showContentFATCA = true;
          }
          if (data.item.customer.person.nationality2Name != null) {
            this.shownationality2Name = true;
          }
          if (data.item.customer.person.nationality3Name != null) {
            this.shownationality3Name = true;
          }
          if (data.item.customer.person.nationality4Name != null) {
            this.shownationality4Name = true;
          }
        }
        console.log('this.process.item', this.process.item);
      }, error => {
        this.errorHandler.showError(error);
      }, () => {
      });
    }
  }

  unlockUpdate(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.unlockUpdate(processId).subscribe(data => {
      const rs = data;
      console.log(rs);
      this.getProcessInformation(processId);
    });
  }

  update(processId: string): any {
    console.log('this.coOwnerId', this.coOwnerId);
    if (this.coOwnerId !== '') {
      this.router.navigate(['./smart-form/manager/co-owner/update', {
        accountId: this.accountId,
        processId: this.processId,
        coOwnerId: this.coOwnerId
      }]);
    } else {
      this.router.navigate(['./smart-form/updateCif', { processId }]);
    }
  }

  deletecoOwner(coOwnerId: string): void {
    this.coOwnerAccountService.delete(coOwnerId).subscribe(
      data => {
        if (data) {
          this.response = data.responseStatus;
        }
      }, error => {
        this.errorHandler.showError(error);
      }, () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa đồng sở hữu thành công');
          if (this.response.success === true) {
            this.getCoOwnerList();
          }
        }
      }
    );
  }

  getCoOwnerList(): void {
    this.coOwnerAccountService.list(this.accountId, this.processId).subscribe(
      data => {
        // this.missionService.setLoading(true);
        if (data) {
          this.coOwnerList = data.items;
          this.response = data.responseStatus;
          this.show.coOwner = true;
          // this.checkLoading()
          if (this.response && this.response.success === false) {
            this.coOwnerList = [];
            // this.errorHandler.showError('Không lấy được danh sách đồng sở hữu')
          }
        }
        // this.missionService.setLoading(false);
      }, error => {
        this.errorHandler.showError(error);
        // this.missionService.setLoading(100);
      }
    );
  }

  delete(processId: string): any {
    if (this.coOwnerId !== '') {
      const item = { number: 16, code: '' };
      const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
      dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.deletecoOwner(this.coOwnerId);
        }
      });
    } else {
      const item = {
        number: 23
      };
      const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
      dialogRefConfirm.afterClosed().subscribe(rs => {
        if (rs === 1) {
          const spinnerSubscription = this.spinnerOverlayService.spinner$.subscribe();
          this.cifService.deleteProcess(processId).subscribe((data) => {
            console.log('data', data);
            this.errorHandler.showSuccess('Xóa hồ sơ thành công');
          }, error => {
            console.log('error', error);
            this.errorHandler.showError(error);
          }, () => {
            spinnerSubscription.unsubscribe();
            this.router.navigate(['/smart-form/manager/fileProcessed']);
          });
        }
      });
    }
  }

  backPage(): void {
    this.location.back();
  }

  openHistoryDialog(): any {
    const dialogRef = this.dialog.open(PopupHistoryProcessComponent, DialogConfig.configDialogHistory({ number: 13 }));
    dialogRef.afterClosed().subscribe(rs => {
      // if (rs == 1) {
      //   this.deleteApprovableProcess(this.processId)
      // }
    }
    );
  }

  showPopup(popupName: string): any {
    const objConfigPopup: ObjConfigPopup = {
      px: '1024px',
      position_top: '60px',
      data: {},
      index: 0,
      isViewMode: true
    };
    if (popupName === 'MIS') {
      objConfigPopup.data = this.process.item.customer.mis;
      this.dialog.open(MisCifComponent, DialogConfig.configPopupCif(objConfigPopup));
    } else if (popupName === 'UDF') {
      if (this.process.item.customer.udf?.tuNgay) {
        this.process.item.customer.udf.tuNgay = moment(new Date(this.process.item.customer.udf.tuNgay)).format('yyyy-MM-DD');
      }
      if (this.process.item.customer.udf?.denNgay) {
        this.process.item.customer.udf.denNgay = moment(new Date(this.process.item.customer.udf.denNgay)).format('yyyy-MM-DD');
      }
      if (this.process.item.customer.udf?.expiredDate) {
        this.process.item.customer.udf.expiredDate = moment(new Date(this.process.item.customer.udf.expiredDate)).format('yyyy-MM-DD');
      }
      objConfigPopup.data = this.process.item.customer.udf;
      this.dialog.open(UdfCifComponent, DialogConfig.configPopupCif(objConfigPopup));
    }
  }
}
