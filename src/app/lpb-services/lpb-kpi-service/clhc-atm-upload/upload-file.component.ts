import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  INFO_UPLOAD_TABLE_COLUMN,
  INFO_UPLOAD_TABLE_COLUMN_ER,
  TYPE_UPLOAD,
  TYPE_UPLOAD_ARR, TYPE_UPLOAD_HO, TYPE_UPLOAD_MHHOUP
} from '../shared/util/clhc-atm-upload.constants';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {DestroyService} from '../../../shared/services/destroy.service';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../shared/models/error.model';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {Moment} from 'moment';
import {UserInfo} from '../../../_models/user';
import {FileService} from '../shared/service/file.service';
import {PhiBaoHiemNhanThoService} from '../shared/service/phi-bao-hiem-nhan-tho.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DATA_TABLE_BAO_HIEM_PHI} from '../shared/util/data-table-bao-hiem.constants';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {ClhcAtmUpload} from '../shared/models/clhc-atm-upload';
import {HTTPMethod} from '../../../shared/constants/http-method';
import {NotificationService} from '../../../_toast/notification_service';
import {CallService} from '../shared/service/call.service';
import {DatePipe} from '@angular/common';
import {DATA_TABLE_UPLOAD_KHDN} from '../shared/util/data-table-upload-MBNT-KHDN.constants';
import {DATA_TABLE_MBNT_KHCN, MBNT_KHCN_COLUMN_ER} from '../shared/util/mbnt-khcn-upload.constants';
import {commonParam} from '../shared/models/common-params';
import {COLUMN_ER, DATA_TABLE_NGAYCONGLC} from "../shared/util/ngaycongluanchuyen-upload.constants";
import {DEBUG} from "@angular/compiler-cli/src/ngtsc/logging/src/console_logger";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../../manager-admin/system-partner/confirm-dialog/confirm-dialog.component";
import {ILpbDialog, LpbDialogService} from "../../../shared/services/lpb-dialog.service";
import {DATA_TABLE_HUYDONGNGANHAN, HDNH_COLUMN_ER} from "../shared/util/huydongnganhan-upload.constants";


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
  selector: 'app-clhc-atm-upload',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  encapsulation: ViewEncapsulation.None,
})

export class UploadFileComponent implements OnInit {
  constructor(
    private notify: CustomNotificationService,
    private fileService: FileService,
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private phibaohiemService: PhiBaoHiemNhanThoService,
    private matDialog: MatDialog,
    private call: CallService,
    private toastr: CustomNotificationService,
    private notificationService: NotificationService,
    public datepipe: DatePipe,
    private dialogService: LpbDialogService,
    public dialog: MatDialog
  ) {
    this.initForm();
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  @Input() event: Observable<void>;
  @Input() eventCompleted: Observable<void>;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>(null);
  date = new FormControl(moment());
  files: File[] = [];
  fileName = '';
  templateType: string[] = ['LKK', 'LKD'];
  dataSource = [];
  totalRecordSuccess = 0;
  totalRecordError = 0;
  message = '';
  uploadForm: FormGroup;
  isDisabled = false;
  checkInPGD = false;
  progress = 0;
  userInfo?: UserInfo;
  configs: any = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  isType = '';
  isFix = true;
  // tslint:disable-next-line:ban-types
  typeUpload: String[] = [];
  modalConfirm: MatDialogRef<any>;
  isWarning = false;
  isValidFile = false;
  totalRecordWarning = 0;
  totalRecord = 0;
  dataSourceRaw: any;
  // @ts-ignore
  valueDate = '';
  footerReport = false;
  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  columns = INFO_UPLOAD_TABLE_COLUMN;
  typesUpload: any;
  // columnsInsu: any = DATA_TABLE_BAO_HIEM_PHI;

  @ViewChild('modalSave', {static: true}) modalSave: TemplateRef<any>;
  @ViewChild('dp', {static: false}) dp: LpbDatePickerComponent;
  @ViewChild('dateT', {static: false}) dateT: LpbDatePickerComponent;

  ngOnInit(): void {
    this.typesUpload = TYPE_UPLOAD_MHHOUP;
    this.uploadForm.get('typeUpload').valueChanges.subscribe((value) => {
      this.isValidFile = false;
      this.totalRecordSuccess = 0;
      this.totalRecordError = 0;
      this.isType = value;
      // this.dataSource = value;
      if (value === 'LKD') {
        console.log('test--', value);
        this.columns = DATA_TABLE_BAO_HIEM_PHI;
        this.dataSource = [];
      }
      if (value === 'LKK') {
        console.log('test--', value);
        this.columns = INFO_UPLOAD_TABLE_COLUMN;
      }
      if (value === 'LKD1') {
        this.columns = DATA_TABLE_UPLOAD_KHDN;
        this.dataSource = [];
      }
      if (value === 'LKD_KHCN') {
        this.columns = DATA_TABLE_MBNT_KHCN;
      }
      if (value === 'NCLC') {
        this.columns = DATA_TABLE_NGAYCONGLC;
      }
      if (value === 'HDNH') {
        this.columns = DATA_TABLE_HUYDONGNGANHAN;
      }
    });
    this.uploadForm.patchValue({typeUpload: 'LKK'});
    setTimeout(() => {
      this.dateT.setValue(this.datepipe.transform(moment().toDate(), 'MM/yyyy'));
      this.valueDate = this.dateT.getValue();
      if (this.isType === 'LKK') {
        //this.initshow();
      }
    }, 200);
  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      typeUpload: [null, [Validators.required]],
      file: [null, [Validators.required]],
      isNewUpload: [false]
    });
  }

  search(): void {
    if (this.isType === 'LKK'){
      return this.searchLHTATM();
    }

    if (this.isType === 'LKD'){
      return this.searchPNT();
    }
    if (this.isType === 'LKD1'){
      return this.searchNTDN();
    }

    if (this.isType === 'LKD_KHCN'){
      return this.searchKHCN();
    }
    if (this.isType === 'NCLC'){
      return this.searchNgayCongLC();
    }
    if (this.isType === 'HDNH'){
      return this.searchHuyDongNganHan();
    }
  }



  hideButton(data: any): void {
    if (data.length === 0) {
      this.isDisabled = true;
      this.notify.warning('Thông báo', 'Không có dữ liệu.');
    } else {
      this.isDisabled = false;
    }
  }

  initshow(): void {
    return this.searchLHTATM();
  }

  onClearSelected($event): void {
    this.uploadForm.get('file').patchValue(null);
    this.dataSource = [];
  }

  onFileSelect($event): void {
    this.dataSource = [];
    this.totalRecordSuccess = 0;
    this.totalRecordError = 0;
    this.files = $event;
  }

  downloadTemplate(): void {
    if (this.isType === 'LKD1'){
      return this.DownloadTemplateMuaBanNTKHDN();
    }
    console.log(this.uploadForm.get('typeUpload').value);
    this.uploadForm.get('typeUpload').markAllAsTouched();
    if (this.uploadForm.get('typeUpload').invalid || !this.templateType) {
      return;
    }
    let f;

    const file = TYPE_UPLOAD.forEach(value => {
      if (this.isType === value.key) {
        f = value.file;
      }
    });
    this.fileService.downloadFileMethodGet(`insurance/template/${f}`);
  }

  checkError(error: IError): void {
    console.log(error);
    this.notify.error('Lỗi', error.message);
  }

  uploadFile(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }

    if (this.isType === 'LKD') {
      console.log('uploadFileInsurance', this.isType);
      return this.uploadFileInsurance();
    }else if (this.isType === 'LKD1'){
      return this.uploadNtKHDN();
    } else if (this.isType === 'LKD_KHCN'){
      return this.upload_MbntKhcn();
    } else if (this.isType === 'NCLC'){
      return this.upload_NgayCongLC();
    } else if (this.isType === 'HDNH'){
      return this.upload_HuyDongNganHan();
    }

    // upload_MbntKhcn

    // const url = 'kpi-service/luong-huuchi-atm/upload';
    const url = 'luong-huuchi-atm/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('request', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('date', this.dateT.getValue());
    this.call.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {

        this.dataSource = res.data;
        debugger
        this.totalRecordError = res.data.filter((item) => item.note !== 'OK').length;
        this.totalRecordSuccess = res.data.filter((item) => item.note === 'OK').length;

        if (this.totalRecordError > 0) {
          this.columns.splice(6,1);
          this.columns.push(INFO_UPLOAD_TABLE_COLUMN_ER);
          this.isValidFile = false;
        }else{
          this.columns.splice(6,1);
          this.isValidFile = true;
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

  uploadFileInsurance(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    // const fromDate = moment(this.dp?.getValue(), 'DD/MM/YYYY').format('MM/YYYY');
    const url = 'insurance/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('valueDate', this.valueDate);
    this.phibaohiemService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.dataSourceRaw = res;
        // gan du lieu response tra ve 'excelRecords'
        console.log('upload', res.data);
        this.totalRecordError = res.excelRecords.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.excelRecords.filter((item) => item.note === 'OK').length;
        this.totalRecordWarning = res.excelRecords.filter((item) => item.note === 'WARNING').length;
        this.totalRecord = res.excelRecords.length;
        if (this.totalRecordError > 0) {
          this.isValidFile = false;
        } else {
          this.isValidFile = true;
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

  // DownloadTemplateInsurance(): void {
  //   const url = 'kpi-service/insurance/template';
  //   this.phibaohiemService.downloadFileMethodGet(url);
  // }

  saveFile(): void {
    if (this.isType === 'LKD'){
      if (this.isWarning) {
        // this.matDialog.open(this.modalSave);
        this.modalConfirm = this.matDialog.open(this.modalSave);
      } else {
        this.onSubmit();
      }
    }
    if (this.isType === 'LKK'){
          if (this.isWarning) {
            // this.matDialog.open(this.modalSave);
            this.modalConfirm = this.matDialog.open(this.modalSave);
          } else {
            this.onSubmit();
          }
        }

    if (this.isType === 'LKD1'){
      if (this.isWarning) {
        // this.matDialog.open(this.modalSave);
        this.modalConfirm = this.matDialog.open(this.modalSave);
      } else {
        this.saveDataNTKHDN();
      }
    }

    if (this.isType === 'LKD_KHCN'){
      if (this.isWarning) {
        this.modalConfirm = this.matDialog.open(this.modalSave);
      } else {
        this.onSubmit();
      }
    }

  }

  onSubmit(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    const valueForm = this.uploadForm.value;
    console.log(valueForm);

    // const url = URL_FILE_SAVE;
    let url = 'insurance/save';
    let formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('detail', this.uploadForm.value.content);
    formData.append('valueDate', this.valueDate);
    if (this.isType === 'LKK') {
      url = 'luong-huuchi-atm/upload-save';
      formData = new FormData();
      formData.append('user', this.userInfo.userName);
      formData.append('date', this.dateT.getValue());
    }
    if (this.isType === 'LKD_KHCN') {
      url = 'lkd-mbnt-khcn/upload-save';
      formData = new FormData();
      formData.append('user', this.userInfo.userName);
      formData.append('date', this.dateT.getValue());
    }
    this.phibaohiemService.saveFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        if (this.isType === 'LKK' || this.isType === 'LKD_KHCN') {
          this.notify.success('Thông báo', res.data);
          return;
        }
        this.handleDataFileImport(res);
      }
    }, (error: IError) => this.checkError(error));
    this.isValidFile = false;
    this.footerReport = true;
  }

  handleDataFileImport(data): void {
    this.dataSourceRaw = data;
    // gan du lieu response tra ve 'excelRecords'
    this.dataSource = data.excelRecords;
    this.totalRecordError = data.excelRecords.filter((item) => item.note === 'ERROR').length;
    this.totalRecordSuccess = data.excelRecords.filter((item) => item.note === 'OK').length;
    this.totalRecordWarning = data.excelRecords.filter((item) => item.note === 'WARNING').length;
    this.totalRecord = data.excelRecords.length;
    // res.message === 'Fail'
    //   ? this.notify.error('Thông báo', `Lưu file thất bại`)
    //   : this.notify.success('Thông báo', `Lưu file thành công`);
    this.modalConfirm.close();

  }

  // tslint:disable-next-line:typedef
  viewFileValid(): void {
    // if (!this.dataSourceRaw) {
    //   return;
    // }
    const url = 'insurance/export';
    console.log('data', this.dataSourceRaw);
    this.phibaohiemService.downloadFile(url, this.dataSourceRaw);
    this.modalConfirm.close();
  }

  // tslint:disable-next-line:typedef
  downloadFileError() {
    if (this.isType === 'LKD') {
      console.log('tải file lỗi', this.isType);
      return this.viewFileValid();
    }
    if (this.isType === 'LKD1'){
      return this.viewFileResult();
    }

    if (this.isType === 'LKK') {
      const params = new ClhcAtmUpload();
      params.date = this.valueDate;
      params.user = this.userInfo.userName;
      params.status = 0;
      this.fileService.downloadFile('luong-huuchi-atm/exporterror', params);
    }

    if (this.isType === 'LKD_KHCN') {
      var listObject = this.dataSourceRaw.data.lkdMbntKhcns;
      this.phibaohiemService.downloadFile('lkd-mbnt-khcn/exporterror', listObject);
    }
    if (this.isType === 'NCLC') {
      var listObject = this.dataSourceRaw.data.ngayCongLuanChuyens;
      this.phibaohiemService.downloadFile('ngayconglc/exporterror', listObject);
    }
    if (this.isType === 'HDNH') {
      var listObject = this.dataSourceRaw.data.lkkhdNganHans;
      this.phibaohiemService.downloadFile('lkkhd-nganhan/exporterror', listObject);
    }
  }
  // tslint:disable-next-line:typedef
  exportExcel() {
    const url = 'insurance/report';
    if (this.isType === 'LKD'){
      return this.exportReportPNT();
    }

    if (this.isType === 'LKD1'){
      return this.exportReportNTKHDN();
    }

    if (this.isType === 'LKK'){
      return this.exportReportCLHTATM();
    }

    if (this.isType === 'LKD_KHCN'){
      return this.exportReportMBNTKHCN();
    }
    if (this.isType === 'NCLC'){
      return this.exportReportNgayCongLC();
    }

    if (this.isType === 'HDNH'){
      return this.exportHuyDongNganHan();
    }
  }

  uploadNtKHDN(): void{
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    // const fromDate = moment(this.dp?.getValue(), 'DD/MM/YYYY').format('MM/YYYY');
    const url = 'saleNTKHDN/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('valueDate', this.valueDate);
    this.phibaohiemService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.dataSourceRaw = res;
        // gan du lieu response tra ve 'excelRecords'
        console.log('upload', res.data);
        this.totalRecordError = res.excelRecords.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.excelRecords.filter((item) => item.note === 'OK').length;
        this.totalRecordWarning = res.excelRecords.filter((item) => item.note === 'WARNING').length;
        this.totalRecord = res.excelRecords.length;
        if (this.totalRecordError > 0) {
          this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
          this.isValidFile = false;
        } else {
          this.notify.success('Thông báo', 'Upload file thành công.');
          // this.dataSource = res.excelRecords;
          this.isValidFile = true;
        }
        this.isWarning = this.totalRecordWarning > 0;
      }
    }, (error: IError) => this.checkError(error));
  }

  DownloadTemplateMuaBanNTKHDN(): void {
    const url = 'saleNTKHDN/template';
    this.phibaohiemService.downloadFileMethodGet(url);
  }

  viewFileResult(): void {
    // if (!this.dataSourceRaw) {
    //   return;
    // }
    const url = 'saleNTKHDN/export-file-error';
    console.log('data', this.dataSourceRaw);

    this.phibaohiemService.downloadFile(url, this.dataSourceRaw);
    this.modalConfirm.close();
  }

  exportReportNTKHDN(): void {
    const url = 'saleNTKHDN/report-file-ho';
    const params = this.dateT.getValue();
    const status = '5';
    const statusCn = '5';
    this.phibaohiemService.downloadReportForDVKD(url, params, status, statusCn);
  }

  exportReportPNT(): void {
    const url = 'insurance/report';
    const params = this.dateT.getValue();
    const status = '5';
    this.phibaohiemService.downloadFileReport(url, params, status);
  }

  exportExcelLkk(): void {
    const url = 'luong-huuchi-atm/exportsucces';
    const params = this.valueDate;
    this.phibaohiemService.downloadFileReport(url, params, '0');
  }

  saveDataNTKHDN(): void {
    if (this.isWarning) {
      // this.matDialog.open(this.modalSave);
      this.modalConfirm = this.matDialog.open(this.modalSave);
    } else {
      this.saveFileNTKHDN();
    }
  }

  saveFileNTKHDN(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    this.valueDate = this.dateT.getValue();
    console.log(this.valueDate);
    const valueForm = this.uploadForm.value;
    console.log(valueForm);

    // const url = URL_FILE_SAVE;
    const url = 'saleNTKHDN/save';
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
    this.footerReport = true;
  }

  searchPNT(): void {
    const params = this.dateT.getValue();
    const status = '5';
    const url = 'insurance/danhsach';
    this.phibaohiemService.search2(url, params, status).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('data', res.data);
        if (res.data.excelRecords){
          this.dataSource = res.data.excelRecords;
          this.footerReport = true;
          this.isDisabled = false;
        }
        else {
          this.dataSource = [];
          this.notify.warning('Thông báo', 'Không tìm thấy dữ liệu');
          this.footerReport = false;
          this.isDisabled = true;
        }
      }
    });
  }

  searchNTDN(): void {
    const params = this.dateT.getValue();
    const status = '5';
    const statusCn = '5';
    const url = 'saleNTKHDN/search-data-ho';
    this.phibaohiemService.searchDVKD(url, params, status, statusCn).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('data', res.data.excelRecords);
        if (res.data.excelRecords){
          this.dataSource = res.data.excelRecords;
          console.log(res.excelRecords);
          this.footerReport = true;
          this.isDisabled = false;
        }
        else {
          this.dataSource = [];
          this.notify.warning('Thông báo', 'Không tìm thấy dữ liệu');
          this.footerReport = false;
          this.isDisabled = true;
        }
      }
    });
  }

  upload_MbntKhcn(): void {
    const url = 'lkd-mbnt-khcn/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('request', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('date', this.dateT.getValue());
    this.call.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.dataSourceRaw = res;
        this.dataSource = res.data.lkdMbntKhcns;
        this.totalRecordError = res.data.lkdMbntKhcns.filter((item) => item.note !== 'OK').length;
        this.totalRecordSuccess = res.data.lkdMbntKhcns.filter((item) => item.note === 'OK').length;

        if (this.totalRecordError > 0) {
          this.columns.splice(15,1);
          this.columns.push(MBNT_KHCN_COLUMN_ER);
        }else{
          this.columns.splice(15,1);
        }

        if (res.data.resultInfor.success) {
          this.isValidFile = true;
        } else {
          this.isValidFile = false;
        }
        this.isWarning = this.isValidFile;

        if (!this.isValidFile) {
          var codeError = res.data.resultInfor.code;
          if (codeError === '4011')
          {
            this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
          }else{
            this.notify.error('Thông báo', res.data.resultInfor.message);
          }

        } else {
          this.notify.success('Thông báo', 'Upload file thành công.');
        }
      }
    }, (error: IError) => this.checkError(error));
  }

  searchKHCN(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    this.resetValueVarKHCN();

    this.phibaohiemService.CallAPI(
      'lkd-mbnt-khcn/list-upload'
      ,param
    ,{
        method: HTTPMethod.POST
        ,success: (res) => {
            this.dataSource = res.body.data;
        }
        ,error:(er) =>{
          debugger
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

  searchLHTATM(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 0;
    this.phibaohiemService.CallAPI(
      'luong-huuchi-atm/list-upload'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          if (res) {
            if (res.body.data.length === 0){
              this.notify.warning('Thông báo', 'Không có dữ liệu.');
            }
            debugger
            this.dataSource = res.body.data;
            this.totalRecordError = res.body.data.filter((item) => item.noteCode === 'ERROR').length;
            this.totalRecordSuccess = res.body.data.length - this.totalRecordError
            // this.message = this.totalRecordError > 0 ? 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục' : '';
            this.isValidFile = false;
          }
        }
        ,error:(er) =>{
          this.isValidFile = true;
          if (er.code === "iname-00-99"){
            this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
          }else{
            this.toastr.warning('Thông báo', er.message)
          }
          this.dataSource = null;

        }
      }
    );
  }

  exportReportCLHTATM(): void{
    const params = new ClhcAtmUpload();
    params.date = this.valueDate;
    params.user = this.userInfo.userName;
    params.status = 0;
    this.call.callApi(
      {
        method: HTTPMethod.POST,
        url: 'luong-huuchi-atm/list-upload',
        data: params,
        progress: true,
        success: (res) => {
          if (res) {
            if(res.data.length === 0){
              this.notify.warning('Thông báo', 'Không có dữ liệu.');
            }else{
              this.fileService.downloadFile('luong-huuchi-atm/exportsucces', params);
            }
          }
        }
      }
    );
  }

  exportReportMBNTKHCN(): void{

    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.status = 0;
    params.saveFormat = "excel";
    this.phibaohiemService.downloadFile('lkd-mbnt-khcn/export', params);
  }

  resetValueVarKHCN():void{
    this.columns.splice(15,1);
    this.columns = DATA_TABLE_MBNT_KHCN
    this.totalRecordError = 0;
    this.totalRecordSuccess = 0;
    this.isValidFile = false;
    this.isWarning = false;
    this.message = "";

  }

  resetValueVarNCLC():void{
    this.columns.splice(5,1);
    this.columns = DATA_TABLE_NGAYCONGLC
    this.totalRecordError = 0;
    this.totalRecordSuccess = 0;
    this.isValidFile = false;
    this.isWarning = false;
    this.message = "";

  }
  resetValueVarHDNH():void{
    this.columns.splice(5,1);
    this.columns = DATA_TABLE_HUYDONGNGANHAN
    this.totalRecordError = 0;
    this.totalRecordSuccess = 0;
    this.isValidFile = false;
    this.isWarning = false;
    this.message = "";

  }

  upload_NgayCongLC(): void {
    const url = 'ngayconglc/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('request', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('date', this.dateT.getValue());
    this.call.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        debugger
        this.dataSourceRaw = res;
        this.dataSource = res.data.ngayCongLuanChuyens;
        this.totalRecordError = res.data.ngayCongLuanChuyens.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.data.ngayCongLuanChuyens.filter((item) => item.note === 'OK').length;

        if (this.totalRecordError > 0) {
          this.columns.splice(5,1);
          this.columns.push(COLUMN_ER);
        }else{
          this.columns.splice(5,1);
        }

        if (res.data.resultInfor.success) {
          this.isValidFile = true;
        } else {
          this.isValidFile = false;
        }
        this.isWarning = this.isValidFile;

        if (!this.isValidFile) {
          var codeError = res.data.resultInfor.code;
          if (codeError === '4011')
          {
            this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
          }else{
            this.notify.error('Thông báo', res.data.resultInfor.message);
          }

        } else {
          this.notify.success('Thông báo', 'Upload file thành công.');
        }
      }
    }, (error: IError) => this.checkError(error));
  }

  searchNgayCongLC(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    this.resetValueVarNCLC();

    this.phibaohiemService.CallAPI(
      'ngayconglc/list-upload'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          this.dataSource = res.body.data;
        }
        ,error:(er) =>{
          debugger
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

  exportReportNgayCongLC(): void{

    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.saveFormat = "excel";
    this.phibaohiemService.downloadFile('ngayconglc/export', params);
  }


  upload_HuyDongNganHan(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Dữ liệu tháng upload đã tồn tại, bạn có muốn tiếp tục ?'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };

    // Goi kiem tra da co du lieu upload truoc do chua
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    this.resetValueVarHDNH();
    this.phibaohiemService.CallAPI(
      'lkkhd-nganhan/checkexisted'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          if(res.body.data.resultInfor.code === '505')
          {
            this.dialogService.openDialog(dialogParams, (result) => {
              this.FunctionUpload_HuyDongNganHan();
            });
          }else{
            this.FunctionUpload_HuyDongNganHan();
          }
        }
        ,error:(er) =>{
          this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau')
          this.dataSource = null;
        }
      }
    );
  }

  searchHuyDongNganHan(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    this.resetValueVarHDNH();

    this.phibaohiemService.CallAPI(
      'lkkhd-nganhan/list-upload'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          this.dataSource = res.body.data;
        }
        ,error:(er) =>{
          debugger
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

  exportHuyDongNganHan(): void{

    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.saveFormat = "excel";
    this.phibaohiemService.downloadFile('lkkhd-nganhan/export', params);
  }

  FunctionUpload_HuyDongNganHan(): void {
    const url = 'lkkhd-nganhan/upload';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('request', this.files[0]);
    formData.append('user', this.userInfo.userName);
    formData.append('date', this.dateT.getValue());
    this.call.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        debugger
        this.dataSourceRaw = res;
        this.dataSource = res.data.lkkhdNganHans;
        this.totalRecordError = res.data.lkkhdNganHans.filter((item) => item.note === 'ERROR').length;
        this.totalRecordSuccess = res.data.lkkhdNganHans.filter((item) => item.note === 'OK').length;

        if (this.totalRecordError > 0) {
          this.columns.splice(5,1);
          this.columns.push(HDNH_COLUMN_ER);
        }else{
          this.columns.splice(5,1);
        }

        if (res.data.resultInfor.success) {
          this.isValidFile = true;
        } else {
          this.isValidFile = false;
        }
        this.isWarning = this.isValidFile;

        if (!this.isValidFile) {
          var codeError = res.data.resultInfor.code;
          if (codeError === '4011')
          {
            this.message = 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục';
          }else{
            this.notify.error('Thông báo', res.data.resultInfor.message);
          }

        } else {
          this.notify.success('Thông báo', 'Upload file thành công.');
        }
      }
    }, (error: IError) => this.checkError(error));
  }

}
