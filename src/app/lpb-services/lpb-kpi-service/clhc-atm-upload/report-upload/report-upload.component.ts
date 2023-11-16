import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
// import {FileService} from '../../../../shared/services/file.service';
import {FileService} from '../../shared/service/file.service';
import {HandleErrorService} from '../../../../shared/services/handleError.service';
import {ultils} from '../../../lpb-water-service/shared/utilites/function';
import * as moment from 'moment/moment';
import {compareDate} from '../../../../shared/constants/utils';
import {ultis} from '../../../../shared/utilites/function';

import {
  PAYMENT_CHANNELS,
  REPORT_TYPES,
  STATUS_TRANSACTION_SEARCH
} from '../../../lpb-water-service/shared/constants/water.constant';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {
  INFO_UPLOAD_TABLE_COLUMN,
  TYPE_UPLOAD,
  TYPE_DOWLOAD,
  TYPE_UPLOAD_MHBC
} from '../../shared/util/clhc-atm-upload.constants';

import {
  DATA_TABLE_BAO_HIEM_PHI,
  TYPE_LKK2,
  TYPE_MBNT_DN,
  TYPEBC_CLHTATM, TYPEBC_HDNGANHAN,
  TYPEBC_MBNTKHCN
} from '../../shared/util/data-table-bao-hiem.constants';

import {HTTPMethod} from '../../../../shared/constants/http-method';
import {CallService} from '../../shared/service/call.service';
import {UserInfo} from '../../../../_models/user';
import {ClhcAtmUpload} from '../../shared/models/clhc-atm-upload';
import {HttpParams} from '@angular/common/http';
import {PhiBaoHiemNhanThoService} from '../../shared/service/phi-bao-hiem-nhan-tho.service';
import {MuaBanNTKHDNService} from '../../shared/service/mua-ban-NT-KHDN.service';
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-report-upload-clhc-atm',
  templateUrl: './report-upload.component.html',
  styleUrls: ['./report-upload.component.scss']
})
export class ReportUploadComponent implements OnInit {
  typesUpload: any;
  dsDonVis: any;
  typeLkkBH: any;
  typeDownload: any;
  maDvSelected: any;
  tenDvSelected: any;
  isChecked = false;
  typeLuong = '';
  typeBaoCao = '';
  typeFile = 'EXCEL';
  isType = 'LKK';

  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  userInfo?: UserInfo;
  formSearch = this.fb.group({
    reportType: [''],
    typeUpload: [''],
    branchCode: [''],
    typeDownload: [''],
    checkAll: [''],
  });


  @ViewChild('valueDate', { static: false }) valueDate: LpbDatePickerComponent;
  //
  constructor(
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private fileService: FileService,
    private handleErrorService: HandleErrorService,
    private call: CallService,
    private phibaohiemService: PhiBaoHiemNhanThoService,
    public datepipe: DatePipe,
    private muabanNtKHDnService: MuaBanNTKHDNService
  ){
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.typesUpload = null;
    this.typesUpload = TYPE_UPLOAD_MHBC;
    this.typeLkkBH = TYPEBC_CLHTATM;
    this.typeDownload = TYPE_DOWLOAD;
    this.initGetBranchs();
    // debugger;
    this.formSearch.get('branchCode')
      .valueChanges.subscribe((value ) => {
          this.maDvSelected = value.branchCode;
          this.tenDvSelected = value.branchName;
        });

    this.formSearch.patchValue({typeUpload: 'LKK',typeDownload: 'EXEL',reportType: 'BC01A'});
    this.formSearch.get('typeDownload').valueChanges.subscribe((value) => {
      this.typeFile = value;
    });
    this.formSearch.get('checkAll').valueChanges.subscribe((value) => {
      // debugger;
      this.isChecked = value;
    });

    this.formSearch.get('typeUpload').valueChanges.subscribe((value) => {
      this.isType = value;
      console.log(this.isType = value);
      if (value === 'LKK')
      {
        this.typeLkkBH = TYPEBC_CLHTATM;
        this.formSearch.patchValue({reportType: 'BC01A'});
        this.typeBaoCao = 'BC01A';
      }
      if (value === 'LKD') {
        this.typeLkkBH = TYPE_LKK2;
        this.formSearch.patchValue({reportType: 'BC02A'});
      }

      if (value === 'LKD_KHCN') {
        this.typeLkkBH = TYPEBC_MBNTKHCN;
        this.formSearch.patchValue({reportType: 'BC03A'});
      }
      if (value === 'LKD1'){
        this.typeLkkBH = TYPE_MBNT_DN;
        this.formSearch.patchValue({reportType: 'BC04A'});
      }
      if (value === 'LKD3'){
        this.typeLkkBH = TYPE_LKK2;
        this.formSearch.patchValue({reportType: 'BC02A'});
      }

      if (value === 'HDNH'){
        this.typeLkkBH = TYPEBC_HDNGANHAN;
        this.formSearch.patchValue({reportType: 'BC02A'});
      }

    });

    this.formSearch.get('reportType').valueChanges.subscribe((value) => {
      this.typeBaoCao = value;
      console.log(this.typeBaoCao = value);

    });

    setTimeout(() => {
      this.valueDate.setValue(this.datepipe.transform(moment().toDate(), 'MM/yyyy'));
    }, 200);
  }

  initGetBranchs(): void
      {
      // debugger;
      this.call.callApi(
          {
            method: HTTPMethod.GET,
            url: 'getlist/DsDonVi',
            progress: false,
            success: (res) => {
              if (res) {
                this.dsDonVis = res.data;
              }
            }
          }
        );
      }

  search(): void {
  }


  exportExcel(): void
    {
      if (this.isType === 'LKD'){
        const date = this.valueDate.getValue();
        const branchCode = this.maDvSelected;
        const getAll = this.isChecked ? '1' : '0';
        const typeFile = this.typeFile;
        // console.log(param.date);
        if (this.typeBaoCao === 'BC02A'){
          const typeBC = this.typeBaoCao;
          this.phibaohiemService.downloadFileBc('insurance/get-bc-bc02a', date, branchCode, typeBC, getAll, typeFile);
        }else {
          const typeBC = this.typeBaoCao;
          this.phibaohiemService.downloadFileBc('insurance/get-bc', date, branchCode, typeBC, getAll, typeFile);
        }
      }
      else if (this.isType === 'LKD_KHCN'){
        const param = new ClhcAtmUpload();
        param.date = this.valueDate.getValue();
        param.user = this.userInfo.userName;
        param.branchCode = this.maDvSelected;
        param.branchName = this.tenDvSelected;
        //param.status = 3;
        // debugger;
        param.saveFormat = this.typeFile;
        param.getAll = this.isChecked ? 1 : 0;
        if (this.typeBaoCao === 'BC03A'){
          param.status = 1;
          this.fileService.downloadFile('report/MBNT03A', param);
        }else if (this.typeBaoCao === 'BC03B'){
          param.status = 1;
          this.fileService.downloadFile('report/MBNT03B', param);
        }else if (this.typeBaoCao === 'BC03C'){
          param.status = 1;
          this.fileService.downloadFile('report/MBNT03C', param);
        }else {
          param.status = 3;
          this.fileService.downloadFile('report/MBNT03D', param);
        }        
      }
      else if (this.isType === 'LKK'){
        const param = new ClhcAtmUpload();
        param.date = this.valueDate.getValue();
        param.user = this.userInfo.userName;
        param.branchCode = this.maDvSelected;
        param.branchName = this.tenDvSelected;
        param.status = 3;
        // debugger;
        param.saveFormat = this.typeFile;
        param.getAll = this.isChecked ? 1 : 0;
        this.fileService.downloadFile('report/ClhtAtm', param);
      }
      else if (this.isType === 'LKD1'){
        const date = this.valueDate.getValue();
        const branchCode = this.maDvSelected;
        const getAll = this.isChecked ? '1' : '0';
        const typeFile = this.typeFile;
        // console.log(param.date);
        if (this.typeBaoCao === 'BC04C') {
          const typeBC = this.typeBaoCao;
          this.muabanNtKHDnService.downloadFileBc('saleNTKHDN/get-bc-bc04c', date, branchCode, typeBC, getAll, typeFile);
        } else {
          const typeBC = this.typeBaoCao;
          this.muabanNtKHDnService.downloadFileBc('saleNTKHDN/get-bc', date, branchCode, typeBC, getAll, typeFile);
        }
      } else if (this.isType === 'HDNH'){
        const param = new ClhcAtmUpload();
        param.date = this.valueDate.getValue();
        param.branchCode = this.maDvSelected;
        param.branchName = this.tenDvSelected;
        param.saveFormat = this.typeFile;
        param.getAll = this.isChecked ? 1 : 0;
        if (this.typeBaoCao === 'BC02A'){
          this.fileService.downloadFile('report/Bc02ALkkHdVon', param);
        }else if (this.typeBaoCao === 'BC02B'){
          this.fileService.downloadFile('report/Bc02BLkkHdVon', param);
        }
      }
      else{
        this.notify.warning('Thông báo', 'Loại báo cáo ' + this.typeBaoCao + 'chưa được xây dựng');
      }
    }
}
