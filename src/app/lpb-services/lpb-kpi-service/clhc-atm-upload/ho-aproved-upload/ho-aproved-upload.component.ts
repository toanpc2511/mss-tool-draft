import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  INFO_UPLOAD_TABLE_COLUMN,
  INFO_UPLOAD_TABLE_COLUMN_NAME,
  TYPE_UPLOAD
} from '../../shared/util/clhc-atm-upload.constants';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FileService} from '../../shared/service/file.service';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {UserInfo} from '../../../../_models/user';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {ClhcAtmUpload} from '../../shared/models/clhc-atm-upload';
import {ILpbDialog, LpbDialogService} from '../../../../shared/services/lpb-dialog.service';
import {MatDialog} from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from '../../../../manager-admin/system-partner/confirm-dialog/confirm-dialog.component';
import {HTTPMethod} from '../../../../shared/constants/http-method';
import {CallService} from '../../shared/service/call.service';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {DatePipe} from '@angular/common';
import {DATA_TABLE_BAO_HIEM_PHI, TYPE_STATUS} from '../../shared/util/data-table-bao-hiem.constants';
import {NotificationService} from '../../../../_toast/notification_service';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../../shared/models/error.model';
import {CONTROL_TYPES} from '../../../../shared/components/lpb-dialog/lpb-dialog.component';
import {ValidatorHelper} from '../../../../shared/utilites/validators.helper';
import {angularClassDecoratorKeys} from 'codelyzer/util/utils';
import {PhiBaoHiemNhanThoService} from '../../shared/service/phi-bao-hiem-nhan-tho.service';
import {DATA_TABLE_MBNT_KHCN} from '../../shared/util/mbnt-khcn-upload.constants';
import {commonParam} from '../../shared/models/common-params';
import {MuaBanNTKHDNService} from '../../shared/service/mua-ban-NT-KHDN.service';
import {DATA_TABLE_UPLOAD_KHDN} from '../../shared/util/data-table-upload-MBNT-KHDN.constants';


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

interface IDialogParams {
  userName: string;
  isApproval: boolean;
}

@Component({
  selector: 'app-ho-aproved-clhc-atm',
  templateUrl: './ho-aproved-upload.component.html',
  styleUrls: ['./ho-aproved-upload.component.scss'],
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
export class HoAprovedUploadComponent implements OnInit {

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
  valueDate = '';
  header: any;
  now = moment().valueOf();
  footerReport = false;
  formStatus: any;
  isStatus = false;
  typeStatus = '';

  constructor(
    private dialogService: LpbDialogService,
    private notify: CustomNotificationService,
    private fileService: FileService,
    private destroy$: DestroyService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private call: CallService,
    private notificationService: NotificationService,
    private phibaohiemService: PhiBaoHiemNhanThoService,
    private muabanNtKHDnService: MuaBanNTKHDNService,
    private toastr: CustomNotificationService
  ) {
    this.initForm();
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  @ViewChild('dp', {static: false}) dp: LpbDatePickerComponent;
  @ViewChild('dateT', {static: false}) dateT: LpbDatePickerComponent;

  ngOnInit(): void{
    this.typesUpload = TYPE_UPLOAD;
    //this.typesUpload.splice(5,1);
    this.formStatus = TYPE_STATUS;
    this.uploadForm.get('typeUpload').valueChanges.subscribe((value) => {
      this.isType = value;
      this.isDisabled = true;
      // this.dataSource = value;
      if (value === 'LKD') {
        this.columns = DATA_TABLE_BAO_HIEM_PHI;
        this.dataSource = [];
        this.isStatus = true;
      }
      if (value === 'LKK') {
        this.columns = INFO_UPLOAD_TABLE_COLUMN;
        this.isStatus = false;
      }
      if (value === 'LKD1'){
        this.columns = DATA_TABLE_UPLOAD_KHDN;
        this.isStatus = false;
        this.dataSource = [];
      }
      if (value === 'LKD_KHCN') {
        this.columns = DATA_TABLE_MBNT_KHCN;
      }
    });
    this.uploadForm.patchValue({typeUpload: 'LKK'});
    setTimeout(() => {
      if (this.isType === 'LKK') {
        this.dateT.setValue(this.datepipe.transform(moment().toDate(), 'MM/yyyy'));
        //this.searchLHTATM();
      }
    }, 200);
    this.uploadForm.get('formStatus').valueChanges.subscribe((value) => {
      this.typeStatus = value;
      console.log('status', value);
    });
  }



  aproved(): void
  {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn duyệt danh sách này !'],
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
        params.status = 1;
        method = HTTPMethod.POST;
      }
      if (this.isType === 'LKD') {
        urls = 'insurance/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 1;
        method = HTTPMethod.POST;
      }
      if (this.isType === 'LKD1') {
        urls = 'saleNTKHDN/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 1;
        method = HTTPMethod.POST;
      }

      if (this.isType === 'LKD_KHCN') {
        urls = 'lkd-mbnt-khcn/change/status';
        params = new commonParam();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.status = 1;
        method = HTTPMethod.PUT;
        return this.putUpdateMbntKhcn(params, urls)
      }
      this.call.callApi(
        {
          method: method,
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
      return this.searchLKD_KHCN();
    }

  }
  exportExcel(): void
  {
    if (this.isType === 'LKD'){
      return this.exportReportPNT();
    }

    if (this.isType === 'LKD1'){
      return this.exportReportNTDN();
    }

    if (this.isType === 'LKD_KHCN'){
      return this.exportLKD_KHCN();
    }

    const param = new ClhcAtmUpload();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 0;
    this.fileService.downloadFile('luong-huuchi-atm/exportsucces', param);
  }
  initForm(): void {
    this.uploadForm = this.fb.group({
      typeUpload: [null, [Validators.required]],
      formStatus: [null],
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

  exportReportPNT(): void {
    const url = 'insurance/report';
    const params = this.dateT.getValue();
    const status = this.typeStatus;
    this.phibaohiemService.downloadFileReport(url, params, status);
  }

  searchPNT(): void {
    const date = this.dateT.getValue();
    const status = this.typeStatus;
    console.log(this.formStatus);
    const url = 'insurance/danhsach';
    this.phibaohiemService.search2(url, date, status).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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

  searchLKD_KHCN(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 0;
    debugger
    this.phibaohiemService.CallAPI(
      'lkd-mbnt-khcn/list-upload'
      ,param
      ,{
        method: HTTPMethod.POST
        ,success: (res) => {
          this.isDisabled = false;
          this.dataSource = res.body.data;
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

  searchLHTATM(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 0;
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

  exportLKD_KHCN(): void {
    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.status = 0;
    params.saveFormat = "excel";
    this.phibaohiemService.downloadFile('lkd-mbnt-khcn/export', params);
  }

  putUpdateMbntKhcn(params: any, urls: string): void {
    this.phibaohiemService.CallAPI(
      urls
      ,params
      ,{
        method: HTTPMethod.PUT
        ,success: (res) => {
          debugger
          if(res.body.data.success){
            this.notify.success('Thông báo', 'Đã duyệt thành công');
          }else{
            if(res.body.data.code === "600"){
              this.notify.warning('Thông báo', 'Không có dữ liệu để duyệt!');
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



  exportReportNTDN(): void {
    const url = 'saleNTKHDN/report-file-ho';
    const params = this.dateT.getValue();
    const status = '0';
    const statusCn = '5';
    this.muabanNtKHDnService.downloadFileReportHO(url, params, status, statusCn);
  }

  searchNTDN(): void {
    const date = this.dateT.getValue();
    const status = '0';
    const statusCn = '5';
    console.log(this.formStatus);
    const url = 'saleNTKHDN/search-data-ho';
    this.muabanNtKHDnService.searchHo(url, date, status, statusCn).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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


}
