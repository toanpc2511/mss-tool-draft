import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  EbsServicesApproveObject,
  EbsServicesApproveObject2, EbsServicesApproveRequest,
  EbsServicesRejectRequest
} from '../../shared/models/card-services-approve';
import {CardServicesFormComponent} from '../../shared/components/card-services-form/card-services-form.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MODAL_TYPES} from '../../shared/constants/card-service-constants';
import {CardServicesExtendService} from '../../shared/services/card-services-extend.service';
import {NotificationService} from '../../../../_toast/notification_service';
import {CardEbsServicesApproveExtendService} from '../../shared/services/card-ebs-services-approve-extend.service';
import {ValidatorHelper} from '../../shared/helpers/validators.helper';

@Component({
  selector: 'app-approve-account-editing-service',
  templateUrl: './approve-account-editing-service.component.html',
  styleUrls: ['./approve-account-editing-service.component.scss']
})
export class ApproveAccountEditingServiceComponent implements OnInit, AfterViewInit {
  @Input() cardEbsServiceSelected: EbsServicesApproveObject2;
  @Input() isDetail = false;
  @ViewChild('cardServiceExtendForm', { static: false })
  cardServiceExtendForm: CardServicesFormComponent;
  formEbsServiceInfo: FormGroup;
  rejectForm: FormGroup;
  isShowLoading = false;
  isShowModal = false;
  oldAccSvbo: any;
  oldAccCbs: any;
  newAccSvbo: [];
  newAccCbs: [];

  @Output() eventBackStep = new EventEmitter();
  modalType = '';
  MODAL_TYPES = MODAL_TYPES;
  errorModalContents = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cardExtendService: CardServicesExtendService,
    private notificationService: NotificationService,
    private cardEbsServicesApproveExtendService: CardEbsServicesApproveExtendService,
  ) {
    this.initFormEbsService();
  }

  ngOnInit(): void {
    // this.getCardInfo(this.cardEbsServiceSelected.cardCoreId);
    const id = this.cardEbsServiceSelected.id;
    this.cardEbsServicesApproveExtendService.getDetailLktk({id}).subscribe(
      (res) => {
        this.formEbsServiceInfo.patchValue(res.cardDetail);
        if (res && res.responseStatus.success) {
          this.oldAccSvbo = res.oldAccountLink.accSvbo;
          this.oldAccCbs = res.oldAccountLink.accCbs;
          this.newAccSvbo = res.newAccountLink.accSvbo;
          this.newAccCbs = res.newAccountLink.accCbs;
          for (let i = 0; i < this.oldAccCbs.length; i++) {
            const acc = this.oldAccCbs[i].accountNumber;
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < this.oldAccSvbo.length; j++) {
              if (this.oldAccSvbo[j].accountNumber === acc) {
                this.oldAccCbs.splice(i, 1);
                i--;
                break;
              }
            }
          }
        }
      }
    );
    this.rejectForm = this.fb.group({
      reason: ['', [ValidatorHelper.required, Validators.maxLength(1000)]],
    });
  }

  ngAfterViewInit(): void {
    try {
      const userInfoTxt = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoTxt);

      const branchCodeDo = this.formEbsServiceInfo.get('branchCodeDo').value;
      if (
        userInfo.branchCode === '001' &&
        userInfo.branchCode !== branchCodeDo
      ) {
        this.cardServiceExtendForm.disableSend();
      }
    } catch (error) {}
    if (!this.isDetail) {
      try {
        this.cardExtendService.checkValidCardInfo(this.cardEbsServiceSelected);
        this.errorModalContents = [];
      } catch (error) {
        this.errorModalContents = [error.message];
        this.modalType = MODAL_TYPES.ERROR;
        this.cardServiceExtendForm.disableSend();
        this.isShowModal = true;
      }
    }
    this.cdr.detectChanges();
  }

  initFormEbsService(): void {
    this.formEbsServiceInfo = this.fb.group({
      customerCode: [{ value: '', disabled: true }],
      uidValue: [{ value: '', disabled: true }],
      fullName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      branchCode: [{ value: '', disabled: true }],
      cardCategory: [{ value: '', disabled: true }],
      cardProductCode: [{ value: '', disabled: true }],
      cardNumber: [{ value: '', disabled: true }],
      cardEmbossedName: [{ value: '', disabled: true }],
      defaultAccount: [{ value: '', disabled: true }],
      releaseDate: [{ value: '', disabled: true }],
      cardStatusCode: [{ value: '', disabled: true }],
      cardId: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      cardCategoryName: [{ value: '', disabled: true }],
      expireDate: [{ value: null, disabled: true }],
      clientType: [{ value: '', disabled: true}],
      contract: [{ value: '', disabled: true}],
      cardTypeCode: [{value: '', disabled: true}],
      contractType: [{ value: '', disabled: true}],
      sendNote: [{ value: '', disabled: true}],
      pinCount: [{ value: '', disabled: true}],
      accSvbo: this.fb.array([]),
      accCbs: this.fb.array([]),
    });
  }

  backToSearch(evt?): void {
    this.eventBackStep.emit(evt);
  }

  openModal(event): void {
    this.modalType = event.modalType;
    this.isShowModal = true;
  }

  reject(): void {
    this.rejectForm.markAllAsTouched();
    if (this.rejectForm.invalid) {
      return;
    }

    const rejectFrmValues = this.rejectForm.getRawValue();
    this.isShowLoading = true;
    const request: EbsServicesRejectRequest = {
      id: this.cardEbsServiceSelected.id,
      approveNote: rejectFrmValues.reason.trim(),
    };
    this.cardEbsServicesApproveExtendService.rejectCardCore(request).subscribe(
      (res) => {
        this.isShowLoading = false;
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Từ chối dịch vụ thành công', 'Thông báo');
          this.backToSearch();
        }
      },
      (error) => {
        this.isShowLoading = false;
        this.notificationService.showError('Từ chối dịch vụ thất bại', 'Thông báo');
      }
    );
    this.isShowModal = false;
  }

  hasErrorRejectForm(controlName: string, errorName: string): boolean {
    const control = this.rejectForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  approve(): void {
    this.isShowLoading = true;
    const request: EbsServicesApproveRequest = {
      id: this.cardEbsServiceSelected.id,
    };

    this.cardEbsServicesApproveExtendService
      .approveExtendRequest(request)
      .subscribe(
        (res) => {
          this.isShowLoading = false;
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess(
              'Duyệt dịch vụ thành công',
              'Thông báo'
            );
            this.backToSearch();
          } else {
            this.notificationService.showError(
              res.responseStatus.codes[0].msg,
              'Thông báo'
            );
          }
        },
        (error) => {
          this.isShowLoading = false;
          this.notificationService.showError(
            'Có lỗi xảy ra, vui lòng thử lại',
            'Thông báo'
          );
        }
      );
    this.isShowModal = false;
  }

  getCardInfo(item): void {
    this.cardExtendService.getCardDetail(item).subscribe(res => {
      this.formEbsServiceInfo.patchValue(res.cardInfo);
    });
  }

}
