import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { PREFIX_MOBILE_NUMBER } from 'src/app/shared/constants/constants';
import { CifUdfService } from 'src/app/shared/services/cif-udf.service';

@Component({
  selector: 'app-account-owner-udf',
  templateUrl: './account-owner-udf.component.html',
  styleUrls: ['./account-owner-udf.component.scss']
})
export class AccountOwnerUdfComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() objectUdf = new EventEmitter();
  @Output() closeUdf = new EventEmitter();
  @Input() inpMobileNo;
  @Input() objOwnerUdf;
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
  // kyDanhGiaTvn;
  @ViewChild('kyDanhGiaTvn', { static: true }) kyDanhGiaTvn: LpbDatePickerComponent;
  soSoBaoHiemXaHoi;
  selectedKhachHang;
  cmndCccdHc;
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
  errMsgSdtNhanSmsGdtetkiem = '';
  errMsgMobileNo = '';
  errCanBoGioiThieu = '';
  errMsgKyDanhGiaTvn = '';
  constructor(
    private cifUdfService: CifUdfService
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
    setTimeout(() => {
      this.getListCifDinhDanh();
      this.getListMACBNVLPB();
      this.getListKUT();
      this.getListCIFPNKH();
      this.getListKhachHang();
      this.getListThuongTat();
      this.getListKHOIDONVIGIOITHIEU();
      this.getListTRACUUTTSTK();
      this.getListDBKHVAY();
      this.getListMAHUYENTHIXA();
      this.getListDIABANNONGTHON();
      this.getListVITRITOLKETVAYVON();
      this.getListLVUDCNCAOCIF();
      this.getListCNUTPT1483CIF();
    }, 10);
    this.selectedCifPNKH = {
      code: 'CNTHUPS',
      name: 'CNTHUPS - Ca nhan thuong phat sinh',
    },
      this.selectedTraCuuTTSTKWebViViet = {
        code: 'Y',
        name: 'Y - Yes',
      };

    if (!this.objOwnerUdf) { return; }
    this.fillDataUDF();
  }

  getListCifDinhDanh(): void {
    this.cifUdfService.getlstCIFDINHDANH((res) => {
      this.lstCIFDINHDANH = res;
      if (this.lstCIFDINHDANH !== null && this.lstCIFDINHDANH.length > 0) {
        this.lstCIFDINHDANH.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.cifDinhdanhCode) {
            this.selectedCifDinhDanh = this.objOwnerUdf.cifDinhdanhCode ?
              {
                code: this.objOwnerUdf.cifDinhdanhCode,
                name: this.objOwnerUdf.cifDinhdanhCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListMACBNVLPB(): void {
    this.cifUdfService.getlstMACBNVLPB((res) => {
      this.lstMACBNVLPB = res;
      if (this.lstMACBNVLPB !== null && this.lstMACBNVLPB.length > 0) {
        this.lstMACBNVLPB.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.maCbnvLpbCode) {
            this.selectedMaCBNVLPB = this.objOwnerUdf.maCbnvLpbCode ?
              {
                code: this.objOwnerUdf.maCbnvLpbCode,
                name: this.objOwnerUdf.maCbnvLpbCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListKUT(): void {
    this.cifUdfService.getlstKHUT((res) => {
      this.lstKHUT = res;
      if (this.lstKHUT !== null && this.lstKHUT.length > 0) {
        this.lstKHUT.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.khutCode) {
            this.selectedKHUT = this.objOwnerUdf.khutCode ?
              {
                code: this.objOwnerUdf.khutCode,
                name: this.objOwnerUdf.khutCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFPNKH(): void {
    this.cifUdfService.getlstCIFPNKH((res) => {
      this.lstCIFPNKH = res;
      if (this.lstCIFPNKH !== null && this.lstCIFPNKH.length > 0) {
        this.lstCIFPNKH.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.cifPnkhCode) {
            this.selectedCifPNKH = this.objOwnerUdf.cifPnkhCode ?
              {
                code: this.objOwnerUdf.cifPnkhCode,
                name: this.objOwnerUdf.cifPnkhCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListKhachHang(): void {
    this.cifUdfService.getlstKHACHHANG((res) => {
      this.lstKHACHHANG = res;
      if (this.lstKHACHHANG !== null && this.lstKHACHHANG.length > 0) {
        this.lstKHACHHANG.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.khachHangCode) {
            this.selectedKhachHang = this.objOwnerUdf.khachHangCode ?
              {
                code: this.objOwnerUdf.khachHangCode,
                name: this.objOwnerUdf.khachHangCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListThuongTat(): void {
    this.cifUdfService.getlstTHUONGTAT((res) => {
      this.lstTHUONGTAT = res;
      if (this.lstTHUONGTAT !== null && this.lstTHUONGTAT.length > 0) {
        this.lstTHUONGTAT.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.thuongTatCode) {
            this.selectedThuongTat = this.objOwnerUdf.thuongTatCode ?
              {
                code: this.objOwnerUdf.thuongTatCode,
                name: this.objOwnerUdf.thuongTatCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListKHOIDONVIGIOITHIEU(): void {
    this.cifUdfService.getlstKHOIDONVIGIOITHIEU((res) => {
      this.lstKHOIDONVIGIOITHIEU = res;
      if (this.lstKHOIDONVIGIOITHIEU !== null && this.lstKHOIDONVIGIOITHIEU.length > 0) {
        this.lstKHOIDONVIGIOITHIEU.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.khoiDonViGioiThieuCode) {
            this.selectedKhoiDonViGioiThieu = this.objOwnerUdf.khoiDonViGioiThieuCode ?
              {
                code: this.objOwnerUdf.khoiDonViGioiThieuCode,
                name: this.objOwnerUdf.khoiDonViGioiThieuCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListTRACUUTTSTK(): void {
    this.cifUdfService.getlstTRACUUTTSTK((res) => {
      this.lstTRACUUTTSTK = res;
      if (this.lstTRACUUTTSTK !== null && this.lstTRACUUTTSTK.length > 0) {
        this.lstTRACUUTTSTK.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.tracuuTtstkwebVivietCode) {
            this.selectedTraCuuTTSTKWebViViet = this.objOwnerUdf.tracuuTtstkwebVivietCode ?
              {
                code: this.objOwnerUdf.tracuuTtstkwebVivietCode,
                name: this.objOwnerUdf.tracuuTtstkwebVivietCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListDBKHVAY(): void {
    this.cifUdfService.getlstDBKHVAY((res) => {
      this.lstDBKHVAY = res;
      if (this.lstDBKHVAY !== null && this.lstDBKHVAY.length > 0) {
        this.lstDBKHVAY.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.dbKhVayCode) {
            this.selectedDBKHVay = this.objOwnerUdf.dbKhVayCode ?
              {
                code: this.objOwnerUdf.dbKhVayCode,
                name: this.objOwnerUdf.dbKhVayCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListMAHUYENTHIXA(): void {
    this.cifUdfService.getlstMAHUYENTHIXA((res) => {
      this.lstMAHUYENTHIXA = res;
      if (this.lstMAHUYENTHIXA !== null && this.lstMAHUYENTHIXA.length > 0) {
        this.lstMAHUYENTHIXA.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.maHuyenThiXaCode) {
            this.selectedMaHuyenThiXa = this.objOwnerUdf.maHuyenThiXaCode ?
              {
                code: this.objOwnerUdf.maHuyenThiXaCode,
                name: this.objOwnerUdf.maHuyenThiXaCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListDIABANNONGTHON(): void {
    this.cifUdfService.getlstDIABANNONGTHON((res) => {
      this.lstDIABANNONGTHON = res;
      if (this.lstDIABANNONGTHON !== null && this.lstDIABANNONGTHON.length > 0) {
        this.lstDIABANNONGTHON.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.diaBanNongThonCode) {
            this.selectedDiaBanNongThon = this.objOwnerUdf.diaBanNongThonCode ?
              {
                code: this.objOwnerUdf.diaBanNongThonCode,
                name: this.objOwnerUdf.diaBanNongThonCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListVITRITOLKETVAYVON(): void {
    this.cifUdfService.getlstVITRITOLKETVAYVON((res) => {
      this.lstVITRITOLKETVAYVON = res;
      if (this.lstVITRITOLKETVAYVON !== null && this.lstVITRITOLKETVAYVON.length > 0) {
        this.lstVITRITOLKETVAYVON.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.viTriToLketVayvonCode) {
            this.selectedDiaBanNongThon = this.objOwnerUdf.viTriToLketVayvonCode ?
              {
                code: this.objOwnerUdf.viTriToLketVayvonCode,
                name: this.objOwnerUdf.viTriToLketVayvonCode + ' - ' + e.name.split(' - ')[1]
              } : null;
          }
        });
      }
    });
  }

  getListLVUDCNCAOCIF(): void {
    this.cifUdfService.getlstLVUDCNCAOCIF((res) => {
      this.lstLVUDCNCAOCIF = res;
      if (this.lstLVUDCNCAOCIF !== null && this.lstLVUDCNCAOCIF.length > 0) {
        this.lstLVUDCNCAOCIF.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.lvUdCnCaoCifCode) {
            this.selectedLVUDCNCao = this.objOwnerUdf.lvUdCnCaoCifCode ?
              {
                code: this.objOwnerUdf.lvUdCnCaoCifCode,
                name: this.objOwnerUdf.lvUdCnCaoCifCode + ' - ' + e.name.split(' - ')[1]
              } : null;
          }
        });
      }
    });
  }

  getListCNUTPT1483CIF(): void {
    this.cifUdfService.getlstCNUTPT1483CIF((res) => {
      this.lstCNUTPT1483CIF = res;
      if (this.lstCNUTPT1483CIF !== null && this.lstCNUTPT1483CIF.length > 0) {
        this.lstCNUTPT1483CIF.forEach(e => {
          if (this.objOwnerUdf && e.code === this.objOwnerUdf.cnUtpt1483CifCode) {
            this.selectedCNUTPT1483Cif = this.objOwnerUdf.cnUtpt1483CifCode ?
              {
                code: this.objOwnerUdf.cnUtpt1483CifCode,
                name: this.objOwnerUdf.cnUtpt1483CifCode + ' - ' + e.name.split(' - ')[1]
              } : null;
          }
        });
      }
    });
  }
  close(): void {
    this.closeUdf.emit(false);
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
    // console.log(prefix_mobile);
    if (!PREFIX_MOBILE_NUMBER.includes(prefix_mobile)) {
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

  blurKDDGChange(): void {
    this.kyDanhGiaTvn.setErrorMsg('');
    const contentInputDateOfBirth = this.kyDanhGiaTvn.haveValue() ? this.kyDanhGiaTvn.getValue() : '';
    if (!contentInputDateOfBirth) {
      this.kyDanhGiaTvn.setErrorMsg('');
    }
    if (contentInputDateOfBirth) {
      this.validateKiDanh();
      return;
    }
  }
  validateKiDanh(): void {
    this.kyDanhGiaTvn.setErrorMsg('');
    if (!this.kyDanhGiaTvn.haveValidDate()) {
      this.kyDanhGiaTvn.setErrorMsg('KY DANH GIA TNV sai định dạng');
      return;
    }
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

  onChangeCifDinhDanh(evt): void {
    this.selectedCifDinhDanh = evt;
  }
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
    this.blurKDDGChange();
    if (this.errMsgMobileNo !== '' || this.errMsgSdtNhanSmsGdtetkiem !== '' || this.errCanBoGioiThieu !== ''
      || this.ngayCapCmndHc.errorMsg !== '' || this.kyDanhGiaTvn.errorMsg !== '' || this.errMsgKyDanhGiaTvn !== '') {
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
      kyDanhGiaTvn: this.kyDanhGiaTvn.getValue() ? this.kyDanhGiaTvn.getValue() : null,
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
      cmndCccdHc: this.cmndCccdHc ? this.cmndCccdHc : null,
      kenhTao: 'online'
    };

    return this.objectUdf.emit(result);
  }
  fillDataUDF(): void {
    this.canBoGioiThieu = this.objOwnerUdf.canBoGioiThieu;
    this.hoTenVoChong = this.objOwnerUdf.hoTenVoChong;
    this.noiCapCmndHc = this.objOwnerUdf.noiCapCmndHc;
    this.noPhaiThu = this.objOwnerUdf.noPhaiThu;
    this.noPhaiTra = this.objOwnerUdf.noPhaiTra;
    this.pnkhKhdk = this.objOwnerUdf.pnkhKhdk;
    this.sdtNhanSmsGdtetkiem = this.objOwnerUdf.sdtNhanSmsGdtetkiem;
    this.soSoBaoHiemXaHoi = this.objOwnerUdf.soSoBaoHiemXaHoi;
    this.kyDanhGiaTvn.setValue(this.objOwnerUdf.kyDanhGiaTvn ? this.objOwnerUdf.kyDanhGiaTvn : '');
    this.ngayCapCmndHc.setValue(this.objOwnerUdf.ngayCapCmndHc ? this.objOwnerUdf.ngayCapCmndHc : '');
    this.kyDanhGiaTvn.setErrorMsg('');
    this.ngayCapCmndHc.setErrorMsg('');
    this.cmndCccdHc = this.objOwnerUdf.cmndCccdHc;
  }
}
