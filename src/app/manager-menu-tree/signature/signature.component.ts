
import { ChangeDetectorRef, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscriber } from 'rxjs';
import { MissionService } from 'src/app/services/mission.service';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SignatureService } from './signature.service';
import { Location } from '@angular/common';
import { compareDate } from 'src/app/shared/constants/utils';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from '../../_utils/PermissionConst';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
  readonly docStatus = docStatus;
  customerInfo: any;
  processId = '';
  idSelected = '';
  detailSignature: any;
  signatureCreate: any;
  historySignature: any;
  historyViewSignature: any;
  signatureId = '';
  isSignature = false;
  isEditSignature = false;
  isUpdateSignature = false;
  isHistorySignature = false;
  isViewSignature = false;
  createSignatureForm: FormGroup;
  file: File = null;
  checkErr = '';
  objDetailSignature: any;
  infoAttachmentType: any;
  @ViewChild('dpexpireDate', { static: false }) dpexpireDate: LpbDatePickerComponent;
  @ViewChild('dpexpireDateEdit', { static: false }) dpexpireDateEdit: LpbDatePickerComponent;
  @ViewChild('dpexpireDateUpdate', { static: false }) dpexpireDateUpdate: LpbDatePickerComponent;
  @ViewChild('myInput', { static: false }) myInput: ElementRef;
  @ViewChild('myInputUpload', { static: false }) myInputUpload: ElementRef;
  lstSignature = [];
  currentDate: Date = new Date();
  fileDown: any;
  myimage: Observable<any>;
  viewSignature: Observable<any>;
  linkURL: SafeUrl;
  filePdf: File = null;
  readonly confim = {
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  isConfirm = false;
  roleLogin: any = [];
  isGDV = false;
  isKSV = false;
  isConfirmDelete = false;
  title1: any;  // tiền tố Uniform
  title2: any;  // tên tài liệu sau tiền tố
  isConfirmSendAprrove = false;

  isShowLoadingCallApi = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  note = '';
  isDisableButtonCreate = false;
  isUpdateUpload = false;
  userInfo: any = {};
  statusCode: any;
  objProcess: any;
  isCheckEdit = null;
  isShowMessage = false;
  isUpdate = false;
  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private signatureService: SignatureService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private _LOCATION: Location,
    private authenticationService: AuthenticationService
  ) {
    this.initCreateSignature();
  }

  ngOnInit(): void {
    $('.childName').html('Chữ ký');
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.CHU_KY.CAP_NHAT);
    this.getProcessIdFromUrl();
    this.getProcessDetail();
    // this.getSignatureList();
  }

  backPage(): void {
    this._LOCATION.back();
  }

  initCreateSignature(): void {
    this.createSignatureForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(105)]],
      title: ['', [Validators.required, Validators.maxLength(105)]],
      endDate: [''],
    });
  }

  checkProcessPendding(): boolean {
    if ((this.statusCode === docStatus.EDIT        // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
      || this.statusCode === docStatus.WAIT        // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
      || this.statusCode === docStatus.TEMP  // && this.objProcess.createdBy !== this.userInfo.userId
      || this.statusCode === this.docStatus.MODIFY)  // this.objProcess.customer.branch.code !== this.userInfo.branchCode
      && (this.objProcess.createdBy !== this.userInfo.userId)
    ) {
      this.isShowMessage = this.isUpdate;
      return true;
    } else {
      this.isShowMessage = false;
      return false;
    }
  }
  checkProcessAproveReject(): boolean {
    return this.statusCode === docStatus.APPROVED        // 1.nếu là đã duyệt và từ chối thì ẩn hết button
      || this.statusCode === docStatus.SUCCESS        // 2.nếu ko phải thì check tới chi nhánh của dịch vụ
      || this.statusCode === docStatus.REJECT
      || this.statusCode === docStatus.CANCEL
      || this.statusCode === docStatus.DELETED;
  }
  checkProcessMark(): boolean {                         // cif bị đánh dấu
    return this.customerInfo.statusCif === 'C' || this.customerInfo.statusCif === 'Y';
  }

  // check quyền nút button
  checkRoleUniForm(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isDisableButtonCreate = this.authenticationService.isPermission(PermissionConst.CHU_KY.CREATE);
    // xử lí phân quyền url thêm mới
    if (this.lstSignature === []) {
      this.isDisableButtonCreate = true;
    } else {
      this.isDisableButtonCreate = this.authenticationService.isPermission(PermissionConst.CHU_KY.CREATE);
      if (this.isDisableButtonCreate) {
        // check cif đánh dấu
        if (this.checkProcessMark()) {
          this.isDisableButtonCreate = false;
        } else {
          // check hồ sơ không pendding
          if (this.checkProcessAproveReject()) {
            this.isDisableButtonCreate = false;
          } else {
            this.isDisableButtonCreate = !this.checkProcessPendding();
          }
        }
      }
      this.lstSignature.forEach(element => {
        element.isUpdateUpload = (element.currentStatusCode === 'ACTIVE');
        const titleuniForm = element.title;
        if (titleuniForm.indexOf('-') !== -1) {
          const lenght = titleuniForm.indexOf('-') + 1;
          this.title1 = titleuniForm.slice(0, lenght);
          this.title2 = titleuniForm.slice(lenght, titleuniForm.length);
        } else {
          this.title1 = '';
          this.title2 = element.title;
        }
        // xử lí phân quyền url button UPDATE
        element.isShowButtonU = this.isUpdate;
        if (element.isShowButtonU) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonU = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {       //  && element.createdByUser.id !== this.userInfo.userId
              element.isShowButtonU = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isShowButtonU = false;
              } else {
                // check dịch vụ bị từ chối
                if (element.processIntegrated && element.processIntegrated.statusCode === 'R') {
                  element.isShowButtonU = false;
                } else {
                  // check người tạo cif chính với người đăng nhập
                  if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                    element.isShowButtonU = false;
                  } else {
                    element.isShowButtonU = element.viewAction !== 'Y';
                  }
                }
              }
            }
          }
        }

        // xử lí phân quyền url button EDIT
        element.isShowButtonE = this.authenticationService.isPermission(PermissionConst.CHU_KY.EDIT);
        if (element.isShowButtonE) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonE = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {       //  && element.createdByUser.id !== this.userInfo.userId
              element.isShowButtonE = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isShowButtonE = false;
              } else {
                // check dịch vụ bị từ chối
                if (element.processIntegrated && element.processIntegrated.statusCode === 'R') {
                  element.isShowButtonE = false;
                } else {
                  // check người tạo cif chính với người đăng nhập
                  if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                    element.isShowButtonE = false;
                  } else {
                    element.isShowButtonE = element.fileContent !== null && element.viewAction !== 'Y';
                  }
                }
              }
            }
          }
        }

        // xử lí phân quyền url button HISTORY
        element.isShowButtonH = this.authenticationService.isPermission(PermissionConst.CHU_KY.HISTORY);
        if (element.isShowButtonH) {
          element.isShowButtonH = element.currentStatusCode === 'ACTIVE'
            && (element.changeStatusCode === 'ACTIVE' || element.changeStatusCode === null);
        }
        // xử lí phân quyền url button DELETE_FILE
        element.isShowButtonD = this.authenticationService.isPermission(PermissionConst.CHU_KY.DELETE_FILE);
        if (element.isShowButtonD) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonD = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {       //  && element.createdByUser.id !== this.userInfo.userId
              element.isShowButtonD = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isShowButtonD = false;
              } else {
                // check người tạo cif chính với người đăng nhập
                if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                  element.isShowButtonD = false;
                } else {
                  element.isShowButtonD = element.fileContent !== null && element.fileStatusCode !== 'APPROVED'
                    && element.changeStatusCode !== 'ACTIVE' && element.viewAction !== 'Y';
                }
              }
            }
          }
        }

        // xử lí phân quyền url button DELETE
        element.isShowButtonDSig = this.authenticationService.isPermission(PermissionConst.CHU_KY.DELETE);
        if (element.isShowButtonDSig) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonDSig = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {       //  && element.createdByUser.id !== this.userInfo.userId
              element.isShowButtonDSig = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isShowButtonDSig = false;
              } else {
                // check người tạo cif chính với người đăng nhập
                if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                  element.isShowButtonDSig = false;
                } else {
                  element.isShowButtonDSig = element.fileStatusCode !== 'APPROVED' &&
                    element.currentStatusCode !== 'ACTIVE' && element.title1 !== '';
                }
              }
            }
          }
        }

        // xử lí phân quyền url button SEND_APPROVE
        element.isSendAprrove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_SIGNATURE);
        if (element.isSendAprrove) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isSendAprrove = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {       //  && element.createdByUser.id !== this.userInfo.userId
              element.isSendAprrove = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isSendAprrove = false;
              } else {
                // check dịch vụ bị từ chối
                if (element.processIntegrated && element.processIntegrated.statusCode === 'R') {
                  element.isSendAprrove = false;
                } else {
                  // check người tạo cif chính với người đăng nhập
                  if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                    element.isSendAprrove = false;
                  } else {
                    element.isSendAprrove = element.fileContent !== null && element.fileStatusCode !== 'APPROVED'
                      && element.processIntegrated?.statusCode !== 'W' && element.viewAction !== 'Y';
                  }
                }
              }
            }
          }
        }
      });
    }
  }

  // check thao tác hồ sơ
  checkEditable(callback?): void {
    const body = {
      processId: this.processId,
      customerCode: this.objProcess.customerCode
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/checkEditable',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (res.item.editable === true) {
              this.isCheckEdit = true;
              if (callback) {
                callback(res);
              }
            } else {
              this.isCheckEdit = false;
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              this.cdr.detectChanges();
            }
          }
        }
      }
    );
  }


  // cofirm xóa hoặc không xóa tài liệu
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirm = false;
        break;
      case this.confim.CONFIM:
        this.getDeleteSignatureFile();
        this.isConfirm = false;
        break;
      default:
        break;
    }
  }

  // cofirm xóa hoặc không xóa tài liệu bản ghi
  confimRemoveDataDelete(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirmDelete = false;
        break;
      case this.confim.CONFIM:
        this.getDeleteSignature();
        this.isConfirmDelete = false;
        break;
      default:
        break;
    }
  }

  // cofirm gửi duyệt bản ghi
  confimSendAprrove(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirmSendAprrove = false;
        break;
      case this.confim.CONFIM:
        this.sendCreateSignature();
        this.isConfirmSendAprrove = false;
        break;
      default:
        break;
    }
  }

  sendCreateSignature(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.guiDuyet();
        } else {
          return;
        }
      });
    } else {
      this.guiDuyet();
    }
  }
  guiDuyet(): void {
    let typeCode = 'SIGN';
    if (this.objDetailSignature.currentStatusCode === 'ACTIVE') {
      typeCode = 'SIGNU';
      const body = {
        note: this.note,
        id: this.objDetailSignature.id,
        typeCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendApproveUpdateSignature',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.resetFormSig();
              this.getSignatureList();
              this.notificationService.showSuccess('Gửi duyệt cập nhật chữ ký thành công', 'Thành công');
            } else {
              this.notificationService.showError('Gửi duyệt cập nhật chữ ký thất bại', 'Thất bại');
            }
            this.isConfirmSendAprrove = false;
          }
        }
      );
    } else {
      const body = {
        note: this.note,
        id: this.objDetailSignature.id,
        typeCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendApproveCreateSignature',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.resetFormSig();
              this.getSignatureList();
              this.notificationService.showSuccess('Gửi duyệt chữ ký thành công', 'Thành công');
            } else {
              this.notificationService.showError('Gửi duyệt chữ ký thất bại', 'Thất bại');
            }
            this.isConfirmSendAprrove = false;
          }
        }
      );
    }
  }

  // lấy dữ liệu form
  objSignature(): any {
    let obj = null;
    this.createSignatureForm.markAllAsTouched();
    this.validatorExpireDate();
    if (!this.createSignatureForm.invalid) {
      obj = this.createSignatureForm.getRawValue();
    }
    return obj ? obj : null;
  }
  // reset form tạo mới
  resetFormSig(): void {
    this.myInput.nativeElement.value = '';
    this.myInputUpload.nativeElement.value = '';
    this.createSignatureForm.reset();
    this.dpexpireDate.setValue('');
    this.dpexpireDate.setErrorMsg('');
    this.file = null;
    this.fileDown = null;
    this.isSignature = false;
    this.isUpdateSignature = false;
    this.isHistorySignature = false;
    this.cdr.detectChanges();
  }
  // reset form view
  resetForView(): void {
    this.myimage = null;
    this.linkURL = null;
  }
  // reset form edit
  resetFormEdit(): void {
    this.dpexpireDateEdit.setValue('');
    this.dpexpireDateEdit.setErrorMsg('');
    this.isEditSignature = false;
  }

  // lấy id của process
  getProcessIdFromUrl(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.missionService.setProcessId(this.processId);
  }

  // lấy thông tin khách hàng
  getProcessDetail(): void {
    const body = {
      id: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.objProcess = res.item;
            this.customerInfo = res.item.customer;
            this.statusCode = res.item.statusCode;
            this.getSignatureList();
          }
        }
      }
    );
  }

  // lấy danh sách chữ ký
  getSignatureList(): void {
    const body = {
      processId: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/list',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.lstSignature = res.items;
            this.checkRoleUniForm();
          } else {
            this.checkRoleUniForm();
          }
        }
      }
    );
  }

  // bắt lỗi ngày
  validatorExpireDate(): void {
    this.dpexpireDate.setErrorMsg('');
    if (this.dpexpireDate.haveValue() && !this.dpexpireDate.haveValidDate()) {
      this.dpexpireDate.setErrorMsg('Ngày hết hiệu lực sai định dạng');
      return;
    }
    if (compareDate(moment(this.dpexpireDate.getValue(), 'DD/MM/YYYY'), moment(Date.now()).format('DD/MM/YYYY')) === -1) {
      this.dpexpireDate.setErrorMsg('Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại');
    }
    if (this.dpexpireDate.errorMsg === '') {
      this.endDate.setValue(this.dpexpireDate.getValue());
    }
  }
  expireDateChanged(): void {
    this.validatorExpireDate();
  }

  // upload
  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
    this.doCheckRequiredFile(this.file);
  }
  // upload update
  onFileSelectUpdate(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileDown = file;
      this.convertToBase64(file);
    }
    this.doCheckRequiredFileUpdate(this.fileDown);
    this.cdr.detectChanges();
  }

  // bắt lỗi uplad
  doCheckRequiredFile(file: any): void {
    this.checkErr = '';
    if (!file || file.length === 0) {
      this.checkErr = 'File chữ ký không được để trống';
      return;
    }
    else if ((file.size / 1024) > 100) {
      this.checkErr = 'Dung lượng file vượt quá 100 KB';
      return;
    }
    else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.checkErr = 'Định dạng không đúng';
      return;
    }
  }

  // bắt lỗi upload update
  doCheckRequiredFileUpdate(file: any): void {
    this.checkErr = '';
    if (!file || file.length === 0) {
      this.checkErr = 'File chữ ký đang để trống';
      return;
    }
    else if ((file.size / 1024) > 100) {
      this.checkErr = 'Dung lượng file vượt quá 100 KB';
      return;
    }
    else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.checkErr = 'Định dạng không đúng';
      return;
    }
  }

  // lấy detail chữ ký
  getDetail(item: any): void {
    this.objDetailSignature = item;
    this.getValueSignature(item.endDate);
    this.getValueUpdate(item);
    this.getDetailSignature();
  }
  // lấy lịch sử
  getDetailHistory(item): void {
    this.objDetailSignature = item;
    this.getHistorySignature();
  }

  // lấy detail chữ ký
  getDetailSignature(): void {
    const body = {
      id: this.objDetailSignature.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.detailSignature = res.item;
          }
        }
      }
    );
  }

  // gán ngày hết hiệu lực edit
  getValueSignature(item: any): void {
    this.dpexpireDateEdit.setValue(item ? item : '');
    if (item === null) {
      this.dpexpireDate.setErrorMsg('');
    }
    this.cdr.detectChanges();
  }
  // gán dữ liệu update
  getValueUpdate(item: any): void {
    this.dpexpireDateUpdate.setValue(item.endDate ? item.endDate : '');
    const titleUni = this.objDetailSignature.title;

    if (titleUni.indexOf('-') !== -1) {
      const lenght = titleUni.indexOf('-') + 1;
      this.title1 = titleUni.slice(0, lenght);
      this.title2 = titleUni.slice(lenght, titleUni.length);
    } else {
      this.title1 = '';
      this.title2 = this.objDetailSignature.title;
    }

    this.createSignatureForm.patchValue({
      fullName: this.objDetailSignature.fullName,
      title: this.title2,
      // attachmentTypeCode: this.objDetailSignature.attachmentTypeCode
    });
    this.getFiletoBlob();
    this.cdr.detectChanges();
  }

  // tạo mới chữ ký
  getCreateSignature(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.createSignature();
        } else {
          return;
        }
      });
    } else {
      this.createSignature();
    }
  }
  createSignature(): void {
    const infoSignature = this.objSignature();
    if (!infoSignature) {
      this.doCheckRequiredFile(this.file);
      return;
    } else if (this.file === null) {
      this.doCheckRequiredFile(this.file);
      return;
    } else if (this.dpexpireDate.errorMsg !== '') {
      return;
    }
    this.validatorExpireDate();
    const tempDto = {
      processId: this.processId,
      title: infoSignature.title ? '[UniForm]-' + infoSignature.title : '',
      startDate: moment(Date.now()).format('DD/MM/YYYY'),
      endDate: infoSignature.endDate ? infoSignature.endDate : '',
      fullName: infoSignature.fullName ? infoSignature.fullName : '',
      // attachmentTypeCode: infoSignature.attachmentTypeCode ? infoSignature.attachmentTypeCode : ''
    };
    const rq = {
      dto: tempDto,
      file: this.file
    };
    this.isShowLoadingCallApi = true;
    this.signatureService.createSignature(rq).subscribe(res => {
      if (res && res.responseStatus.success === true) {
        this.notificationService.showSuccess('Thêm chữ ký thành công', '');
        this.getSignatureList();
        this.resetFormSig();
        this.isShowLoadingCallApi = false;
      } else {
        this.isShowLoadingCallApi = false;
        this.notificationService.showError('Thêm mới chữ thất bại', '');
      }
    }, error => {
      this.notificationService.showError('Đã có lỗi xảy ra', '');
      this.isShowLoadingCallApi = false;
    });
  }

  // update thông tin chữ ký
  checkAllowUpdateSignature(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.updateSignature();
        } else {
          return;
        }
      });
    } else {
      this.updateSignature();
    }
  }
  updateSignature(): void {
    if (this.fileDown === null && this.objDetailSignature.fileContent === null) {
      this.doCheckRequiredFileUpdate(this.fileDown);
      return;
    } else {
      this.doCheckRequiredFileUpdate(this.fileDown);
      if (this.checkErr !== '') {
        return;
      }
      if (this.dpexpireDateUpdate.errorMsg !== '') {
        return;
      }
      const infoSignature = this.objSignature();
      if (!infoSignature) {
        return;
      }
      const tempDto = {
        id: this.objDetailSignature.id,
        title: infoSignature.title ? this.title1 + infoSignature.title : '',
        startDate: moment(Date.now()).format('DD/MM/YYYY'),
        endDate: this.dpexpireDateUpdate.haveValue() ? this.dpexpireDateUpdate.getValue() : '',
        fullName: infoSignature.fullName ? infoSignature.fullName : '',
        attachmentTypeCode: infoSignature.attachmentTypeCode ? infoSignature.attachmentTypeCode : ''
      };
      const rq = {
        dto: tempDto,
        file: this.fileDown
      };
      this.isShowLoadingCallApi = true;
      this.signatureService.UpdateSignature(rq).subscribe(res => {
        if (res && res.responseStatus.success === true) {
          this.notificationService.showSuccess('Update chữ ký thành công', '');
          this.resetFormSig();
          this.getSignatureList();
          this.cdr.detectChanges();
          this.isShowLoadingCallApi = false;
        } else {
          this.notificationService.showError('Update chữ ký thất bại', '');
          this.isShowLoadingCallApi = false;
        }
      }, error => {
        this.notificationService.showError('Đã có lỗi xảy ra', '');
        this.isShowLoadingCallApi = false;
      });
    }
  }
  // bắt lỗi ngày edit
  validatorEditExpireDate(): void {
    this.dpexpireDateEdit.setErrorMsg('');
    const contentInputEndDate = this.dpexpireDateEdit.haveValue() ? this.dpexpireDateEdit.getValue() : '';
    // if (this.objDetailSignature.startDate === null) {
    //   this.dpexpireDateEdit.setErrorMsg('Ngày hiệu lực chưa hiện hữu');
    //   return;
    // } else {
    //   this.dpexpireDateEdit.setErrorMsg('');
    // }
    if (this.objDetailSignature.endDate === null) {
      this.dpexpireDateEdit.setErrorMsg('');
    }
    if (this.dpexpireDateEdit.haveValue() && !this.dpexpireDateEdit.haveValidDate()) {
      this.dpexpireDateEdit.setErrorMsg('Ngày hết hiệu lực sai định dạng');
      return;
    }
    if (this.objDetailSignature.startDate !== null && contentInputEndDate) {
      if (compareDate(moment(this.dpexpireDateEdit.getValue(), 'DD/MM/YYYY'), this.objDetailSignature.startDate) === -1) {
        this.dpexpireDateEdit.setErrorMsg('Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại');
      }
    }
    if (this.dpexpireDateEdit.errorMsg === '') {
      this.dpexpireDateEdit.getValue();
      return;
    }
  }

  // bắt lỗi ngày update
  validatorUpdateExpireDate(): void {
    this.dpexpireDateUpdate.setErrorMsg('');
    const contentInputEndDate = this.dpexpireDateUpdate.haveValue() ? this.dpexpireDateUpdate.getValue() : '';
    if (contentInputEndDate === '') {
      this.dpexpireDateUpdate.setErrorMsg('');
      return;
    }
    if (this.dpexpireDateUpdate.haveValue() && !this.dpexpireDateUpdate.haveValidDate()) {
      this.dpexpireDateUpdate.setErrorMsg('Ngày hết hiệu lực sai định dạng');
      return;
    }
    if (this.objDetailSignature.startDate !== null) {
      if (compareDate(moment(this.dpexpireDateUpdate.getValue(), 'DD/MM/YYYY'), this.objDetailSignature.startDate) === -1) {
        this.dpexpireDateUpdate.setErrorMsg('Ngày hết hiệu lực không được nhỏ hơn ngày hiệu lực');
      }
    }
    if (compareDate(moment(this.dpexpireDateUpdate.getValue(), 'DD/MM/YYYY'), moment(Date.now()).format('DD/MM/YYYY')) === -1) {
      this.dpexpireDateUpdate.setErrorMsg('Ngày hết hiệu lực không được nhỏ hơn ngày hiện tại');
    }
    if (this.dpexpireDateUpdate.errorMsg === '') {
      this.dpexpireDateUpdate.getValue();
      return;
    }
  }

  expireEditDateChanged(): void {
    this.validatorEditExpireDate();
  }

  expireUpdateDateChanged(): void {
    this.validatorUpdateExpireDate();
  }



  // edit ngày hết hiệu lực
  checkAllowEditSignature(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.EditSignature();
        } else {
          return;
        }
      });
    } else {
      this.EditSignature();
    }
  }
  EditSignature(): void {
    this.validatorEditExpireDate();
    if (this.dpexpireDateEdit.errorMsg !== '') { return; }
    const body = {
      id: this.objDetailSignature.id,
      endDate: this.dpexpireDateEdit.haveValue() ? this.dpexpireDateEdit.getValue() : '',
    };
    this.isShowLoadingCallApi = true;
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/edit',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success === true) {
            this.notificationService.showSuccess('Sửa ngày hết hiệu lực chữ ký thành công', '');
            this.getSignatureList();
            this.resetFormEdit();
            this.isShowLoadingCallApi = false;
          } else {
            this.isShowLoadingCallApi = false;
            this.notificationService.showError('Sửa ngày hết hiệu lực chữ ký thất bại', '');
          }
          this.isShowLoadingCallApi = false;
        }
      }
    );
  }

  // xóa file chữ ký
  getDeleteSignatureFile(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.DeleteSignatureFile();
        } else {
          return;
        }
      });
    } else {
      this.DeleteSignatureFile();
    }
  }
  DeleteSignatureFile(): void {
    const body = {
      id: this.objDetailSignature.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/deleteFile',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa file chữ ký thành công', '');
            this.router.navigate(['./smart-form/manager/signature', { processId: this.processId }]);
            this.getSignatureList();
          } else {
            this.notificationService.showError('Xảy ra lỗi : ' + res.responseStatus.codes[0].detail, '');
          }
        }
      }
    );
  }

  // xóa chữ ký
  getDeleteSignature(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.DeleteSignature();
        } else {
          return;
        }
      });
    } else {
      this.DeleteSignature();
    }
  }
  DeleteSignature(): void {
    const body = {
      id: this.objDetailSignature.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/delete',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa chữ ký thành công', '');
            this.router.navigate(['./smart-form/manager/signature', { processId: this.processId }]);
          } else {
            this.notificationService.showError('Xảy ra lỗi : ' + res.responseStatus.codes[0].detail, '');
          }
        }
      }
    );
  }

  // xem history chữ ký
  getHistorySignature(): void {
    const body = {
      customerCode: this.objDetailSignature.customerCode,
      signatureNumber: this.objDetailSignature.signatureNumber,
      specimenNo: this.objDetailSignature.specimenNo
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/history',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.historySignature = res.items;
          }
        }
      }
    );
  }

  // xem chữ ký
  getViewSignature(): void {
    const body = {
      id: this.objDetailSignature.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/signature/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.viewSignature = res.item;
          }
        }
      }
    );
  }

  // tslint:disable-next-line: typedef
  convertToBase64(file: File) {
    this.myimage = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
  }

  // tslint:disable-next-line: typedef
  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  // tslint:disable-next-line: typedef
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpg' });
    return blob;
  }

  // tslint:disable-next-line: typedef
  dataURItoBlobPdf(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return blob;
  }

  // revert file update
  getFiletoBlob(): void {
    const pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    this.checkErr = '';
    if (!pattern.test(this.objDetailSignature.fileContent)) {
      return;
    }
    if (this.objDetailSignature.fileType === 'image/jpeg') {
      const base64 = this.objDetailSignature.fileContent;
      const imageName = this.objDetailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpg' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
    }
    if (this.objDetailSignature.fileType === 'image/png') {
      const base64 = this.objDetailSignature.fileContent;
      const imageName = this.objDetailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
    }
    if (this.objDetailSignature.fileType === 'application/pdf') {
      const base64 = this.objDetailSignature.fileContent;
      const imageName = this.objDetailSignature.fileName;
      const imageBlob = this.dataURItoBlobPdf(base64);
      const PdfFile = new File([imageBlob], imageName, { type: 'application/pdf' });
      this.fileDown = PdfFile;
    }
  }

  openModalCreate(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isSignature = res && res.responseStatus.success;
      });
    } else {
      this.isSignature = true;
    }
  }
  openModalDetail(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isEditSignature = res && res.responseStatus.success;
      });
    } else {
      this.isEditSignature = true;
    }
  }
  openModalUpdate(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isUpdateSignature = res && res.responseStatus.success;
      });
    } else {
      this.isUpdateSignature = true;
    }
  }
  openModalHistory(): void {
    this.isHistorySignature = true;
  }
  openModalConFirm(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isConfirm = res && res.responseStatus.success;
      });
    } else {
      this.isConfirm = true;
    }
  }
  openModalConFirmDelete(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isConfirmDelete = res && res.responseStatus.success;
      });
    } else {
      this.isConfirmDelete = true;
    }
  }
  openModalConFirmSendAprrove(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isConfirmSendAprrove = res && res.responseStatus.success;
      });
    } else {
      this.isConfirmSendAprrove = true;
    }
  }
  openModalView(item: any): void {
    this.objDetailSignature = item;
    if (this.objDetailSignature.fileContent === null) {
      return;
    }
    if (this.objDetailSignature.fileType !== 'image/jpeg'
      && this.objDetailSignature.fileType !== 'application/pdf'
      && this.objDetailSignature.fileType !== 'image/png'
    ) {
      return;
    }
    if (this.objDetailSignature.fileType === 'image/jpeg') {
      this.isViewSignature = true;
      const base64 = this.objDetailSignature.fileContent;
      const imageName = this.objDetailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/jpg' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
      this.cdr.detectChanges();
    }
    if (this.objDetailSignature.fileType === 'application/pdf') {
      this.isViewSignature = false;
      const base64Pdf = this.objDetailSignature.fileContent;
      const linkSource = 'data:application/pdf;base64,' + base64Pdf;
      const downloadLink = document.createElement('a');
      const fileName = this.objDetailSignature.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    if (this.objDetailSignature.fileType === 'image/png') {
      this.isViewSignature = true;
      const base64 = this.objDetailSignature.fileContent;
      const imageName = this.objDetailSignature.fileName;
      const imageBlob = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
      this.fileDown = imageFile;
      this.convertToBase64(this.fileDown);
      this.cdr.detectChanges();
    }
  }
  get fullName(): AbstractControl {
    return this.createSignatureForm.get('fullName');
  }
  get title(): AbstractControl {
    return this.createSignatureForm.get('title');
  }
  get endDate(): AbstractControl {
    return this.createSignatureForm.get('endDate');
  }
  get attachmentTypeCode(): AbstractControl {
    return this.createSignatureForm.get('attachmentTypeCode');
  }
}
