import {Component, OnInit, Inject, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Udf} from 'src/app/_models/register.cif';
import {LstUdfCif} from 'src/app/_models/udf-cif';
import {PopupConfirmComponent} from 'src/app/_popup/popup-confirm.component';
import {UdfCifService} from 'src/app/_services/udf-cif.service';
import {NotificationService} from 'src/app/_toast/notification_service';
import {DialogConfig} from 'src/app/_utils/_dialogConfig';
import {ObjConfigPopup} from 'src/app/_utils/_objConfigPopup';
import {ObjCif} from 'src/app/_utils/_returnObjCif';
import {TextMessage} from 'src/app/_utils/_textMessage';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {ErrorMessage} from '../../../../_utils/ErrorMessage';
import {checkPhonesNumber, futureDate, pastDate} from '../../../../_validator/cif.register.validator';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
declare var $: any;

@Component({
  selector: 'app-udf-cif',
  templateUrl: './udf-cif.component.html',
  styleUrls: ['./udf-cif.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UdfCifComponent implements OnInit {
  textMessage: TextMessage = new TextMessage();
  ERROR_MESSAGE = ErrorMessage;
  udfForm: FormGroup;
  submitted: boolean;
  lstUdfCif: LstUdfCif = new LstUdfCif();
  objUdf: Udf = new Udf();
  objConfigPopup: ObjConfigPopup = new ObjConfigPopup();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
              private dialogRef: MatDialogRef<UdfCifComponent>,
              private notificationService: NotificationService,
              private udfService: UdfCifService) {
  }

  ngOnInit(): void {
    this.udfForm = new FormGroup({
      canBoGioiThieu: new FormControl(null, Validators.minLength(10)),
      thuongTatCode: new FormControl(null),
      cifPnkhCode: new FormControl(null, Validators.required),
      khutCode: new FormControl(null),
      tenDoiNgoai: new FormControl(null),
      lvUdCnCaoCifCode: new FormControl(null),
      website: new FormControl(null),
      cnUtpt1483CifCode: new FormControl(null),
      dienThoai: new FormControl(null, [Validators.minLength(10), Validators.maxLength(11)]),
      dbKhVayCode: new FormControl(null),
      tongSoLdHienTai: new FormControl(null),
      congTyNhaNuocCode: new FormControl(null),
      nganhNgheKinhDoanh: new FormControl(null),
      groupCodeCode: new FormControl(null),
      tenVietTat: new FormControl(null),
      // kenhTao: new FormControl(null,Validators.required),
      hoTenVoChong: new FormControl(null),
      cifDinhdanhCode: new FormControl(null),
      coCmndHc: new FormControl(null),
      dangkyDvGdemailDvkd: new FormControl(null),
      ngayCapCmndHc: new FormControl(null),
      tongDoanhThu: new FormControl(null),
      noiCapCmndHc: new FormControl(null),
      khoiDonViGioiThieuCode: new FormControl(null),
      vonCoDinh: new FormControl(null),
      diaBanNongThonCode: new FormControl(null),
      vonLuuDong: new FormControl(null),
      maCbnvLpbCode: new FormControl(null),
      noPhaiThu: new FormControl(null),
      cifGiamDoc: new FormControl(null, Validators.minLength(8)),
      noPhaiTra: new FormControl(null),
      cifKeToanTruong: new FormControl(null, Validators.minLength(8)),
      maHuyenThiXaCode: new FormControl(null),
      comboSanPham2018Code: new FormControl(null),
      viTriToLketVayvonCode: new FormControl(null),
      expiredDate: new FormControl(null),
      maTctdCode: new FormControl(null),
      pnkhKhdk: new FormControl(null),
      tcKTctdCode: new FormControl(null),
      tracuuTtstkwebVivietCode: new FormControl(null, []),
      tongnguonvon: new FormControl(null),
      sdtNhanSmsGdtetkiem: new FormControl(null, [Validators.minLength(10), Validators.maxLength(11), checkPhonesNumber]),
      kyDanhGiaTvn: new FormControl(null),
      soSoBaoHiemXaHoi: new FormControl(null),
      khachHangCode: new FormControl(null),
      nguoiDaidienPhapluat: new FormControl(null),
      loaiChuongTrinhCode: new FormControl(null),
      cmndCccdHc: new FormControl(null),
      tuNgay: new FormControl(null, [futureDate]),
      email: new FormControl(null, Validators.email),
      nhanHdtQuaMail: new FormControl(null),
      denNgay: new FormControl(null, [pastDate]),
    });
    console.log(this.data);
    this.objUdf = this.data.data;
    this.getAllData();
    if (Object.keys(this.objUdf).length > 0) {
      this.filterObj();
    }
    if (this.data.isViewMode) {
      this.udfForm.disable();
    }
  }

  filterObj(): void {
    this.udfForm.get('canBoGioiThieu').setValue(this.objUdf.canBoGioiThieu);
    this.udfForm.get('thuongTatCode').setValue(this.objUdf.thuongTatCode);
    this.udfForm.get('cifPnkhCode').setValue(this.objUdf.cifPnkhCode);
    this.udfForm.get('khutCode').setValue(this.objUdf.khutCode);
    this.udfForm.get('tenDoiNgoai').setValue(this.objUdf.tenDoiNgoai);
    this.udfForm.get('lvUdCnCaoCifCode').setValue(this.objUdf.lvUdCnCaoCifCode);
    this.udfForm.get('website').setValue(this.objUdf.website);
    this.udfForm.get('cnUtpt1483CifCode').setValue(this.objUdf.cnUtpt1483CifCode);
    this.udfForm.get('dienThoai').setValue(this.objUdf.dienThoai);
    this.udfForm.get('dbKhVayCode').setValue(this.objUdf.dbKhVayCode);
    this.udfForm.get('tongSoLdHienTai').setValue(this.objUdf.tongSoLdHienTai);
    this.udfForm.get('congTyNhaNuocCode').setValue(this.objUdf.congTyNhaNuocCode);
    this.udfForm.get('nganhNgheKinhDoanh').setValue(this.objUdf.nganhNgheKinhDoanh);
    this.udfForm.get('groupCodeCode').setValue(this.objUdf.groupCodeCode);
    this.udfForm.get('tenVietTat').setValue(this.objUdf.tenVietTat);
    this.udfForm.get('hoTenVoChong').setValue(this.objUdf.hoTenVoChong);
    this.udfForm.get('cifDinhdanhCode').setValue(this.objUdf.cifDinhdanhCode);
    this.udfForm.get('coCmndHc').setValue(this.objUdf.coCmndHc);
    this.udfForm.get('dangkyDvGdemailDvkd').setValue(this.objUdf.dangkyDvGdemailDvkd);
    this.udfForm.get('ngayCapCmndHc').setValue(this.objUdf.ngayCapCmndHc);
    this.udfForm.get('tongDoanhThu').setValue(this.objUdf.tongDoanhThu);
    this.udfForm.get('noiCapCmndHc').setValue(this.objUdf.noiCapCmndHc);
    this.udfForm.get('khoiDonViGioiThieuCode').setValue(this.objUdf.khoiDonViGioiThieuCode);
    this.udfForm.get('vonCoDinh').setValue(this.objUdf.vonCoDinh);
    this.udfForm.get('diaBanNongThonCode').setValue(this.objUdf.diaBanNongThonCode);
    this.udfForm.get('vonLuuDong').setValue(this.objUdf.vonLuuDong);
    this.udfForm.get('maCbnvLpbCode').setValue(this.objUdf.maCbnvLpbCode);
    this.udfForm.get('noPhaiThu').setValue(this.objUdf.noPhaiThu);
    this.udfForm.get('cifGiamDoc').setValue(this.objUdf.cifGiamDoc);
    this.udfForm.get('noPhaiTra').setValue(this.objUdf.noPhaiTra);
    this.udfForm.get('cifKeToanTruong').setValue(this.objUdf.cifKeToanTruong);
    this.udfForm.get('maHuyenThiXaCode').setValue(this.objUdf.maHuyenThiXaCode);
    this.udfForm.get('comboSanPham2018Code').setValue(this.objUdf.comboSanPham2018Code);
    this.udfForm.get('viTriToLketVayvonCode').setValue(this.objUdf.viTriToLketVayvonCode);
    this.udfForm.get('expiredDate').setValue(this.objUdf.expiredDate);
    this.udfForm.get('maTctdCode').setValue(this.objUdf.maTctdCode);
    this.udfForm.get('pnkhKhdk').setValue(this.objUdf.pnkhKhdk);
    this.udfForm.get('tcKTctdCode').setValue(this.objUdf.tcKTctdCode);
    this.udfForm.get('tracuuTtstkwebVivietCode').setValue(this.objUdf.tracuuTtstkwebVivietCode);
    this.udfForm.get('tongnguonvon').setValue(this.objUdf.tongnguonvon);
    this.udfForm.get('sdtNhanSmsGdtetkiem').setValue(this.objUdf.sdtNhanSmsGdtetkiem);
    this.udfForm.get('kyDanhGiaTvn').setValue(this.objUdf.kyDanhGiaTvn);
    this.udfForm.get('soSoBaoHiemXaHoi').setValue(this.objUdf.soSoBaoHiemXaHoi);
    this.udfForm.get('khachHangCode').setValue(this.objUdf.khachHangCode);
    this.udfForm.get('nguoiDaidienPhapluat').setValue(this.objUdf.nguoiDaidienPhapluat);
    this.udfForm.get('loaiChuongTrinhCode').setValue(this.objUdf.loaiChuongTrinhCode);
    this.udfForm.get('cmndCccdHc').setValue(this.objUdf.cmndCccdHc);
    this.udfForm.get('tuNgay').setValue(this.objUdf.tuNgay);
    this.udfForm.get('email').setValue(this.objUdf.email);
    this.udfForm.get('nhanHdtQuaMail').setValue(this.objUdf.nhanHdtQuaMail);
    this.udfForm.get('denNgay').setValue(this.objUdf.denNgay);
  }

  getAllData(): void {
    this.udfService.getAllUdfCifPnkh().subscribe(rs => this.lstUdfCif.lstAllUdfCifPnkh = rs.items);
    this.udfService.getAllUdfCifMaHuyenThiXa().subscribe(rs => this.lstUdfCif.lstAllUdfCifMaHuyenThiXa = rs.items);
    this.udfService.getAllUdfCifViTriToLketVayvon().subscribe(rs => this.lstUdfCif.lstAllUdfCifViTriToLketVayvon = rs.items);
    this.udfService.getAllUdfCifMaTctd().subscribe(rs => this.lstUdfCif.lstAllUdfCifMaTctd = rs.items);
    this.udfService.getAllUdfCifTcKTctd().subscribe(rs => this.lstUdfCif.lstAllUdfCifTcKTctd = rs.items);
    this.udfService.getAllUdfCifKhachHang().subscribe(rs => this.lstUdfCif.lstAllUdfCifKhachHang = rs.items);
    this.udfService.getAllUdfCifLoaiChuongTrinh().subscribe(rs => this.lstUdfCif.lstAllUdfCifLoaiChuongTrinh = rs.items);
    this.udfService.getAllUdfCifThuongTat().subscribe(rs => this.lstUdfCif.lstAllUdfCifThuongTat = rs.items);
    this.udfService.getAllUdfCifKhut().subscribe(rs => this.lstUdfCif.lstAllUdfCifKhut = rs.items);
    this.udfService.getAllUdfCifLvUdCnCaoCif().subscribe(rs => this.lstUdfCif.lstAllUdfCifLvUdCnCaoCif = rs.items);
    this.udfService.getAllUdfCnUtpt1483Cif().subscribe(rs => this.lstUdfCif.lstAllUdfCnUtpt1483Cif = rs.items);
    this.udfService.getAllUdfCifDbKhVay().subscribe(rs => this.lstUdfCif.lstAllUdfCifDbKhVay = rs.items);
    this.udfService.getAllUdfCifCongTyNhaNuoc().subscribe(rs => this.lstUdfCif.lstAllUdfCifCongTyNhaNuoc = rs.items);
    this.udfService.getAllUdfCifGroupCode().subscribe(rs => this.lstUdfCif.lstAllUdfCifGroupCode = rs.items);
    this.udfService.getAllUdfCifDinhdanh().subscribe(rs => this.lstUdfCif.lstAllUdfCifDinhdanh = rs.items);
    this.udfService.getAllUdfCifKhoiDonViGioiThieu().subscribe(rs => this.lstUdfCif.lstAllUdfCifKhoiDonViGioiThieu = rs.items);
    this.udfService.getAllUdfCifDiaBanNongThon().subscribe(rs => this.lstUdfCif.lstAllUdfCifDiaBanNongThon = rs.items);
    this.udfService.getAllUdfCifMaCbnvLpb().subscribe(rs => this.lstUdfCif.lstAllUdfCifMaCbnvLpb = rs.items);
    this.udfService.getAllUdfCifComboSanPham2018().subscribe(rs => this.lstUdfCif.lsAllUdfCifComboSanPham2018 = rs.items);
    this.udfService.getAllUdfBranch().subscribe(rs => this.lstUdfCif.lstAllUdfBranch = rs.items);
    this.udfService.getAllUdfNhanHddtQuaMail().subscribe(rs => this.lstUdfCif.lstAllUdfNhanHddtQuaMail = rs.items);
    this.udfService.getAllUdfCifTracuuTtstkwebViviet().subscribe(rs => {
      this.lstUdfCif.lstAllUdfCifTracuuTtstkwebViviet = rs.items;
      let codeShow: string;
      this.lstUdfCif.lstAllUdfCifTracuuTtstkwebViviet.forEach((e, index) => {
        this.lstUdfCif.lstAllUdfCifTracuuTtstkwebViviet[index].codeName = e.code + ' - ' + e.name;
        if (e.code === 'Y') {
          codeShow = e.code;
        }
      });
      // this.udfForm.get('tracuuTtstkwebVivietCode').setValue(codeShow)
    });
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.udfForm.controls;
  }

  save(index: any): void {
    this.submitted = true;
    if (this.udfForm.invalid) {
      return;
    }
    const obj = ObjCif.returnObjUdf(this.udfForm.controls);
    this.objConfigPopup.index = index;
    this.objConfigPopup.data = obj;
    this.dialogRef.close(this.objConfigPopup);
  }

  closeDialog(index: any): void {
    const item = {};
    // tslint:disable-next-line:no-string-literal
    item['number'] = 17;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.dialogRef.close(index);
      }
    });
    // this.dialogRef.close(index);
  }
}
