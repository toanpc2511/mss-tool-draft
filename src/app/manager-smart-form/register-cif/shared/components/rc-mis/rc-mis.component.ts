import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { objCifDetail } from 'src/app/shared/constants/cif/cifDetail';
import { CifMisService } from 'src/app/shared/services/cif-mis.service';

@Component({
  selector: 'app-rc-mis',
  templateUrl: './rc-mis.component.html',
  styleUrls: ['./rc-mis.component.scss']
})
export class RcMisComponent implements OnInit {
  @Input() show = false;
  @Output() closeMis = new EventEmitter();
  @Output() objectMis = new EventEmitter();
  @Input() ObjMisCif;
  // các trường thông tin MIS
  selectedCifLoai;
  selectedCifLHKT;
  selectedCifTPKT;
  selectedCifKBHTG;
  selectedLHNNNTVAY;
  selectedTdMANKT;
  selectedCifNganh;
  selectedCifPNKH;
  selectedComTSCT;
  selectedDCGH;
  selectedCifMankt;
  selectedCifKH78;
  // data trả về cho các trường
  lstCIFLOAI = [];
  lstCIFLHKT = [];
  lstCIFTPKT = [];
  lstCIFKBHTG = [];
  lstLHNNNTVAY = [];
  lstTDMANKT = [];
  lstCIFNGANH = [];
  lstCIFPNKH = [];
  lstCOMTSCT = [];
  lstDCGH = [];
  lstCIFMANKT = [];
  lstCIFKH78 = [];
  constructor(
    private cifMisService: CifMisService
  ) { }

  ngOnInit(): void {
    this.cifMisService.getCIFLOAI((res) => {
      this.lstCIFLOAI = res;
    });
    this.cifMisService.getCIF_LHKT((res) => {
      this.lstCIFLHKT = res;
    });
    this.cifMisService.getCIF_TPKT((res) => {
      this.lstCIFTPKT = res;
    });
    this.cifMisService.getCIF_KBHTG((res) => {
      this.lstCIFKBHTG = res;
    });
    this.cifMisService.getLHNNNTVAY((res) => {
      this.lstLHNNNTVAY = res;
    });
    this.cifMisService.getTD_MANKT((res) => {
      this.lstTDMANKT = res;
    });
    this.cifMisService.getCIF_NGANH((res) => {
      this.lstCIFNGANH = res;
    });
    this.cifMisService.getCIF_PNKH((res) => {
      this.lstCIFPNKH = res;
    });
    this.cifMisService.getCOM_TSCT((res) => {
      this.lstCOMTSCT = res;
    });
    this.cifMisService.getCIF_MANKT((res) => {
      this.lstCIFMANKT = res;
    });
    this.cifMisService.getDC_GH((res) => {
      this.lstDCGH = res;
    });
    this.cifMisService.getCIF_KH78((res) => {
      this.lstCIFKH78 = res;
    });
    this.selectedCifTPKT = {
      code: '9000',
      name: '9000 - CAC THANH PHAN KINH TE KHAC',
    };
    this.selectedCifKH78 = {
      code: '0000',
      name: '0000 - KHONG PHAI KHACH HANG HAN CHE',
    };
    this.selectedCifLHKT = { code: '2100' };
    if (!this.ObjMisCif) { return; }
    this.fillDataMisToForm();
  }
  // control form
  getSelectedCifLoai(evt): void { this.selectedCifLoai = evt; }
  getSelectedCifLHKT(evt): void { this.selectedCifLHKT = evt; }
  getSelectedCifTPKT(evt): void { this.selectedCifTPKT = evt; }
  getSelectedCifKBHTG(evt): void { this.selectedCifKBHTG = evt; }
  getSelectedLHNNNTVAY(evt): void { this.selectedLHNNNTVAY = evt; }
  getSelectedTdMANKT(evt): void { this.selectedTdMANKT = evt; }
  getSelectedCifNganh(evt): void { this.selectedCifNganh = evt; }
  getSelectedCifPNKH(evt): void { this.selectedCifPNKH = evt; }
  getSelectedComTSCT(evt): void { this.selectedComTSCT = evt; }
  getSelectedDCGH(evt): void { this.selectedDCGH = evt; }
  getSelectedCifMankt(evt): void { this.selectedCifMankt = evt; }
  getSelectedCifKH78(evt): void { this.selectedCifKH78 = evt; }
  // validate


  getDataMIS(): any {
    let result = null;
    result = {
      cifLhktCode: this.selectedCifLHKT ? this.selectedCifLHKT.code : null,
      cifLhktName: this.selectedCifLHKT ? this.selectedCifLHKT.name : null,
      cifKh78Code: this.selectedCifKH78 ? this.selectedCifKH78.code : null,
      cifManktCode: this.selectedCifMankt ? this.selectedCifMankt.code : null,
      cifTpktCode: this.selectedCifTPKT ? this.selectedCifTPKT.code : null,
      cifKbhtgCode: this.selectedCifKBHTG ? this.selectedCifKBHTG.code : null,
      cifPnkhCode: '00',
      cifLoaiCode: this.selectedCifLoai ? this.selectedCifLoai.code : null,
      lhnnntvayCode: this.selectedLHNNNTVAY ? this.selectedLHNNNTVAY.code : null,
      tdManktCode: this.selectedTdMANKT ? this.selectedTdMANKT.code : null,
      cifNganhCode: this.selectedCifNganh ? this.selectedCifNganh.code : null,
      comTsctCode: this.selectedComTSCT ? this.selectedComTSCT.code : null,
      dcGhCode: this.selectedDCGH ? this.selectedDCGH.code : null,
      cifKh78Name: this.selectedCifKH78 ? this.selectedCifKH78.name : null,
      cifManktName: this.selectedCifMankt ? this.selectedCifMankt.name : null,
      cifTpktName: this.selectedCifTPKT ? this.selectedCifTPKT.name : null,
      cifKbhtgName: this.selectedCifKBHTG ? this.selectedCifKBHTG.name : null,
      cifPnkhName: this.selectedCifPNKH ? this.selectedCifPNKH.name : null,
      cifLoaiName: this.selectedCifLoai ? this.selectedCifLoai.name : null,
      lhnnntvayName: this.selectedLHNNNTVAY ? this.selectedLHNNNTVAY.name : null,
      tdManktName: this.selectedTdMANKT ? this.selectedTdMANKT.name : null,
      cifNganhName: this.selectedCifNganh ? this.selectedCifNganh.name : null,
      comTsctName: this.selectedComTSCT ? this.selectedComTSCT.name : null,
      dcGhName: this.selectedDCGH ? this.selectedDCGH.name : null,
    };
    return this.objectMis.emit(result);
  }
  fillDataMisToForm(): void {
    this.selectedCifLHKT = this.ObjMisCif.cifLhktCode && this.ObjMisCif.cifLhktName ?
      {
        code: this.ObjMisCif.cifLhktCode,
        name: this.ObjMisCif.cifLhktCode + ' - ' + this.ObjMisCif.cifLhktName
      } : null;
    this.selectedCifKH78 = this.ObjMisCif.cifKh78Code && this.ObjMisCif.cifKh78Name ?
      {
        code: this.ObjMisCif.cifKh78Code,
        name: this.ObjMisCif.cifKh78Code + ' - ' + this.ObjMisCif.cifKh78Name
      } : null;
    this.selectedCifMankt = this.ObjMisCif.cifManktCode && this.ObjMisCif.cifManktName ?
      {
        code: this.ObjMisCif.cifManktCode,
        name: this.ObjMisCif.cifManktCode + ' - ' + this.ObjMisCif.cifManktName
      } : null;
    this.selectedCifTPKT = this.ObjMisCif.cifTpktCode && this.ObjMisCif.cifTpktName ?
      {
        code: this.ObjMisCif.cifTpktCode,
        name: this.ObjMisCif.cifTpktCode + ' - ' + this.ObjMisCif.cifTpktName
      } : null;
    this.selectedCifKBHTG = this.ObjMisCif.cifKbhtgCode && this.ObjMisCif.cifKbhtgName ?
      {
        code: this.ObjMisCif.cifKbhtgCode,
        name: this.ObjMisCif.cifKbhtgCode + ' - ' + this.ObjMisCif.cifKbhtgName
      } : null;
    this.selectedCifPNKH = this.ObjMisCif.cifPnkhCode && this.ObjMisCif.cifPnkhName ?
      {
        code: this.ObjMisCif.cifPnkhCode,
        name: this.ObjMisCif.cifPnkhCode + ' - ' + this.ObjMisCif.cifPnkhName
      } : null;
    this.selectedCifLoai = this.ObjMisCif.cifLoaiCode && this.ObjMisCif.cifLoaiName ?
      {
        code: this.ObjMisCif.cifLoaiCode,
        name: this.ObjMisCif.cifLoaiCode + ' - ' + this.ObjMisCif.cifLoaiName
      } : null;
    this.selectedLHNNNTVAY = this.ObjMisCif.lhnnntvayCode && this.ObjMisCif.lhnnntvayName ?
      {
        code: this.ObjMisCif.lhnnntvayCode,
        name: this.ObjMisCif.lhnnntvayCode + ' - ' + this.ObjMisCif.lhnnntvayName
      } : null;
    this.selectedTdMANKT = this.ObjMisCif.tdManktCode && this.ObjMisCif.tdManktName ?
      {
        code: this.ObjMisCif.tdManktCode,
        name: this.ObjMisCif.tdManktCode + ' - ' + this.ObjMisCif.tdManktName
      } : null;
    this.selectedCifNganh = this.ObjMisCif.cifNganhCode && this.ObjMisCif.cifNganhName ?
      {
        code: this.ObjMisCif.cifNganhCode,
        name: this.ObjMisCif.cifNganhCode + ' - ' + this.ObjMisCif.cifNganhName
      } : null;
    this.selectedDCGH = this.ObjMisCif.dcGhCode && this.ObjMisCif.dcGhName ?
      {
        code: this.ObjMisCif.dcGhCode,
        name: this.ObjMisCif.dcGhCode + ' - ' + this.ObjMisCif.dcGhName
      } : null;
    this.selectedComTSCT = this.ObjMisCif.comTsctCode && this.ObjMisCif.comTsctName ?
      {
        code: this.ObjMisCif.comTsctCode,
        name: this.ObjMisCif.comTsctCode + ' - ' + this.ObjMisCif.comTsctName
      } : null;
  }
  close(): void {
    this.closeMis.emit(false);
  }

}
