import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {CardSearchInfo, CardSearchInfo2} from '../../shared/models/card-inssuance';
import {FormArray, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {CardServicesExtendService} from '../../shared/services/card-services-extend.service';
import {SendApproveDto, SendApproveRequest} from '../../shared/models/card-services-extend';
declare var $: any;

@Component({
  selector: 'app-account-editing-service',
  templateUrl: './account-editing-service.component.html',
  styleUrls: ['./account-editing-service.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountEditingServiceComponent),
      multi: true,
    }
  ]
})
export class AccountEditingServiceComponent implements OnInit {
  private blob: Blob;
  @Input() cardSelected: CardSearchInfo2;
  @Output() eventBackStep = new EventEmitter();
  formCustomerInfo: FormGroup;
  userInfo: any;
  isShowLoading = false;
  showModal = false;
  accSvbo: any;
  accCbs: any;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  serviceCode: any;
  isPrinted = false;
  private readonly POSITION_SELECT = {
    SVBO: 'SVBO',
    CBS: 'CBS'
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private cardServicesExtendService: CardServicesExtendService
  ) {
    this.initFormCustomerInfo();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    $('.childName').html('Yêu cầu Thêm/Hủy TK liên kết/Đổi tài khoản mặc định');
    if (this.cardSelected) {
      this.fillDataLinkAccountDefault();
    }
  }

  initFormCustomerInfo(): void {
    this.formCustomerInfo = this.fb.group({
      customerCode: [{value: '', disabled: true}],
      uidValue: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      branchCode: [{value: '', disabled: true}],
      cardCategory: [{value: '', disabled: true}],
      cardProductCode: [{value: '', disabled: true}],
      cardNumber: [{value: '', disabled: true}],
      cardEmbossedName: [{value: '', disabled: true}],
      defaultAccount: [{value: '', disabled: true}],
      releaseDate: [{value: '', disabled: true}],
      cardStatusCode: [{value: '', disabled: true}],
      cardStateCode: [{value: '', disabled: true}],
      cardId: [{value: '', disabled: true}],
      cardCoreId: [{value: '', disabled: true}],
      cardCategoryName: [{value: '', disabled: true}],
      expireDate: [{value: null, disabled: true}],
      clientType: [{value: '', disabled: true}],
      contract: [{value: '', disabled: true}],
      cardTypeCode: [{value: '', disabled: true}],
      contractType: [{value: '', disabled: true}],
      sendNote: [{value: '', disabled: true}],
      pinCount: [{value: '', disabled: true}],
      totalOutStanding: [{value: '', disabled: true}],
      address: [{value: '', disabled: true}],
      creditLimit: [{value: '', disabled: true}],
      accountStatus: [{value: '', disabled: true}],
      lstAccountSVBO: this.fb.array([]),
      listAccountCBS: this.fb.array([]),
    });
  }

  fillDataLinkAccountDefault(): void {
    this.formCustomerInfo.reset();
    this.formCustomerInfo.patchValue(this.cardSelected);
    this.lstAccountSVBO.clear();
    this.listAccountCBS.clear();
    if (this.cardSelected && this.cardSelected.accSvbo.length > 0) {
      this.accSvbo = this.cardSelected.accSvbo;
      this.accSvbo.forEach(item => {
        this.lstAccountSVBO.push(this.createListAccSVBOGroup(item));
      });
    }
    if (this.cardSelected && this.cardSelected.accCbs.length > 0) {
      // @ts-ignore
      this.accCbs = this.cardSelected.accCbs.filter(item => !this.accSvbo.some(item2 => item2.accountNumber === item.accountNumber));
      this.accCbs.forEach(item => {
        this.listAccountCBS.push(this.createListAccCbsGroup(item));
      });
    }
  }

  createListAccSVBOGroup(obj: any): FormGroup {
    return this.fb.group({
      linkStatusSVBO: [obj.linkStatus],
      defaultAccSVBO: [obj.defaultAcc],
      accountNumberSVBO: [obj.accountNumber],
      accountTypeSVBO: [obj.accountType]
    });
  }

  createListAccCbsGroup(obj: any): FormGroup {
    return this.fb.group({
      linkStatusCBS: [obj.linkStatus],
      defaultAccCBS: [obj.defaultAcc],
      accountNumberCBS: [obj.accountNumber],
      accountTypeCBS: [obj.accountType]
    });
  }

  get lstAccountSVBO(): any {
    return this.formCustomerInfo.get('lstAccountSVBO') as FormArray;
  }

  get listAccountCBS(): any {
    return this.formCustomerInfo.get('listAccountCBS') as FormArray;
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }

  openModal(): void {
    this.formCustomerInfo.markAllAsTouched();
    // if (this.formCustomerInfo.invalid || this.uploadFile.errMessage !== '') {
    //   return;
    // }
    this.showModal = true;
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formCustomerInfo.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  editingAccount(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
    if (!this.validateData()) {
      return;
    }
    const editAccDto = {
      cardCoreId: frmValue.cardCoreId,
      customerCode: frmValue.customerCode,
      uidValue: frmValue.uidValue,
      fullName: frmValue.fullName,
      phoneNumber: frmValue.phoneNumber,
      branchCode: frmValue.branchCode,
      cardCategory: frmValue.cardCategory,
      cardProductCode: frmValue.cardProductCode,
      cardNumber: frmValue.cardNumber,
      cardEmbossedName: frmValue.cardEmbossedName,
      defaultAccount: frmValue.defaultAccount,
      expireDate: frmValue.expireDate,
      releaseDate: frmValue.releaseDate,
      cardStatusCode: frmValue.cardStatusCode,
      coreActionCode: 'ACCOUNT_LINK',
      totalOutStanding: frmValue.totalOutStanding,
      clientType: frmValue.clientType,
      sendNote: frmValue.sendNote,
      address: frmValue.address,
      branchCodeDo: this.userInfo.branchCode,
      creditLimit: frmValue.creditLimit,
      pinCount: frmValue.pinCount,
      cardTypeCode: frmValue.cardTypeCode,
      accountStatus: frmValue.accountStatus,
      contractType: frmValue.contractType,
      contract: frmValue.contract,
      cardStateCode: frmValue.cardStateCode,
      serviceCode: this.serviceCode,
      oldAccLink: {accSvbo: this.cardSelected.accSvbo, accCbs: this.cardSelected.accCbs},
      newAccLink: {accSvbo: this.accSvbo, accCbs: this.accCbs}
    };

    this.isShowLoading = true;
    this.cardServicesExtendService.sendApproveLinkAcc(editAccDto).subscribe(
      (res) => {
        this.isShowLoading = false;
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess(
            'Gửi duyệt yêu cầu thành công',
            'Thông báo'
          );
          this.eventBackStep.emit();
        } else {
          this.notificationService.showError(
            res.responseStatus.codes[0].detail,
            'Thông báo'
          );
        }
      },
      (error) => {
        this.isShowLoading = false;
        this.notificationService.showError(
          'Gửi duyệt yêu cầu thất bại',
          'Thông báo'
        );
      }
    );
    this.showModal = false;
  }

  resetForm(): void{
    this.fillDataLinkAccountDefault();
  }

  printForm(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
    if (!this.validateData()) {
      return;
    }
    this.getDataCbsAndSvbo();
    const req = {
      customerCode: frmValue.customerCode,
      fullName: frmValue.fullName,
      branchCodeDo: this.userInfo.branchCode,
      cardProductCode: frmValue.cardProductCode,
      cardNumber: frmValue.cardNumber,
      defaultAccount: frmValue.defaultAccount,
      cardStatusCode: frmValue.cardStatusCode,
      cardTypeCode: frmValue.cardTypeCode,
      coreActionCode: 'ACCOUNT_LINK',
      cardCoreId: frmValue.cardCoreId,
      accSvbo: this.accSvbo,
      accCbs: this.accCbs,
    };
    this.isShowLoading = true;
    this.cardServicesExtendService.getServiceCode(req).subscribe((data) => {
        this.isShowLoading = false;
        this.serviceCode = data.item.serviceCode;
        if (data && data.responseStatus.success) {
          const fileContent = data.item.fileContent;
          const linkSource = 'data:application/pdf;base64,' + fileContent;
          const downloadLink = document.createElement('a');
          const fileName = 'Change Accounct' + data.item.fileName;
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          this.isPrinted = true;
        } else {
          this.isShowLoading = false;
          this.notificationService.showError(
            data.responseStatus?.codes[0].detail,
            'Thông báo'
          );
        }
      }, err => {
        this.isShowLoading = false;
        this.notificationService.showError('In biểu mẫu thất bại', 'Thông báo');
      }
    );
  }

  evtCheckedLinkAccountChange(evt: any, pos: string, i: any): void {
    this.isPrinted = false;
    switch (pos) {
      case this.POSITION_SELECT.SVBO:
        this.lstAccountSVBO.controls.forEach((el, index) => {
          if (i === index) {
            el.patchValue({
              defaultAccSVBO: !evt.checked ? false : el.controls.defaultAccSVBO.value,
              linkStatusSVBO: evt.checked,
              accountNumberSVBO: el.controls.accountNumberSVBO.value
            });
          }
        });
        break;
      case this.POSITION_SELECT.CBS:
        this.listAccountCBS.controls.forEach((el, index) => {
          if (i === index) {
            el.patchValue({
              defaultAccCBS: !evt.checked ? false : el.controls.defaultAccCBS.value,
              linkStatusCBS: evt.checked,
              accountNumberCBS: el.controls.accountNumberCBS.value
            });
          }
        });
        break;
      default:
        break;
    }
  }

  evtRadioDefaultAccountChange(pos: string, i: any): void {
    this.isPrinted = false;
    switch (pos) {
      case this.POSITION_SELECT.SVBO:
        this.lstAccountSVBO.controls.forEach((el, index) => {
          if (i === index) {
            el.patchValue({
              defaultAccSVBO: true,
              linkStatusSVBO: true,
              accountNumberSVBO: el.controls.accountNumberSVBO.value
            });
          } else {
            el.patchValue({
              defaultAccSVBO: false,
              linkStatusSVBO: el.controls.linkStatusSVBO.value,
              accountNumberSVBO: el.controls.accountNumberSVBO.value
            });
          }
        });
        this.listAccountCBS.controls.forEach((el, index) => {
          el.patchValue({
            defaultAccCBS: false,
            linkStatusCBS: el.controls.linkStatusCBS.value,
            accountNumberCBS: el.controls.accountNumberCBS.value
          });
        });
        break;
      case this.POSITION_SELECT.CBS:
        this.listAccountCBS.controls.forEach((el, index) => {
          if (i === index) {
            el.patchValue({
              defaultAccCBS: true,
              linkStatusCBS: true,
              accountNumberCBS: el.controls.accountNumberCBS.value
            });
          } else {
            el.patchValue({
              defaultAccCBS: false,
              linkStatusCBS: el.controls.linkStatusCBS.value,
              accountNumberCBS: el.controls.accountNumberCBS.value
            });
          }
        });
        this.lstAccountSVBO.controls.forEach((el, index) => {
          el.patchValue({
            defaultAccSVBO: false,
            linkStatusSVBO: el.controls.linkStatusSVBO.value,
            accountNumberSVBO: el.controls.accountNumberSVBO.value
          });
        });
        break;
      default:
        break;
    }
  }

  validateData(): boolean {
    if (this.listAccountCBS.getRawValue().find(item => item.defaultAccCBS === true)
      || this.lstAccountSVBO.getRawValue().find(item => item.defaultAccSVBO === true)) {
      this.notificationService.showSuccess('', 'Done');
      this.getDataCbsAndSvbo();
      return true;
    } else {
      this.notificationService.showError('Bạn chưa chọn tài khoản mặc định', 'Thông báo');
      return false;
    }
  }

  getDataCbsAndSvbo(): void {
    const getFilterAccCbs = [];
    const getFilterAccSvbo = [];
    this.cardSelected.accCbs.forEach((el: any) => {
      this.listAccountCBS.getRawValue().forEach(el1 => {
        if (el.accountNumber === el1.accountNumberCBS && (el.linkStatus !== el1.linkStatusCBS || el.defaultAcc !== el1.defaultAccCBS)) {
          getFilterAccCbs.push({
            accountNumber: el1.accountNumberCBS,
            linkStatus: el1.linkStatusCBS,
            defaultAcc: el1.defaultAccCBS,
            accountType: el1.accountTypeCBS
          });
        }
      });
    });
    this.lstAccountSVBO.getRawValue().forEach(el => {
      getFilterAccSvbo.push({
        accountNumber: el.accountNumberSVBO,
        linkStatus: el.linkStatusSVBO,
        defaultAcc: el.defaultAccSVBO,
        accountType: el.accountTypeSVBO
      });
    });
    this.accCbs = getFilterAccCbs.filter(obj => obj.linkStatus !== false);
    this.accSvbo = getFilterAccSvbo;
  }
}
