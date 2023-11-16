import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/_toast/notification_service';
import { CardServicesFormComponent } from '../../shared/components/card-services-form/card-services-form.component';
import { MODAL_TYPES } from '../../shared/constants/card-service-constants';
import { FileHelper } from '../../shared/helpers/file.helper';
import { ValidatorHelper } from '../../shared/helpers/validators.helper';
import {
  EbsServicesApproveObject,
  EbsServicesApproveRequest,
  EbsServicesRejectRequest,
} from '../../shared/models/card-services-approve';
import { CardEbsServicesApproveExtendService } from '../../shared/services/card-ebs-services-approve-extend.service';
import { isTimeOutResponse } from '../../shared/helpers/timeout.helper';

@Component({
  selector: 'app-card-services-approve-extend-unlock-pin',
  templateUrl: './card-services-approve-extend-unlock-pin.component.html',
  styleUrls: [
    './card-services-approve-extend-unlock-pin.component.scss',
    '../../shared/components/card-services-form/card-services-form.component.scss',
  ],
})
export class CardServicesApproveExtendUnlockPinComponent implements OnInit, AfterViewInit {
  @Input() cardEbsServiceSelected: EbsServicesApproveObject;
  @ViewChild('cardServiceExtendForm', { static: false })
  cardServiceExtendForm: CardServicesFormComponent;
  formEbsServiceInfo: FormGroup;
  rejectForm: FormGroup;
  @Input() isDetail = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  isShowModal = false;

  @Output() eventBackStep = new EventEmitter();
  file: File;
  MODAL_TYPES = MODAL_TYPES;
  modalType = '';

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private cardEbsServicesApproveExtendService: CardEbsServicesApproveExtendService
  ) {
    this.initFormEbsService();
  }

  ngOnInit(): void {
    this.formEbsServiceInfo.patchValue(this.cardEbsServiceSelected);
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
    this.cdr.detectChanges();
  }

  initFormEbsService(): void {
    this.formEbsServiceInfo = this.fb.group({
      customerCode: [{ value: '', disabled: true }],
      uidValue: [{ value: '', disabled: true }],
      fullName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      branchCode: [{ value: '', disabled: true }],
      cardCategoryName: [{ value: '', disabled: true }],
      cardProductCode: [{ value: '', disabled: true }],
      cardNumber: [{ value: '', disabled: true }],
      defaultAccount: [{ value: '', disabled: true }],
      releaseDate: [{ value: '', disabled: true }],
      branchCodeDo: [{ value: '', disabled: true }],
      sendNote: [{ value: '', disabled: true }],
      ebsActionName: [{ value: '', disabled: true }],
      fileType: [''],
      fileName: [{ value: '', disabled: true }],
      fileContent: [''],
      cardEmbossedName: [{ value: '', disabled: true }],
      pinCount: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      expireDate: [{ value: '', disabled: true }],
      approveNote: [{ value: '', disabled: true }],
    });
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
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
            this.eventBackStep.emit('123');
          } else {
            if (isTimeOutResponse(res)) {
              this.notificationService.showError(
                'Giao dịch bị time out',
                'Thông báo'
              );
            } else {
              this.notificationService.showError(
                res.responseStatus.codes[0].msg,
                'Thông báo'
              );
            }
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
          this.notificationService.showSuccess(
            'Từ chối dịch vụ thành công',
            'Thông báo'
          );
          this.eventBackStep.emit('123');
        }
      },
      (error) => {
        this.isShowLoading = false;
        this.notificationService.showError(
          'Từ chối dịch vụ thất bại',
          'Thông báo'
        );
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

  openModal(event): void {
    this.modalType = event.modalType;
    this.isShowModal = true;
  }

  hideModal(): void {
    this.isShowModal = false;
  }

  download(): void {
    const base64String = this.cardEbsServiceSelected.fileContent;
    const fileType = this.cardEbsServiceSelected.fileType;
    const fileName = this.cardEbsServiceSelected.fileName;

    if (!base64String || base64String === '') {
      return;
    }

    try {
      FileHelper.downloadFileFromBase64(base64String, fileName, fileType);
    } catch (error) {
      this.notificationService.showError('Tải file thất bại', 'Thông báo');
    }
  }
}
