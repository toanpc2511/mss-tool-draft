import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { AttachmentService } from './attachment.service';
declare var $: any;
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from '../../_utils/PermissionConst';
import { docStatus } from 'src/app/shared/models/documents';
import { element } from 'protractor';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
export class AttachmentComponent implements OnInit {

  processId = '';
  customerInfo: any;
  listAttachment = [];
  isCreateAttachment = false;
  isUpdateAttachment = false;
  createAttachmentForm: FormGroup;
  infoAttachmentType: any;
  file: File = null;
  checkErr = '';
  idAttachment: any;
  infoAttachment: any;
  fileDown: any;
  historyAttachment: any;
  isHistoryAttachment = false;
  isConfirm = false;
  readonly confim = {
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  @ViewChild('myInput', { static: false }) myInput: ElementRef;   // file upload
  @ViewChild('myInputUpload', { static: false }) myInputUpload: ElementRef;
  objDetailAttachment: any;
  isShowLoadingCallApi = false;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  // bắt sự kiện button
  isShowButton = false;
  isDisableButton = false;
  isLabelUpdate = false;
  isConfirmDelete = false;
  isConfirmSendAprrove = false;
  note = '';

  userInfo: any = {};
  isDisableButtonCreate = false;
  readonly docStatus = docStatus;
  statusCode: any;
  objProcess: any;
  isUpdate = false;
  isShowMessage = false;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private attachmentService: AttachmentService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private _LOCATION: Location,
    private authenticationService: AuthenticationService
  ) {
    this.initCreateAttachment();
  }

  ngOnInit(): void {
    $('.childName').html('Tài liệu đính kèm');
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.UPDATE);
    this.getProcessIdFromUrl();
    this.getProcessDetail();
  }

  backPage(): void {
    this._LOCATION.back();
  }

  initCreateAttachment(): void {
    this.createAttachmentForm = this.fb.group({
      title: ['', Validators.required],
      // attachmentTypeCode: ['', Validators.required],
    });
  }

  get title(): AbstractControl {
    return this.createAttachmentForm.get('title');
  }
  get attachmentTypeCode(): AbstractControl {
    return this.createAttachmentForm.get('attachmentTypeCode');
  }

  openModalCreate(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isCreateAttachment = res && res.responseStatus.success;
      });
    } else {
      this.isCreateAttachment = true;
    }
  }
  openModalUpdate(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        this.isUpdateAttachment = res && res.responseStatus.success;
      });
    } else {
      this.isUpdateAttachment = true;
    }
  }
  openModalHistory(): void {
    this.isHistoryAttachment = true;
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
  openModalView(item: any): void {
    this.infoAttachment = item;
    if (this.infoAttachment.fileContent === null) {
      return;
    }
    if (this.infoAttachment.fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      && this.infoAttachment.fileType !== 'application/pdf'
      && this.infoAttachment.fileType !== 'application/msword'
    ) {
      return;
    }
    if (this.infoAttachment.fileType === 'application/pdf') {
      const base64Pdf = this.infoAttachment.fileContent;
      const linkSource = 'data:application/pdf;base64,' + base64Pdf;
      const downloadLink = document.createElement('a');
      const fileName = this.infoAttachment.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    if (this.infoAttachment.fileType === 'application/msword') {
      const base64Doc = this.infoAttachment.fileContent;
      const linkSource = 'data:application/msword;base64,' + base64Doc;
      const downloadLink = document.createElement('a');
      const fileName = this.infoAttachment.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
    if (this.infoAttachment.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const base64Doc = this.infoAttachment.fileContent;
      const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + base64Doc;
      const downloadLink = document.createElement('a');
      const fileName = this.infoAttachment.fileName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
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
  // cofirm gửi duyệt bản ghi
  confimSendAprrove(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirmSendAprrove = false;
        break;
      case this.confim.CONFIM:
        this.sendAprroveAttachment();
        this.isConfirmSendAprrove = false;
        break;
      default:
        break;
    }
  }
  sendAprroveAttachment(): void {
    let typeCode = 'ATTACHMENT';
    if (this.infoAttachment.currentStatusCode === 'ACTIVE') {
      typeCode = 'ATTACHMENT';
      const body = {
        note: this.note,
        id: this.infoAttachment.id,
        typeCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendApproveUpdateAttachment',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.notificationService.showSuccess('Gửi duyệt cập nhật tài liệu đính kèm thành công', 'Thành công');
              this.getAttachmentList();
              this.resetFormAttachment();
            } else {
              this.notificationService.showError('Gửi duyệt cập nhật tài liệu đính kèm thất bại', 'Thất bại');
              this.resetFormAttachment();
            }
            this.isConfirmSendAprrove = false;
          }
        }
      );
    } else {
      const body = {
        note: this.note,
        id: this.infoAttachment.id,
        typeCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendApproveCreateAttachment',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.notificationService.showSuccess('Gửi duyệt tài liệu đính kèm thành công', 'Thành công');
              this.getAttachmentList();
              this.resetFormAttachment();
            } else {
              this.notificationService.showError('Gửi duyệt tài liệu đính kèm thất bại', 'Thất bại');
              this.resetFormAttachment();
            }
            this.isConfirmSendAprrove = false;
          }
        }
      );
    }
  }
  // resetForm
  resetFormAttachment(): void {
    this.isHistoryAttachment = false;
    this.isUpdateAttachment = false;
    this.isCreateAttachment = false;
    this.createAttachmentForm.reset();
    this.myInput.nativeElement.value = '';
    this.myInputUpload.nativeElement.value = '';
    this.checkErr = '';
    this.file = this.fileDown = null;
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
            this.customerInfo = res.item.customer;
            this.objProcess = res.item;
            this.statusCode = res.item.statusCode;
            this.getAttachmentList();
          }
        }
      }
    );
  }

  // lấy danh sách tài liệu đính kèm
  getAttachmentList(): void {
    const body = {
      processId: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/list',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.listAttachment = res.items;
            this.checkRoleUniForm();
          } else {
            this.checkRoleUniForm();
          }
        }
      }
    );
  }
  checkProcessPendding(): boolean {
    if ((this.statusCode === docStatus.EDIT        // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
      || this.statusCode === docStatus.WAIT        // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
      || this.statusCode === docStatus.TEMP
      || this.statusCode === this.docStatus.MODIFY)
      && (this.objProcess.createdBy !== this.userInfo.userId)) {
      this.isShowMessage = this.isUpdate;
      return true;
    } else {
      this.isShowMessage = false;
      return false;
    }
  }
  checkProcessAproveReject(): boolean {
    return this.statusCode === docStatus.APPROVED        // 1.nếu là đã duyệt và từ chối thì ẩn hết button
      || this.statusCode === docStatus.SUCCESS
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
    // xử lý phân quyền url button thêm mới
    if (this.listAttachment === []) {
      this.isDisableButtonCreate = true;
    } else {
      this.isDisableButtonCreate = this.authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.CREATE);
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
      this.listAttachment.forEach(element => {
        element.isUpdateUpload = (element.currentStatusCode === 'ACTIVE');
        // xử lý phân quyền url button cập nhật
        element.isShowButtonU = this.isUpdate;
        if (element.isShowButtonU) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonU = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {
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
                    element.isShowButtonU = element.changeStatusCode !== 'ACTIVE';
                  }
                }
              }
            }
          }
        }

        // xử lý phân quyền url button lịch sử
        element.isShowButtonH = this.authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.HISTORY);
        if (element.isShowButtonH) {
          element.isShowButtonH = (element.currentStatusCode === 'ACTIVE')
            && (element.changeStatusCode === 'ACTIVE' || element.changeStatusCode === null);
        }
        // xử lý phân quyền url button xóa file
        element.isShowButtonD = this.authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.DELETE_FILE);
        if (element.isShowButtonD) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonD = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {
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
                    && element.changeStatusCode !== 'ACTIVE' && element.changeStatusCode !== 'ACTIVE';
                }
              }
            }
          }
        }

        // xử lý phân quyền url button xóa
        element.isShowButtonDAtt = this.authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.DELETE);
        if (element.isShowButtonDAtt) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isShowButtonDAtt = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {
              element.isShowButtonDAtt = false;
            } else {
              // check hồ sơ không pendding đã duyệt, từ chối
              if (this.checkProcessAproveReject()) {
                element.isShowButtonDAtt = false;
              } else {
                // check người tạo cif chính với người đăng nhập
                if (this.objProcess.customer.branch.code !== this.userInfo.branchCode) {
                  element.isShowButtonDAtt = false;
                } else {
                  element.isShowButtonDAtt = element.fileStatusCode !== 'APPROVED' &&
                    element.currentStatusCode !== 'ACTIVE' && element.changeStatusCode !== 'ACTIVE';
                }
              }
            }
          }
        }

        // xử lý phân quyền url button gửi duyệt
        element.isSendAprrove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_ATTACHMENT);
        if (element.isSendAprrove) {
          // check cif bị đánh dấu
          if (this.checkProcessMark()) {
            element.isSendAprrove = false;
          } else {
            // check hồ sơ pendding và user tạo hồ sơ != user login
            if (this.checkProcessPendding()) {
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
                      && element.processIntegrated?.statusCode !== 'W';
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
              if (callback) {
                callback(res);
              }
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              this.cdr.detectChanges();
            }
          }
        }
      }
    );
  }

  // upload
  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = file;
    }
    this.doCheckRequiredFile(this.file);
  }

  // bắt lỗi uplad
  doCheckRequiredFile(file: any): void {
    this.checkErr = '';
    if (!file || file.length === 0) {
      this.checkErr = 'File tài liệu đang để trống';
      return;
    }
    else if ((file.size / 1024) > 500) {
      this.checkErr = 'File tài liệu quá dung lượng';
      return;
    }
    else if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      && file.type !== 'application/msword' && file.type !== 'application/pdf') {
      this.checkErr = 'Định dạng không đúng';
      return;
    }
  }

  // upload update
  onFileSelectUpdate(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileDown = file;
    }
    this.doCheckRequiredFileUpdate(this.fileDown);
    this.cdr.detectChanges();
  }

  // bắt lỗi uplad update
  doCheckRequiredFileUpdate(file: any): void {
    this.checkErr = '';
    if (!file || file.length === 0) {
      this.checkErr = 'File tài liệu đang để trống';
      return;
    }
    else if ((file.size / 1024) > 500) {
      this.checkErr = 'File tài liệu quá dung lượng';
      return;
    }
    else if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      && file.type !== 'application/msword' && file.type !== 'application/pdf') {
      this.checkErr = 'Định dạng không đúng';
      return;
    }
  }

  // lấy dữ liệu form
  objAttachment(): any {
    let obj = null;
    this.createAttachmentForm.markAllAsTouched();
    if (!this.createAttachmentForm.invalid) {
      obj = this.createAttachmentForm.getRawValue();
    }
    return obj ? obj : null;
  }

  // tạo mới tài liệu đính kèm
  checkCreateAttachment(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.createAttachment();
        } else {
          return;
        }
      });
    } else {
      this.createAttachment();
    }
  }
  createAttachment(): void {
    const formValueCreate = this.objAttachment();
    if (!formValueCreate) {
      this.doCheckRequiredFile(this.file);
      return;
    } else if (this.file === null) {
      this.doCheckRequiredFile(this.file);
      return;
    }
    const tempDto = {
      processId: this.processId,
      startDate: moment(Date.now()).format('DD/MM/YYYY'),
      title: formValueCreate.title ? formValueCreate.title : '',
    };
    const rq = {
      dto: tempDto,
      file: this.file
    };
    this.isShowLoadingCallApi = true;
    this.attachmentService.createAttachment(rq).subscribe(res => {
      if (res && res.responseStatus.success === true) {
        this.notificationService.showSuccess('Thêm tài liệu đính kèm thành công', '');
        this.getAttachmentList();
        this.resetFormAttachment();
        this.isShowLoadingCallApi = false;
      } else {
        this.isShowLoadingCallApi = false;
        this.notificationService.showError('Thêm tài liệu đính kèm thất bại', '');
      }
    }, error => {
      this.notificationService.showError('Đã có lỗi xảy ra', '');
      this.isShowLoadingCallApi = false;
    });
  }

  // lấy detail
  getDetail(item: any): void {
    this.idAttachment = item.id;
    this.getDetailAttachment();
    this.getHistoryAttachment(item);
  }

  // lấy detail tài liệu đính kèm
  getDetailAttachment(): void {
    const body = {
      id: this.idAttachment
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.infoAttachment = res.item;
            this.getValueUpdate(this.infoAttachment);
          }
        }
      }
    );
  }

  // gán dữ liệu update
  getValueUpdate(item: any): void {
    this.createAttachmentForm.patchValue({
      title: item.title,
    });
    this.getFiletoBlob();
    if (item.fileStatusName !== 'Đã duyệt') {
      this.isLabelUpdate = true;
    }
    this.cdr.detectChanges();
  }

  // update tài liệu đính kèm
  getUpdateAttachment(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.updateAttachment();
        } else {
          return;
        }
      });
    } else {
      this.updateAttachment();
    }
  }
  updateAttachment(): void {
    if (this.infoAttachment.fileContent === null && this.fileDown === null) {
      this.doCheckRequiredFileUpdate(this.fileDown);
      return;
    } else {
      this.doCheckRequiredFileUpdate(this.fileDown);
      if (this.checkErr !== '') {
        return;
      }
      const formValueCreate = this.objAttachment();
      if (!formValueCreate) {
        return;
      }
      const tempDto = {
        id: this.infoAttachment.id,
        title: formValueCreate.title ? formValueCreate.title : '',
        startDate: moment(Date.now()).format('DD/MM/YYYY'),
        attachmentTypeCode: formValueCreate.attachmentTypeCode ? formValueCreate.attachmentTypeCode : ''
      };
      const rq = {
        dto: tempDto,
        file: this.fileDown
      };
      this.isShowLoadingCallApi = true;
      this.attachmentService.UpdateAttachment(rq).subscribe(res => {
        if (res && res.responseStatus.success === true) {
          this.notificationService.showSuccess('Update tài liệu thành công', '');
          this.getAttachmentList();
          this.resetFormAttachment();
          this.isShowLoadingCallApi = false;
        } else {
          this.notificationService.showError('Update tài liệu thất bại', '');
          this.isShowLoadingCallApi = false;
        }
      }, error => {
        this.notificationService.showError('Đã có lỗi xảy ra', '');
        this.isShowLoadingCallApi = false;
      });
    }
  }

  // revert file update
  getFiletoBlob(): void {
    const pattern = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    this.checkErr = '';
    if (!pattern.test(this.infoAttachment.fileContent)) {
      return;
    }
    if (this.infoAttachment.fileType === 'application/pdf') {
      const base64 = this.infoAttachment.fileContent;
      const imageName = this.infoAttachment.fileName;
      const imageBlob = this.dataURItoBlobPdf(base64);
      const PdfFile = new File([imageBlob], imageName, { type: 'application/pdf' });
      this.fileDown = PdfFile;
    }
    if (this.infoAttachment.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const base64 = this.infoAttachment.fileContent;
      const imageName = this.infoAttachment.fileName;
      const imageBlob = this.dataURItoBlobDoc(base64);
      const docFile = new File([imageBlob], imageName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      this.fileDown = docFile;
    }
    if (this.infoAttachment.fileType === 'application/msword') {
      const base64 = this.infoAttachment.fileContent;
      const imageName = this.infoAttachment.fileName;
      const imageBlob = this.dataURItoBlobDoc(base64);
      const docFile = new File([imageBlob], imageName, { type: 'application/msword' });
      this.fileDown = docFile;
    }
  }

  // cofirm xóa hoặc không xóa file tài liệu
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirm = false;
        break;
      case this.confim.CONFIM:
        this.getDeleteAttachmentFile();
        this.isConfirm = false;
        break;
      default:
        break;
    }
  }

  // cofirm xóa hoặc không xóa tài liệu
  confimRemoveDataAtt(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirmDelete = false;
        break;
      case this.confim.CONFIM:
        this.getDeleteAttachment();
        this.isConfirmDelete = false;
        break;
      default:
        break;
    }
  }

  // xóa tài liệu
  getDeleteAttachment(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.deleteAttachment();
        } else {
          return;
        }
      });
    } else {
      this.deleteAttachment();
    }
  }
  deleteAttachment(): void {
    const body = {
      id: this.infoAttachment.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/delete',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa tài liệu thành công', '');
            this.router.navigate(['./smart-form/manager/attachment', { processId: this.processId }]);
          } else {
            this.notificationService.showError('Xảy ra lỗi : ' + res.responseStatus.codes[0].detail, '');
          }
        }
      }
    );
  }

  // xóa file tài liệu
  getDeleteAttachmentFile(): void {
    if (this.objProcess.customerCode) {
      this.checkEditable(res => {
        if (res && res.responseStatus.success) {
          this.deleteAttachmentFile();
        } else {
          return;
        }
      });
    } else {
      this.deleteAttachmentFile();
    }
  }
  deleteAttachmentFile(): void {
    const body = {
      id: this.infoAttachment.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/deleteFile',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa file tài liệu thành công', '');
            this.getAttachmentList();
          } else {
            this.notificationService.showError('Xảy ra lỗi : ' + res.responseStatus.codes[0].detail, '');
          }
        }
      }
    );
  }

  // xem history tài liệu đính kèm
  getHistoryAttachment(item): void {
    const body = {
      attachmentNumber: item.attachmentNumber,
      customerCode: item.customerCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/history',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.historyAttachment = res.items;
          }
        }
      }
    );
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

  // tslint:disable-next-line: typedef
  dataURItoBlobDoc(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return blob;
  }

}
