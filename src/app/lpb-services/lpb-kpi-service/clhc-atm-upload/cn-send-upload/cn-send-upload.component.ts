import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserInfo} from '../../../../_models/user';
import {INFO_UPLOAD_TABLE_COLUMN, TYPE_UPLOAD} from '../../shared/util/clhc-atm-upload.constants';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FileService} from '../../shared/service/file.service';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {ILpbDialog, LpbDialogService} from '../../../../shared/services/lpb-dialog.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {CallService} from '../../shared/service/call.service';
import {NotificationService} from '../../../../_toast/notification_service';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {DATA_TABLE_BAO_HIEM_PHI, TYPE_DATA} from '../../shared/util/data-table-bao-hiem.constants';
import {ClhcAtmUpload} from '../../shared/models/clhc-atm-upload';
import {HTTPMethod} from '../../../../shared/constants/http-method';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '../../../../manager-admin/system-partner/confirm-dialog/confirm-dialog.component';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {DataTablePhiBhTotalConstants} from '../../shared/util/data-table-PNT-DVKD.constants';
import {takeUntil} from 'rxjs/operators';
import {PhiBaoHiemNhanThoService} from '../../shared/service/phi-bao-hiem-nhan-tho.service';
import {IError} from '../../../../shared/models/error.model';
import {DATA_TABLE_UPLOAD_KHDN} from '../../shared/util/data-table-upload-MBNT-KHDN.constants';
import {DATA_TABLE_NT_KHDN_CN} from '../../shared/util/data-table-NT-KHDN_CN.constant';
import {MuaBanNTKHDNService} from '../../shared/service/mua-ban-NT-KHDN.service';
import {
  DATA_TABLE_MBNT_KHCN,
  DATA_TABLE_MBNT_KHCN_PHANBO,
  MBNT_KHCN_COLUMN_ER, MBNT_KHCN_PB_COLUMN_ER
} from "../../shared/util/mbnt-khcn-upload.constants";
import {commonParam} from "../../shared/models/common-params";
import {ELECTRIC_SERVICE} from "../../../lpb-electric-service/shared/services/electric.service";

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cn-send-upload',
  templateUrl: './cn-send-upload.component.html',
  styleUrls: ['./cn-send-upload.component.scss']
})
export class CnSendUploadComponent implements OnInit {
  date = new FormControl(moment());
  dataSource = [];
  uploadForm: FormGroup;
  isDisabled = true;
  userInfo?: UserInfo;
  isType = '';
  configs: any = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  typeUpload: any;
  searchConditions: any;
  columns: any = INFO_UPLOAD_TABLE_COLUMN;
  typesUpload: any;
  selectConfig = {
    isNewApi: true,
    isSort: true
  };






  totalRecordSuccess = 0;
  totalRecordError = 0;
  files: File[] = [];
  isWarning = false;
  modalConfirm: MatDialogRef<any>;
  valueDate = '';
  isValidFile = false;
  totalRecordWarning = 0;
  totalRecord = 0;
  fileName = '';
  message = '';
  isSaveData = false;
  templateType: string[] = ['LKK', 'LKD'];
  isViewError = false;
  isNeedUpload = true;
  dataSourceRaw: any;
  isStatus = false;
  formTypeData: any;
  typeData = '';
  reason = '';
  warningReason = false;
  constructor(
    private dialogService: LpbDialogService,
    private notify: CustomNotificationService,
    private toastr: CustomNotificationService,
    private fileService: FileService,
    private destroy$: DestroyService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private call: CallService,
    private notificationService: NotificationService,
    private phibaohiemService: PhiBaoHiemNhanThoService,
    private matDialog: MatDialog,
    private muabanNtKHDnService: MuaBanNTKHDNService
  ) {
    this.initForm();
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  @ViewChild('dp', {static: false}) dp: LpbDatePickerComponent;
  @ViewChild('dateT', {static: false}) dateT: LpbDatePickerComponent;
  @ViewChild('modalSave', {static: true}) modalSave: TemplateRef<any>;

  ngOnInit(): void {
    this.typesUpload = TYPE_UPLOAD;
    //this.typesUpload.splice(5,1);
    this.formTypeData = TYPE_DATA;
    this.uploadForm.get('typeUpload').valueChanges.subscribe((value) => {
      this.isType = value;
      // this.dataSource = value;
      if (value === 'LKD') {
        this.columns = DataTablePhiBhTotalConstants;
        this.dataSource = [];
        // this.isViewError = true;
        this.isNeedUpload = true;
        this.isStatus = false;
      }
      if (value === 'LKK') {
        this.columns = INFO_UPLOAD_TABLE_COLUMN;
        this.isViewError = false;
        this.isStatus = false;
        this.isNeedUpload = false;
      }
      if (value === 'LKD1'){
        this.columns = DATA_TABLE_UPLOAD_KHDN;
        this.isStatus = true;
        this.isViewError = false;
        this.isNeedUpload = true;
      }
      if (value === 'LKD_KHCN'){
        this.columns = DATA_TABLE_MBNT_KHCN_PHANBO;
        this.isStatus = false;
        this.isViewError = false;
        this.isNeedUpload = true;
      }
    });
    this.uploadForm.patchValue({typeUpload: 'LKK'});
    setTimeout(() => {
      if (this.isType === 'LKK') {
        this.dateT.setValue(this.datepipe.transform(moment().toDate(), 'MM/yyyy'));
        //this.initshow();
      }
    }, 200);
    this.uploadForm.get('formTypeData').valueChanges.subscribe((value) => {
      this.typeData = value;
      console.log('status', value);
    });
    this.uploadForm.get('formReason').valueChanges.subscribe((value) => {
      this.reason = value;
      console.log('reason', value);
    });
  }

  initshow(): void {
    const params = new ClhcAtmUpload();
    params.user = this.userInfo.userName;
    params.date = this.dateT.getValue();
    params.status = 1;
    this.call.callApi(
      {
        method: HTTPMethod.POST,
        url: 'luong-huuchi-atm/list',
        data: params,
        progress: true,
        success: (res) => {
          if (res) {
            this.dataSource = res.data;
            this.hideButton(res.data);
          }
        }
      }
    );
  }

  aproved(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn đệ trình dữ liệu này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      if (this.isType === 'LKK') {
        urls = 'luong-huuchi-atm/change/status';
        params = new ClhcAtmUpload();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.brachCode = this.userInfo.branchCode;
        params.status = 2;
      }
      if (this.isType === 'LKD') {
        urls = 'insurance/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 2;
      }
      this.call.callApi(
        {
          method: HTTPMethod.POST,
          url: urls,
          data: params,
          progress: true,
          success: (res) => {
            if (res) {
              this.notificationService.showSuccess(res.data, 'Cảnh báo');
              this.search();
            }
          }
        }
      );
    });
  }

  reject(status: string): void {
    console.log(status);
  }

  hideButton(data: any): void {
    if (data.length === 0) {
      this.isDisabled = true;
      this.notify.warning('Thông báo', 'Không có dữ liệu.');
    } else {
      this.isDisabled = false;
    }
  }

  exportExcel(): void {
    if (this.isType === 'LKD'){
      return this.exportReportPNTForDVKD();
    }
    if (this.isType === 'LKD1'){
      return this.exportReportNTKhdnForDVKD();
    }
    if (this.isType === 'LKD_KHCN'){
      return this.exportLKD_KHCNDVKD();
    }
    const param = new ClhcAtmUpload();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 1;
    this.fileService.downloadFile('luong-huuchi-atm/exportsucces', param);
  }

  onSendApprove(): void {
    console.log('isSaveData', this.isSaveData);
    console.log('reason', this.reason);
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn đệ trình dữ liệu này !'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      let method;
      if (this.isType === 'LKK') {
        urls = 'luong-huuchi-atm/change/status';
        params = new ClhcAtmUpload();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.brachCode = this.userInfo.branchCode;
        params.status = 2;
      }
      if (this.isType === 'LKD') {
        urls = 'insurance/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 2;
      }
      if (this.isType === 'LKD1'){
        if (this.reason === '' && this.warningReason === false){
          console.log('vào ko', this.reason);
          this.warningDialog();
          return;
        }else {
          urls = 'saleNTKHDN/change/status';
          params = new ClhcAtmUpload();
          params.date = this.dateT.getValue();
          params.status = 2;
          params.reason = this.reason;
        }
      }
      if (this.isType === 'LKD_KHCN') {
        urls = 'lkd-mbnt-khcn/submit-allocate';
        params = new commonParam();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.status = 1;
        method = HTTPMethod.PUT;
        return this.putUpdateMbntKhcnPhanBo(params, urls)
      }

      this.call.callApi(
        {
          method: HTTPMethod.POST,
          url: urls,
          data: params,
          progress: true,
          success: (res) => {
            if (res) {
              this.notificationService.showSuccess(res.data, 'Cảnh báo');
              this.search();
            }
          }
        }
      );
    });
  }

  search(): void {
    if (this.isType === 'LKK'){
      return this.searchLHTATM();
    }

    if (this.isType === 'LKD'){
      return this.searchDataDVKD();
    }
    if (this.isType === 'LKD1'){
      return this.searchDataNTKhdnCn();
    }

    if (this.isType === 'LKD_KHCN'){
      return this.searchLKD_KHCNPHANBO();
    }
    const param = new ClhcAtmUpload();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 1;
    this.call.callApi(
      {
        method: HTTPMethod.POST,
        url: 'luong-huuchi-atm/list',
        data: param,
        progress: true,
        success: (res) => {
          if (res) {
            this.dataSource = res.data;
            this.hideButton(res.data);
          }
        }
      }
    );
  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      typeUpload: [null, [Validators.required]],
      formTypeData: [null, [Validators.required]],
      file: [null],
      formReason: [null]
    });
  }

  confirmDialog(): void {
    const message = `Bạn có muốn duyệt danh sách này ?`;

    const dialogData = new ConfirmDialogModel('Xác nhận', message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    });
  }

  onFileSelect($event): void {
    this.dataSource = [];
    this.totalRecordSuccess = 0;
    this.totalRecordError = 0;
    this.files = $event;
    this.isValidFile = true;
    this.isViewError = true;
    this.isSaveData = false;
  }
  onClearSelected($event): void {
    this.uploadForm.get('file').patchValue(null);
    this.dataSource = [];
    this.isViewError = false;
    this.isValidFile = false;
    this.isSaveData = false;
  }

  downloadTemplate(): void {
    console.log(this.uploadForm.get('typeUpload').value);
    this.uploadForm.get('typeUpload').markAllAsTouched();
    if (this.uploadForm.get('typeUpload').invalid || !this.templateType) {
      return;
    }
    if (this.isType === 'LKD'){
      this.fileService.downloadFileMethodGet(`insurance/downloadPB`);
    }
    if (this.isType === 'LKD1'){
      this.fileService.downloadFileMethodGet(`saleNTKHDN/template-dvkd`);
    }
    if (this.isType === 'LKD_KHCN'){
      this.fileService.downloadFileMethodGet(`lkd-mbnt-khcn/template-dvkd`);
    }
  }

  searchDataDVKD(): void {
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '5';
    const url = 'insurance/search-PNT';
    this.phibaohiemService.searchDVKD(url, params, status, statusCn).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('data', res.data);
        if (res.data.dataSearchPNTs){
          this.dataSource = res.data.dataSearchPNTs;
          this.isDisabled = false;
        }
        else {
          this.dataSource = [];
          this.notify.warning('Thông báo', 'Không tìm thấy dữ liệu');
          this.isDisabled = true;
        }
      }
    });
  }

  exportReportPNTForDVKD(): void {
    const url = 'insurance/downloadReport';
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '5';
    this.phibaohiemService.downloadReportForDVKD(url, params, status, statusCn);
  }

  saveCN(): void {
    if (this.isWarning) {
      // this.matDialog.open(this.modalSave);
      this.modalConfirm = this.matDialog.open(this.modalSave);
    } else {
      if (this.isType === 'LKD1'){
        return this.saveFileNtKhdn();
      }
      this.saveFile();
    }
  }

  saveFile(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    const valueForm = this.uploadForm.value;
    console.log(valueForm);

    // const url = URL_FILE_SAVE;
    const url = 'insurance/saveData-cn';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('detail', this.uploadForm.value.content);
    formData.append('valueDate', this.valueDate);
    this.phibaohiemService.saveFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.handleDataFileImport(res);
      }
    }, (error: IError) => this.checkError(error));
    this.isValidFile = false;

  }

  checkError(error: IError): void {
    console.log(error);
    this.notify.error('Lỗi', error.message);
  }

  handleDataFileImport(data): void {
    // gan du lieu response tra ve 'excelRecords'
    this.dataSource = data.dataSearchPNTs;
    console.log('dataSearchPNTs', data.dataSearchPNTs);
    this.totalRecordError = data.dataSearchPNTs.filter((item) => item.note === 'ERROR').length;
    this.totalRecordSuccess = data.dataSearchPNTs.filter((item) => item.note === 'OK').length;
    this.totalRecordWarning = data.dataSearchPNTs.filter((item) => item.note === 'WARNING').length;
    this.totalRecord = data.dataSearchPNTs.length;
    // res.message === 'Fail'
    //   ? this.notify.error('Thông báo', `Lưu file thất bại`)
    //   : this.notify.success('Thông báo', `Lưu file thành công`);
    this.modalConfirm.close();
  }

  uploadFile(): void {
    if (this.isType === 'LKD1'){
      return this.uploadFileNtKhdn();
    }
    if (this.isType === 'LKD_KHCN'){
      return this.upload_MbntKhcnPhanBo();
    }

    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    // const fromDate = moment(this.dp?.getValue(), 'DD/MM/YYYY').format('MM/YYYY');
    const url = 'insurance/upload-cn';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('valueDate', this.valueDate);
    this.phibaohiemService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        // console.log('res.meta.message-- ', res.meta.message);
       // this.notify.error('Thông Báo',  res.meta.message);
        // gan du lieu response tra ve 'excelRecords'
        console.log('upload', res.dataSearchPNTs);
        this.dataSourceRaw = res;
        this.totalRecordError = res.dataSearchPNTs.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.dataSearchPNTs.filter((item) => item.note === 'OK').length;
        // this.totalRecordWarning = res.excelRedataSearchPNTs.filter((item) => item.note === 'WARNING').length;
        this.totalRecord = res.dataSearchPNTs.length;
        if (this.totalRecordError > 0) {
          this.isValidFile = false;
        } else {
          this.isValidFile = true;
          this.isSaveData = true;
        }
        this.isWarning = this.totalRecordWarning > 0;
        if (this.totalRecordError > 0) {
          this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
        } else {
          this.notify.success('Thông báo', 'Upload file thành công.');
        }
      }

    }, (error: IError) => this.checkError(error));
  }

  // tslint:disable-next-line:typedef
  downloadFileError() {
    if (this.isType === 'LKD') {
      console.log('tải file lỗi', this.isType);
      return this.viewFileValid();
    }else if (this.isType === 'LKD1'){
      return this.viewFileNtKhdn();
    }else if (this.isType === 'LKD_KHCN'){
      var listObject = this.dataSourceRaw.data;
      this.phibaohiemService.downloadFile('lkd-mbnt-khcn/exporterrorph-PB', listObject);
    }else{
      this.notify.warning('Thông báo', 'Không thực hiện được, vui lòng kiểm tra lại !');
    }
  }

  viewFileValid(): void {
    // if (!this.dataSourceRaw) {
    //   return;
    // }
    const url = 'insurance/export-file';
    this.phibaohiemService.downloadFile(url, this.dataSourceRaw);
    this.modalConfirm.close();
  }

  searchDataNTKhdnCn(): void {
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '5';
    const type = this.typeData;
    const url = 'saleNTKHDN/search-for-cn';
    this.muabanNtKHDnService.searchDVKD(url, params, status, statusCn, type).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('data', res.data.typeTable);
        if (res.data.dataCnResponses){
          if (res.data.typeTable === 'TABLE_DVKD'){
            this.columns = DATA_TABLE_NT_KHDN_CN;
            this.dataSource = res.data.dataCnResponses;
            this.isDisabled = false;
          }
          else {
            this.columns = DATA_TABLE_UPLOAD_KHDN;
            this.dataSource = res.data.dataCnResponses;
            this.isDisabled = false;
          }
        }else {
          this.dataSource = [];
          this.notify.warning('Thông báo', 'Không tìm thấy dữ liệu');
          this.isDisabled = true;
        }
      }
    });
  }

  exportReportNTKhdnForDVKD(): void {
    const url = 'saleNTKHDN/report-file-cn';
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '5';
    const type = this.typeData;
    this.muabanNtKHDnService.downloadReportForDVKD(url, params, status, statusCn, type);
  }

  uploadFileNtKhdn(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    // const fromDate = moment(this.dp?.getValue(), 'DD/MM/YYYY').format('MM/YYYY');
    const url = 'saleNTKHDN/upload-cn';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('valueDate', this.valueDate);
    this.phibaohiemService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        // console.log('res.meta.message-- ', res.meta.message);
        // this.notify.error('Thông Báo',  res.meta.message);
        // gan du lieu response tra ve 'excelRecords'
        console.log('upload', res.dataNTDNResponses);
        this.dataSourceRaw = res;
        this.totalRecordError = res.dataNTDNResponses.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.dataNTDNResponses.filter((item) => item.note === 'OK').length;
        console.log('lỗi', res.dataNTDNResponses.filter((item) => item.note === 'OK').length);
        this.totalRecord = res.dataNTDNResponses.length;
        if (this.totalRecordError > 0) {
          this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
          this.isValidFile = false;
          this.isViewError = true;
        } else {
          this.isValidFile = true;
          this.isSaveData = true;
          if (res.lkd != null){
            this.notify.warning('Thông báo', 'Upload file thành công. Tổng số tiền chi LKD thấp hơn LKD MBNT_KHDN từ HO, vui lòng nhập lý do.');
          } else {
            this.notify.success('Thông báo', 'Upload file thành công.');
          }
        }
        this.isWarning = this.totalRecordWarning > 0;
      }

    }, (error: IError) => this.checkError(error));
  }

  saveFileNtKhdn(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    const valueForm = this.uploadForm.value;
    console.log(valueForm);

    // const url = URL_FILE_SAVE;
    const url = 'saleNTKHDN/saveData-cn';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('detail', this.uploadForm.value.content);
    formData.append('valueDate', this.valueDate);
    formData.append('reason', this.reason);
    this.phibaohiemService.saveFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.columns = DATA_TABLE_NT_KHDN_CN;
        this.dataSource = res.dataNTDNResponses;
        this.warningReason = true;
      }
    }, (error: IError) => this.checkError(error));
    this.isValidFile = false;

  }

  viewFileNtKhdn(): void {
    // if (!this.dataSourceRaw) {
    //   return;
    // }
    const url = 'saleNTKHDN/export-file';
    this.phibaohiemService.downloadFile(url, this.dataSourceRaw);
    this.modalConfirm.close();
  }

  warningDialog(): void {

    const dialogParams: ILpbDialog = {
      messages: ['Bạn chưa nhập lý do'],
      title: 'Cảnh Báo',
      buttons: {
        dismiss: {display: false, label: 'Đồng Ý'},
        confirm: {display: true, label: 'Đóng'},
      },
    };
    this.dialogService.openDialog(dialogParams, (result) => {});
  }

  searchLKD_KHCNPHANBO(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    debugger
    this.phibaohiemService.CallAPI(
      'lkd-mbnt-khcn/ds-phanbo'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          debugger

          if(res.body.data.typeTable === 'PB') {
            this.columns = DATA_TABLE_MBNT_KHCN_PHANBO;
            this.dataSource = res.body.data.mbntbc03Responses;
          }else{
            this.columns = DATA_TABLE_MBNT_KHCN;
            this.dataSource = res.body.data.lkdMbntKhcns;
          }
          this.isDisabled = false;

        }
        ,error:(er) =>{
          this.isDisabled = true;
          if (er.code.includes('00-4002')){
            this.toastr.warning('Thông báo', 'Không có dữ liệu !')
          }else{
            this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
          }
          this.dataSource = null;

        }
      }
    );
  }

  exportLKD_KHCNDVKD(): void {
    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.status = 0;
    params.saveFormat = "excel";
    this.phibaohiemService.downloadFile('lkd-mbnt-khcn/exportPhanBo', params);
  }

  upload_MbntKhcnPhanBo(): void {
    const url = 'lkd-mbnt-khcn/upload-phanbo';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('request', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('date', this.dateT.getValue());
    this.call.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        debugger
        this.dataSourceRaw = res;
        this.dataSource = res.data;
        this.totalRecordError = res.data.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.data.length - this.totalRecordError;
        this.columns = DATA_TABLE_MBNT_KHCN_PHANBO;
        this.isDisabled = false;

        if (this.totalRecordError > 0) {
          this.columns.splice(4,1);
          this.columns.push(MBNT_KHCN_PB_COLUMN_ER);
          this.isValidFile = false;
          this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
        }else{
          this.columns.splice(4,1);
          this.isValidFile = true;
          this.message = '';
          this.notify.success('Thông báo', 'Upload file thành công.');
        }
        this.isWarning = this.isValidFile;
      }
    }, (error: IError) => this.checkError(error));
  }
  putUpdateMbntKhcnPhanBo(params: any, urls: string): void {
    this.phibaohiemService.CallAPI(
      urls
      ,params
      ,{
        method: HTTPMethod.PUT
        ,success: (res) => {
          debugger
          if(res.body.data.success){
            this.notify.success('Thông báo', 'Đã trình duyệt thành công');
          }else{
            if(res.body.data.code === "600"){
              this.notify.warning('Thông báo', 'Không có dữ liệu để gửi duyệt!');
            }else{this.notify.error('Thông báo', res.body.data.message);}

          }
          this.dataSource = null;
        }
        ,error:(res) =>{
          debugger
          this.notify.error('Lỗi', res.body.data.message);
          this.dataSource = null;
        }
      }
    );
  }
  searchLHTATM(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 1;
    this.phibaohiemService.CallAPI(
      'luong-huuchi-atm/list'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          if (res ) {
            this.dataSource = res.body.data;
            this.hideButton(res.body.data);
          }
        }
        ,error:(er) =>{
          this.isDisabled = true;
          this.dataSource = null;
          if (er.code === "iname-00-99"){
            this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
          }else{
            this.toastr.warning('Thông báo', er.message)
          }
        }
      }
    );
  }
}
