import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileHelper } from '../../shared/helpers/file.helper';
import {
  EbsServicesApproveObject,
  EbsServicesApproveRequest,
  EbsServicesRejectRequest,
} from '../../shared/models/card-services-approve';
import { NotificationService } from '../../../../_toast/notification_service';
import { MODAL_TYPES } from '../../shared/constants/card-service-constants';
import { CardEbsServicesApproveExtendService } from '../../shared/services/card-ebs-services-approve-extend.service';
import { ValidatorHelper } from '../../shared/helpers/validators.helper';
import { CardServicesFormComponent } from '../../shared/components/card-services-form/card-services-form.component';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';

@Component({
  selector: 'app-approve-card-termination-service',
  templateUrl: './approve-card-termination-service.component.html',
  styleUrls: ['./approve-card-termination-service.component.scss'],
})
export class ApproveCardTerminationServiceComponent
  implements OnInit, AfterViewInit
{
  @Input() cardEbsServiceSelected: EbsServicesApproveObject;
  @Input() isDetail = false;
  @ViewChild('cardServiceExtendForm', { static: false })
  cardServiceExtendForm: CardServicesFormComponent;
  formEbsServiceInfo: FormGroup;
  rejectForm: FormGroup;
  isShowLoading = false;
  isShowModal = false;

  @Output() eventBackStep = new EventEmitter();
  modalType = '';
  MODAL_TYPES = MODAL_TYPES;
  errorModalContents = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private cardExtendService: CardServicesExtendService,
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
      expireDate: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      cardTypeCode: [{ value: '', disabled: true }],
      cardStatusCode: [{ value: '', disabled: true }],
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
    // if (!this.isDetail) {
    //   try {
    //     this.cardExtendService.checkValidCardInfo(this.cardEbsServiceSelected);
    //     this.errorModalContents = [];
    //   } catch (error) {
    //     this.errorModalContents = [error.message];
    //     this.modalType = MODAL_TYPES.ERROR;
    //     this.cardServiceExtendForm.disableSend();
    //     this.isShowModal = true;
    //   }
    // }
    this.cdr.detectChanges();
  }

  backToSearch(evt?): void {
    this.eventBackStep.emit(evt);
  }

  openModal(event): void {
    this.modalType = event.modalType;
    this.isShowModal = true;
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
              res.responseStatus.codes[0].msg, 'Thông báo'
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
          this.backToSearch();
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
}
