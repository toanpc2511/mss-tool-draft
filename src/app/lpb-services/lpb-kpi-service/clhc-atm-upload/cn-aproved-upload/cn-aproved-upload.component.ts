import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
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
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {CallService} from '../../shared/service/call.service';
import {NotificationService} from '../../../../_toast/notification_service';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {DATA_TABLE_BAO_HIEM_PHI} from '../../shared/util/data-table-bao-hiem.constants';
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
import {DATA_TABLE_NT_KHDN_CN} from '../../shared/util/data-table-NT-KHDN_CN.constant';
import {DATA_TABLE_UPLOAD_KHDN} from '../../shared/util/data-table-upload-MBNT-KHDN.constants';
import {MuaBanNTKHDNService} from '../../shared/service/mua-ban-NT-KHDN.service';
import {commonParam} from '../../shared/models/common-params';
import {DATA_TABLE_MBNT_KHCN, DATA_TABLE_MBNT_KHCN_PHANBO} from '../../shared/util/mbnt-khcn-upload.constants';

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
  selector: 'app-cn-aproved-clhc-atm',
  templateUrl: './cn-aproved-upload.component.html',
  styleUrls: ['./cn-aproved-upload.component.scss'],
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
export class CnAprovedUploadComponent implements OnInit {
  date = new FormControl(moment());
  dataSource = [];
  uploadForm: FormGroup;
  isDisabled = true;
  userInfo?: UserInfo;
  display = '';
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
  actions: ActionModel[] = [
    {
      actionName: 'Duyệt',
      actionIcon: 'check',
      actionClick: () => this.onApprove(),
    },
    { actionName: 'Từ chối duyệt', actionIcon: 'cancel', actionClick: () => this.onReject() }
  ];
  isStatus = false;
  viewReason = '';
  reason = '';

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
    private muabanNtKHDnService: MuaBanNTKHDNService
  ) {
    this.initForm();
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  @ViewChild('dp', {static: false}) dp: LpbDatePickerComponent;
  @ViewChild('dateT', {static: false}) dateT: LpbDatePickerComponent;

  ngOnInit(): void {
    this.typesUpload = TYPE_UPLOAD;
    //this.typesUpload.splice(5,1);
    this.uploadForm.get('typeUpload').valueChanges.subscribe((value) => {
      this.isType = value;
      // this.dataSource = value;
      if (value === 'LKD') {
        this.columns = DataTablePhiBhTotalConstants;
        this.dataSource = [];
      }
      if (value === 'LKK') {
        this.columns = INFO_UPLOAD_TABLE_COLUMN;
      }
      if (value === 'LKD1'){
        this.isStatus = true;
        this.columns = DATA_TABLE_UPLOAD_KHDN;
        this.dataSource = [];
      }
    });
    this.uploadForm.patchValue({typeUpload: 'LKK'});
    setTimeout(() => {
      if (this.isType === 'LKK') {
        this.dateT.setValue(this.datepipe.transform(moment().toDate(), 'MM/yyyy'));
        // this.initshow();
      }
    }, 200);
    this.uploadForm.get('formReason').valueChanges.subscribe((value) => {
      this.reason = value;
      console.log('reason', value);
    });
  }

  initshow(): void {
    const params = new ClhcAtmUpload();
    params.user = this.userInfo.userName;
    params.date = this.dateT.getValue();
    params.status = 2;
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

  reject(status: string): void {
    console.log(status);
  }

  hideButton(data: any): void {
    if (data.length === 0) {
      this.isDisabled = true;
      this.notify.warning('Thông báo', 'Không có dữ liệu.');
      this.display = 'display: none';
    } else {
      this.display = 'display: block';
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
    param.status = 2;
    this.fileService.downloadFile('luong-huuchi-atm/exportsucces', param);
  }

  onApprove(): void
  {
    const dialogParams: ILpbDialog = {
      messages: ['Hãy chắc chắn muốn duyệt dữ liệu này !'],
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
        params.status = 3;
      }
      if (this.isType === 'LKD') {
        urls = 'insurance/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 3;
      }
      if (this.isType === 'LKD1'){
        urls = 'saleNTKHDN/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 3;
      }
      if (this.isType === 'LKD_KHCN') {
        urls = 'lkd-mbnt-khcn/approve-allocate';
        params = new commonParam();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.status = 2;
        return this.putUpdateMbntKhcnPhanBo(params, urls);
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
    if (this.isType === 'LKD'){
      return this.searchDataDVKD();
    }
    if (this.isType === 'LKD1'){
      return this.searchDataNTKhdnCn();
    }
    if (this.isType === 'LKD_KHCN'){
      return this.searchLKD_KHCNPHANBO();
    }

    if (this.isType === 'LKK'){
      return this.searchLHTATM();
    }

    const param = new ClhcAtmUpload();
    param.date = this.dateT.getValue();
    param.user = this.userInfo.userName;
    param.status = 2;
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

  searchDataDVKD(): void {
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '2';
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
    const statusCn = '2';
    this.phibaohiemService.downloadReportForDVKD(url, params, status, statusCn);
  }

  onReject(): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn chắc chắn từ chối duyệt ?'],
      title: 'Thông báo',
      buttons: {
        confirm: {display: true, label: 'Tiếp tục'},
        dismiss: {display: true, label: 'Đóng'},
      },
    };

    this.dialogService.openDialog(dialogParams, (result) => {
      let urls;
      let params;
      if (this.isType === 'LKD') {
        urls = 'insurance/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 4;
      }
      if (this.isType === 'LKK') {
        urls = 'luong-huuchi-atm/change/status';
        params = new ClhcAtmUpload();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.brachCode = this.userInfo.branchCode;
        params.status = 4;
      }
      if (this.isType === 'LKD1'){
        urls = 'saleNTKHDN/change/status';
        params = new ClhcAtmUpload();
        params.date = this.dateT.getValue();
        params.status = 4;
      }

      if (this.isType === 'LKD_KHCN') {
        urls = 'lkd-mbnt-khcn/approve-allocate';
        params = new commonParam();
        params.user = this.userInfo.userName;
        params.date = this.dateT.getValue();
        params.status = 3;
        return this.putUpdateMbntKhcnPhanBo(params, urls);
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

  searchDataNTKhdnCn(): void {
    const params = this.dateT.getValue();
    const status = '1';
    const statusCn = '2';
    const type = 'ALL';
    const url = 'saleNTKHDN/search-for-cn';
    this.muabanNtKHDnService.searchDVKD(url, params, status, statusCn, type).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('data', res.data.typeTable);
        if (res.data.dataCnResponses){
          if (res.data.typeTable === 'TABLE_DVKD'){
            this.columns = DATA_TABLE_NT_KHDN_CN;
            this.dataSource = res.data.dataCnResponses;
            this.isDisabled = false;
            console.log('ly do', res.data.typeReason);
            this.uploadForm.get('formReason').patchValue(res.data.typeReason);
          }
          else {
            this.columns = DATA_TABLE_UPLOAD_KHDN;
            this.dataSource = res.data.dataCnResponses;
            this.isDisabled = false;
            this.uploadForm.get('formReason').patchValue(res.data.typeReason);
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
    const date = this.dateT.getValue();
    const status = '1';
    const statusCn = '2';
    const type = 'ALL';
    this.muabanNtKHDnService.downloadReportForDVKD(url, date, status, statusCn, type);
  }
  searchLKD_KHCNPHANBO(): void {
    const param = new commonParam();
    param.date = this.dateT.getValue();
    param.status = 1;
    debugger;
    this.phibaohiemService.CallAPI(
      'lkd-mbnt-khcn/ds-phanbo'
      , param
      , {
        method: HTTPMethod.POST
        , success: (res) => {
          debugger;

          if (res.body.data.typeTable === 'PB') {
            this.columns = DATA_TABLE_MBNT_KHCN_PHANBO;
            this.dataSource = res.body.data.mbntbc03Responses;
          }else{
            this.columns = DATA_TABLE_MBNT_KHCN;
            this.dataSource = res.body.data.lkdMbntKhcns;
          }
          this.isDisabled = false;

        }
        , error: (er) => {
          this.isDisabled = true;
          if (er.code === 'kpi-service-00-4002'){
            this.notify.warning('Thông báo', 'Không tìm thấy dữ liệu !');
          }else{
            this.notify.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau');
          }
          this.dataSource = null;

        }
      }
    );
  }
  exportLKD_KHCNDVKD(): void {
    const params = new commonParam();
    params.date = this.dateT.getValue();
    params.status = 1;
    params.saveFormat = 'excel';
    this.phibaohiemService.downloadFile('lkd-mbnt-khcn/exportPhanBo', params);
  }

  putUpdateMbntKhcnPhanBo(params: any, urls: string): void {
    this.phibaohiemService.CallAPI(
      urls
      , params
      , {
        method: HTTPMethod.PUT
        , success: (res) => {
          debugger;
          if (res.body.data.success){
            this.notify.success('Thông báo', 'Thành công');
          }else{
            if (res.body.data.code === '600'){
              this.notify.warning('Thông báo', 'Không có dữ liệu !');
            }else{this.notify.error('Thông báo', res.body.data.message); }

          }
          this.dataSource = null;
        }
        , error: (res) => {
          debugger;
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
    param.status = 2;
    this.phibaohiemService.CallAPI(
      'luong-huuchi-atm/list'
      , param
      , {
        method: HTTPMethod.POST
        , success: (res) => {
          if (res ) {
            this.dataSource = res.body.data;
            this.hideButton(res.body.data);
          }
        }
        , error: (er) => {
          this.isDisabled = true;
          this.dataSource = null;
          if (er.code === 'iname-00-99'){
            this.notify.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau');
          }else{
            this.notify.warning('Thông báo', er.message);
          }
        }
      }
    );
  }
}
