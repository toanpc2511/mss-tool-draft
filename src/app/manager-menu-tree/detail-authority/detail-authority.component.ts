import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ViewChild } from '@angular/core';
import { DialogComponent } from '../_dialog/dialog.component';
import { DialogService } from '../_dialog/dialog.service';
import { AuthorityAccountService } from '../../_services/authority-account.service';
import { ResponseStatus } from '../../_models/response';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityModel } from 'src/app/_models/authority';
import { AccountService } from 'src/app/_services/account.service';
import { AuthorExpireAndAuthorType, CategoryAuthority } from 'src/app/_models/category/categoryList';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { ConstantUtils } from 'src/app/_utils/_constant';
import { forkJoin, Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-detail-authority',
  templateUrl: './detail-authority.component.html',
  styleUrls: ['./detail-authority.component.scss']
})
export class DetailAuthorityComponent implements OnInit {
  submitted = false;
  processId: any;
  accountId: string;
  id: string;
  response: ResponseStatus;
  objAccount: AccountModel = new AccountModel();
  objAuthority: AuthorityModel = new AuthorityModel();
  // categories: CategoryAuthority
  lstAuthorType: AuthorExpireAndAuthorType[];
  lstAuthorExpire: AuthorExpireAndAuthorType[];
  birthDate: any;
  issueDate: any;
  radioCheck: any;
  // radioCheckExpire: any
  accountNumber: any;
  checkBoxTrue: boolean;
  booleanOrther: boolean;
  valueOrther: any;
  isChecked: boolean;
  limitValue: any;
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  detailAccount: any = [];
  detailAuthority: any = [];
  residenceCheck: boolean;
  checkedAddress = false;
  checked: string;
  limitAmount: string;
  expireAuthorCode: string;
  constant: ConstantUtils = new ConstantUtils();
  @ViewChild('appDialog', { static: true }) appDialog: DialogComponent;
  detailProcess: DetailProcess = new DetailProcess(null);
  constructor(
    private router: Router, private cifService: ProcessService,
    private authorityAccount: AuthorityAccountService,
    private errorHandler: ErrorHandlerService,
    private dialogService: DialogService,
    private route: ActivatedRoute, private _LOCATION: Location, private missionService: MissionService,
    private accountService: AccountService, private authorityService: AuthorityAccountService,
    private category: CategoryAuthorityService, private datePipe: DatePipe) {
  }
  showDialog(): void {
    this.dialogService.show()
      .then((res) => {
        this.deleteAuthority();
      })
      .catch((err) => {

      });
  }
  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.dialogService.register(this.appDialog);
    $('.childName').html('Chi tiết ủy quyền');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.id = this.route.snapshot.paramMap.get('id');
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.getAllData();
  }
  getAllData(): void {
    forkJoin([this.accountService.getDetailAccount({ id: this.accountId }),
    this.authorityAccount.getDetailAuthority({ id: this.id }),
    this.category.getLstAuthorType(),
    this.category.getLstAuthorExpire()]).subscribe(
      data => {
        if (data && data[0].item) {
          this.detailAccount = data[0].item;
        }
        if (data && data[2]){
          this.lstAuthorType = data[2];
        }
        if (data && data[3]){
          this.lstAuthorExpire = data[3];
        }
        if (data && data[1].item) {
          this.detailAuthority = data[1].item;
          this.residenceCheck = data[1].item.residence;
          this.checked = data[1].item.expireAuthorCode;
          for (const a of  data[1].item.authorTypes ){
            if ( a.limitAmount !== null){
              this.limitAmount = a.limitAmount;
            }
          }
          if (data[1].item.authorTypes !== undefined) {
            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < data[1].item.authorTypes.length; index++) {
              this.returnCheckBox(data[1].item.authorTypes[index]);
              if (data[1].item.authorTypes[index].authorTypeCode === this.constant.OTHER) {
                this.booleanOrther = true;
                this.valueOrther = data[1].item.authorTypes[index].authorTypeFreeText;
              } else if (data[1].item.authorTypes[index].authorTypeCode === this.constant.DEPOSIT_AND_WITHDRAW ||
                data[1].item.authorTypes[index].authorTypeCode === this.constant.ALL) {
                this.isChecked = true;
              }
            }
          }
          if (
            (data[1].item.currentCountryCode === data[1].item.residenceCountryCode)
            && (data[1].item.currentCityCode === data[1].item.residenceCityCode) &&
            (data[1].item.currentDistrictCode === data[1].item.residenceDistrictCode) &&
            (data[1].item.currentWardCode === data[1].item.residenceWardCode) &&
            (data[1].item.currentStreetNumber === data[1].item.residenceStreetNumber)
          ) {
            this.checkedAddress = true;
          } else {
           return this.checkedAddress;
          }
        }
      });
  }
   returnCheckBox(item: any): void {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.lstAuthorType.length; index++) {
      if (this.lstAuthorType[index].code === item.authorTypeCode) {
        // tslint:disable-next-line: no-string-literal
        this.lstAuthorType[index]['checked'] = true;
      }
    }

  }
  backPage(): void {
    this._LOCATION.back();
  }
  deleteAuthority(): Subscription {
    return this.authorityAccount.delete({ id: this.id }).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus;
        }
      }
      , error => this.errorHandler.showError(error)
      , () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa ủy quyền thành công');
          if (this.response.success === true) {
            this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }]);
          }
        } else {this.errorHandler.showError('Lỗi không xác định'); }
      }
    );
  }

  updateAuthority(): void {
    this.router.navigate(['./smart-form/manager/updateAuthority', { processId: this.processId, accountId: this.accountId, id: this.id }]);
  }
}
