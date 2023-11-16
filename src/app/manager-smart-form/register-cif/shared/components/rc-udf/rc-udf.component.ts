import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { PREFIX_MOBILE_NUMBER } from 'src/app/shared/constants/constants';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { CifUdfService } from 'src/app/shared/services/cif-udf.service';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-rc-udf',
  templateUrl: './rc-udf.component.html',
  styleUrls: ['./rc-udf.component.scss']
})
export class RcUdfComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() objectUdf = new EventEmitter();
  @Output() closeUdf = new EventEmitter();
  @Input() inpMobileNo;
  @Input() objCifUdf;
  // các trường thông tin UDF
  // canBoGioiThieu;
  canBoGioiThieu;
  selectedThuongTat;
  selectedCifPNKH;
  selectedKHUT;
  selectedLVUDCNCao;
  selectedCNUTPT1483Cif;
  selectedDBKHVay;
  hoTenVoChong;
  selectedCifDinhDanh;
  @ViewChild('ngayCapCmndHc', { static: true }) ngayCapCmndHc: LpbDatePickerComponent;
  noiCapCmndHc;
  selectedKhoiDonViGioiThieu;
  selectedDiaBanNongThon;
  selectedMaCBNVLPB;
  noPhaiThu;
  noPhaiTra;
  selectedMaHuyenThiXa;
  selectedViTriToLKetVayVon;
  pnkhKhdk;
  selectedTraCuuTTSTKWebViViet;
  sdtNhanSmsGdtetkiem;
  kyDanhGiaTnv = 'N';
  isChangekyDanhGiaTnv = false;
  dateKydanhgiaTnv = '';
  soSoBaoHiemXaHoi;
  selectedKhachHang;
  // cmndCccdHc;
  coCmndHc;
  @ViewChild('tuNgay', { static: true }) tuNgay: ElementRef;
  @ViewChild('denNgay', { static: true }) denNgay: ElementRef;
  // data trả về cho các trường
  lstCIFDINHDANH = [];
  lstMACBNVLPB = [];
  lstKHUT = [];
  lstCIFPNKH = [];
  lstKHACHHANG = [];
  lstTHUONGTAT = [];
  lstKHOIDONVIGIOITHIEU = [];
  lstLOAICHUONGTRINH = [];
  lstTRACUUTTSTK = [];
  lstDBKHVAY = [];
  lstMAHUYENTHIXA = [];
  lstDIABANNONGTHON = [];
  lstVITRITOLKETVAYVON = [];
  lstLVUDCNCAOCIF = [];
  lstCNUTPT1483CIF = [];
  validate = false;
  // validate
  errMsgCIFPHKH = '';
  errMsgMobileNo = '';
  errCanBoGioiThieu = '';
  constructor(
    private cifUdfService: CifUdfService,
    private helpService: HelpsService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inpMobileNo && changes.inpMobileNo.currentValue) {
      this.sdtNhanSmsGdtetkiem = changes.inpMobileNo.currentValue;
    }
    if (changes.objUdf && changes.objUdf.currentValue) {

    }
  }
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {

    this.cifUdfService.getlstCIFDINHDANH((res) => {
      this.lstCIFDINHDANH = res;
    });
    this.cifUdfService.getlstMACBNVLPB((res) => {
      this.lstMACBNVLPB = res;
    });
    this.cifUdfService.getlstKHUT((res) => {
      this.lstKHUT = res;
    });
    this.cifUdfService.getlstCIFPNKH((res) => {
      this.lstCIFPNKH = res;
    });
    this.cifUdfService.getlstKHACHHANG((res) => {
      this.lstKHACHHANG = res;
    });
    this.cifUdfService.getlstTHUONGTAT((res) => {
      this.lstTHUONGTAT = res;
    });
    this.cifUdfService.getlstKHOIDONVIGIOITHIEU((res) => {
      this.lstKHOIDONVIGIOITHIEU = res;
    });
    this.cifUdfService.getlstLOAICHUONGTRINH((res) => {
      this.lstLOAICHUONGTRINH = res;
    });
    this.cifUdfService.getlstTRACUUTTSTK((res) => {
      this.lstTRACUUTTSTK = res;
    });
    this.cifUdfService.getlstDBKHVAY((res) => {
      this.lstDBKHVAY = res;
    });
    this.cifUdfService.getlstMAHUYENTHIXA((res) => {
      this.lstMAHUYENTHIXA = res;
    });
    this.cifUdfService.getlstDIABANNONGTHON((res) => {
      this.lstDIABANNONGTHON = res;
    });
    this.cifUdfService.getlstVITRITOLKETVAYVON((res) => {
      this.lstVITRITOLKETVAYVON = res;
    });
    this.cifUdfService.getlstLVUDCNCAOCIF((res) => {
      this.lstLVUDCNCAOCIF = res;
    });
    this.cifUdfService.getlstCNUTPT1483CIF((res) => {
      this.lstCNUTPT1483CIF = res;
    });
    this.selectedCifPNKH = {
      code: 'CNTHUPS',
      name: 'CNTHUPS - Ca nhan thuong phat sinh',
    },
      this.selectedTraCuuTTSTKWebViViet = {
        code: 'Y',
        name: 'Y - Yes',
      };

    if (!this.objCifUdf) { return; }
    this.fillDataUDF();
  }

  // validate
  validatePhoneNumber(): void {
    this.errMsgMobileNo = '';
    if (!this.sdtNhanSmsGdtetkiem || this.sdtNhanSmsGdtetkiem === '') {
      return;
    }
    if (this.sdtNhanSmsGdtetkiem.length !== 10) {
      this.errMsgMobileNo = 'Số điện thoại phải đủ 10 ký tự';
      return;
    }
    // tslint:disable-next-line:variable-name
    const prefix_mobile = this.sdtNhanSmsGdtetkiem.toString().substring(0, 3);
    if (this.sdtNhanSmsGdtetkiem.length === 10 && !PREFIX_MOBILE_NUMBER.includes(prefix_mobile)) {
      this.errMsgMobileNo = 'Số điện thoại sai định dạng';
      return;
    }
  }
  validateCanBoGioiThieu(): void {
    this.errCanBoGioiThieu = '';
    if (this.canBoGioiThieu !== undefined && this.canBoGioiThieu !== null
      && this.canBoGioiThieu !== '' && this.canBoGioiThieu.length !== 10) {
      this.errCanBoGioiThieu = 'Cán bộ giới thiệu phải đủ 10 ký tự';
      return;
    }
  }
  typeChange(event): void {
    if (event === 'Y' && !this.isChangekyDanhGiaTnv) {
      this.getDatekyDanhGiaTvn();
    }
  }
  getDatekyDanhGiaTvn(): void {
    this.isChangekyDanhGiaTnv = false;
    const body = {
      branchCode: JSON.parse(localStorage.getItem('userInfo')).branchCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/getDateBranch',
        data: body,
        progress: false,
        success: (res) => {
          if (res.RESULT !== null) {
            this.isChangekyDanhGiaTnv = true;
            this.dateKydanhgiaTnv = res.RESULT.TODAY;
          }
        }
      }
    );
  }

  blurCMNDHCChange(): void {
    this.ngayCapCmndHc.setErrorMsg('');
    const contentInputDateOfBirth = this.ngayCapCmndHc.haveValue() ? this.ngayCapCmndHc.getValue() : '';
    if (!contentInputDateOfBirth) {
      this.ngayCapCmndHc.setErrorMsg('');
    }
    if (contentInputDateOfBirth) {
      this.validateCMNDHC();
      return;
    }
  }


  validateCMNDHC(): void {
    this.ngayCapCmndHc.setErrorMsg('');
    if (!this.ngayCapCmndHc.haveValidDate()) {
      this.ngayCapCmndHc.setErrorMsg('NGAY CAP CMND HC sai định dạng');
      return;
    }
  }

  onChangeCifDinhDanh(evt): void { this.selectedCifDinhDanh = evt; }
  onChangeKhut(evt): void { this.selectedKHUT = evt; }
  onChangeCifPNKH(evt): void { this.selectedCifPNKH = evt; }
  onChangeThuongTat(evt): void { this.selectedThuongTat = evt; }
  onChangeKhoiDonViGioiThieu(evt): void { this.selectedKhoiDonViGioiThieu = evt; }
  onChangeTraCuuTT(evt): void { this.selectedTraCuuTTSTKWebViViet = evt; }
  onChangeDbKH(evt): void { this.selectedDBKHVay = evt; }
  onChangeMaHuyenThiXa(evt): void { this.selectedMaHuyenThiXa = evt; }
  onChangeDiaBanNongThon(evt): void { this.selectedDiaBanNongThon = evt; }
  onChangeViTriLK(evt): void { this.selectedViTriToLKetVayVon = evt; }
  onChangeLvUdCnCaoCap(evt): void { this.selectedLVUDCNCao = evt; }
  onChangeCnUtpt1483(evt): void { this.selectedCNUTPT1483Cif = evt; }
  onChangeMaCbnvLpbCode(evt): void { this.selectedMaCBNVLPB = evt; }
  onChangeKhachHangCode(evt): void { this.selectedKhachHang = evt; }

  // push to obj
  getUDF(): any {
    let result = null;
    this.validatePhoneNumber();
    this.validateCanBoGioiThieu();
    this.blurCMNDHCChange();
    if (this.errMsgMobileNo !== '' || this.errCanBoGioiThieu !== ''
      || this.ngayCapCmndHc.errorMsg !== '') {
      return;
    }
    result = {
      // id: this.id,
      canBoGioiThieu: this.canBoGioiThieu ? this.canBoGioiThieu : null,
      cifPnkhCode: this.selectedCifPNKH ? this.selectedCifPNKH.name.split(' - ')[0] : null,
      cifPnkhName: this.selectedCifPNKH ? this.selectedCifPNKH.name.split(' - ')[1] : null,
      hoTenVoChong: this.hoTenVoChong ? this.hoTenVoChong : null,
      ngayCapCmndHc: this.ngayCapCmndHc.getValue() ? this.ngayCapCmndHc.getValue() : null,
      noiCapCmndHc: this.noiCapCmndHc ? this.noiCapCmndHc : null,
      noPhaiThu: this.noPhaiThu ? this.noPhaiThu : null,
      noPhaiTra: this.noPhaiTra ? this.noPhaiTra : null,
      maHuyenThiXaCode: this.selectedMaHuyenThiXa ? this.selectedMaHuyenThiXa.name.split(' - ')[0] : null,
      maHuyenThiXaName: this.selectedMaHuyenThiXa ? this.selectedMaHuyenThiXa.name.split(' - ')[1] : null,
      viTriToLketVayvonCode: this.selectedViTriToLKetVayVon ? this.selectedViTriToLKetVayVon.name.split(' - ')[0] : null,
      viTriToLketVayvonName: this.selectedViTriToLKetVayVon ? this.selectedViTriToLKetVayVon.name.split(' - ')[1] : null,
      kyDanhGiaTvn: this.kyDanhGiaTnv === 'Y' ? this.dateKydanhgiaTnv : null,
      dateKydanhgiaTnv: this.dateKydanhgiaTnv ? this.dateKydanhgiaTnv : null,
      khachHangCode: this.selectedKhachHang ? this.selectedKhachHang.name.split(' - ')[0] : null,
      khachHangName: this.selectedKhachHang ? this.selectedKhachHang.name.split(' - ')[1] : null,
      thuongTatCode: this.selectedThuongTat ? this.selectedThuongTat.name.split(' - ')[0] : null,
      thuongTatName: this.selectedThuongTat ? this.selectedThuongTat.name.split(' - ')[1] : null,
      khutCode: this.selectedKHUT ? this.selectedKHUT.name.split(' - ')[0] : null,
      khutName: this.selectedKHUT ? this.selectedKHUT.name.split(' - ')[1] : null,
      lvUdCnCaoCifCode: this.selectedLVUDCNCao ? this.selectedLVUDCNCao.name.split(' - ')[0] : null,
      lvUdCnCaoCifName: this.selectedLVUDCNCao ? this.selectedLVUDCNCao.name.split(' - ')[1] : null,
      cnUtpt1483CifCode: this.selectedCNUTPT1483Cif ? this.selectedCNUTPT1483Cif.name.split(' - ')[0] : null,
      cnUtpt1483CifName: this.selectedCNUTPT1483Cif ? this.selectedCNUTPT1483Cif.name.split(' - ')[1] : null,
      dbKhVayCode: this.selectedDBKHVay ? this.selectedDBKHVay.name.split(' - ')[0] : null,
      dbKhVayName: this.selectedDBKHVay ? this.selectedDBKHVay.name.split(' - ')[1] : null,
      cifDinhdanhCode: this.selectedCifDinhDanh ? this.selectedCifDinhDanh.name.split(' - ')[0] : null,
      cifDinhdanhName: this.selectedCifDinhDanh ? this.selectedCifDinhDanh.name.split(' - ')[1] : null,
      khoiDonViGioiThieuCode: this.selectedKhoiDonViGioiThieu ? this.selectedKhoiDonViGioiThieu.name.split(' - ')[0] : null,
      khoiDonViGioiThieuName: this.selectedKhoiDonViGioiThieu ? this.selectedKhoiDonViGioiThieu.name.split(' - ')[1] : null,
      diaBanNongThonCode: this.selectedDiaBanNongThon ? this.selectedDiaBanNongThon.name.split(' - ')[0] : null,
      diaBanNongThonName: this.selectedDiaBanNongThon ? this.selectedDiaBanNongThon.name.split(' - ')[1] : null,
      maCbnvLpbCode: this.selectedMaCBNVLPB ? this.selectedMaCBNVLPB.name.split(' - ')[0] : null,
      maCbnvLpbName: this.selectedMaCBNVLPB ? this.selectedMaCBNVLPB.name.split(' - ')[1] : null,
      pnkhKhdk: this.pnkhKhdk ? this.pnkhKhdk : null,
      tracuuTtstkwebVivietCode: this.selectedTraCuuTTSTKWebViViet ? this.selectedTraCuuTTSTKWebViViet.name.split(' - ')[0] : null,
      tracuuTtstkwebVivietName: this.selectedTraCuuTTSTKWebViViet ? this.selectedTraCuuTTSTKWebViViet.name.split(' - ')[1] : null,
      sdtNhanSmsGdtetkiem: this.sdtNhanSmsGdtetkiem ? this.sdtNhanSmsGdtetkiem : null,
      soSoBaoHiemXaHoi: this.soSoBaoHiemXaHoi ? this.soSoBaoHiemXaHoi : null,
      coCmndHc: this.coCmndHc ? this.coCmndHc : null,
      // kenhTao: 'taiquay'
    };
    return this.objectUdf.emit(result);
    // return result;
  }
  close(): void {
    this.closeUdf.emit(false);
  }
  fillDataUDF(): void {
    this.kyDanhGiaTnv = this.objCifUdf.kyDanhGiaTvn != null ? 'Y' : 'N';
    this.dateKydanhgiaTnv = this.objCifUdf.dateKydanhgiaTnv ? this.objCifUdf.dateKydanhgiaTnv : null;
    this.canBoGioiThieu = this.objCifUdf.canBoGioiThieu;
    this.selectedThuongTat = this.objCifUdf.thuongTatCode ?
      {
        code: this.objCifUdf.thuongTatCode,
        name: this.objCifUdf.thuongTatCode + ' - ' + this.objCifUdf.thuongTatName
      } : null;
    this.selectedCifPNKH = this.objCifUdf.cifPnkhCode ?
      {
        code: this.objCifUdf.cifPnkhCode,
        name: this.objCifUdf.cifPnkhCode + ' - ' + this.objCifUdf.cifPnkhName
      } : null;
    this.selectedKHUT = this.objCifUdf.khutCode ?
      {
        code: this.objCifUdf.khutCode,
        name: this.objCifUdf.khutCode + ' - ' + this.objCifUdf.khutName
      } : null;
    this.selectedLVUDCNCao = this.objCifUdf.lvUdCnCaoCifCode ?
      {
        code: this.objCifUdf.lvUdCnCaoCifCode,
        name: this.objCifUdf.lvUdCnCaoCifCode + ' - ' + this.objCifUdf.lvUdCnCaoCifName
      } : null;
    this.selectedCNUTPT1483Cif = this.objCifUdf.cnUtpt1483CifCode ?
      {
        code: this.objCifUdf.cnUtpt1483CifCode,
        name: this.objCifUdf.cnUtpt1483CifCode + ' - ' + this.objCifUdf.cnUtpt1483CifName
      } : null;
    this.selectedDBKHVay = this.objCifUdf.dbKhVayCode ?
      {
        code: this.objCifUdf.dbKhVayCode,
        name: this.objCifUdf.dbKhVayCode + ' - ' + this.objCifUdf.dbKhVayName
      } : null;
    this.hoTenVoChong = this.objCifUdf.hoTenVoChong;
    this.selectedCifDinhDanh = this.objCifUdf.cifDinhdanhCode ?
      {
        code: this.objCifUdf.cifDinhdanhCode,
        name: this.objCifUdf.cifDinhdanhCode + ' - ' + this.objCifUdf.cifDinhdanhName
      } : null;
    this.noiCapCmndHc = this.objCifUdf.noiCapCmndHc;
    this.selectedKhoiDonViGioiThieu = this.objCifUdf.khoiDonViGioiThieuCode ?
      {
        code: this.objCifUdf.khoiDonViGioiThieuCode,
        name: this.objCifUdf.khoiDonViGioiThieuCode + ' - ' + this.objCifUdf.khoiDonViGioiThieuName
      } : null;
    this.selectedDiaBanNongThon = this.objCifUdf.diaBanNongThonCode ?
      {
        code: this.objCifUdf.diaBanNongThonCode,
        name: this.objCifUdf.diaBanNongThonCode + ' - ' + this.objCifUdf.diaBanNongThonName
      } : null;
    this.selectedMaCBNVLPB = this.objCifUdf.maCbnvLpbCode ?
      {
        code: this.objCifUdf.maCbnvLpbCode,
        name: this.objCifUdf.maCbnvLpbCode + ' - ' + this.objCifUdf.maCbnvLpbName
      } : null;
    this.noPhaiThu = this.objCifUdf.noPhaiThu;
    this.noPhaiTra = this.objCifUdf.noPhaiTra;
    this.selectedMaHuyenThiXa = this.objCifUdf.maHuyenThiXaCode ?
      {
        code: this.objCifUdf.maHuyenThiXaCode,
        name: this.objCifUdf.maHuyenThiXaCode + ' - ' + this.objCifUdf.maHuyenThiXaName
      } : null;
    this.selectedViTriToLKetVayVon = this.objCifUdf.viTriToLketVayvonCode ?
      {
        code: this.objCifUdf.viTriToLketVayvonCode,
        name: this.objCifUdf.viTriToLketVayvonCode + ' - ' + this.objCifUdf.viTriToLketVayvonName
      } : null;
    this.pnkhKhdk = this.objCifUdf.pnkhKhdk;
    this.selectedTraCuuTTSTKWebViViet = this.objCifUdf.tracuuTtstkwebVivietCode ?
      {
        code: this.objCifUdf.tracuuTtstkwebVivietCode,
        name: this.objCifUdf.tracuuTtstkwebVivietCode + ' - ' + this.objCifUdf.tracuuTtstkwebVivietName
      } : null;
    this.sdtNhanSmsGdtetkiem = this.objCifUdf.sdtNhanSmsGdtetkiem;
    this.soSoBaoHiemXaHoi = this.objCifUdf.soSoBaoHiemXaHoi;
    this.selectedKhachHang = this.objCifUdf.khachHangCode ?
      {
        code: this.objCifUdf.khachHangCode,
        name: this.objCifUdf.khachHangCode + ' - ' + this.objCifUdf.khachHangName
      } : null;
    this.ngayCapCmndHc.setValue(this.objCifUdf.ngayCapCmndHc ? this.objCifUdf.ngayCapCmndHc : '');
    this.ngayCapCmndHc.setErrorMsg('');
    this.coCmndHc = this.objCifUdf.coCmndHc;

  }
}
