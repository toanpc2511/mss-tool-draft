import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { objCifDetail } from 'src/app/shared/constants/cif/cifDetail';
import { CifMisService } from 'src/app/shared/services/cif-mis.service';

@Component({
  selector: 'app-account-owner-mis',
  templateUrl: './account-owner-mis.component.html',
  styleUrls: ['./account-owner-mis.component.scss']
})
export class AccountOwnerMisComponent implements OnInit {
  @Input() show = false;
  @Output() closeMis = new EventEmitter();
  @Output() objectMis = new EventEmitter();
  @Input() ObjMisOwner;
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
    setTimeout(() => {
      this.getListCIFLOAI();
      this.getListCIFLHKT();
      this.getListCIFTPKT();
      this.getListCIFKBHTG();
      this.getListLHNNNTVAY();
      this.getListTDMANKT();
      this.getListCIFNGANH();
      this.getListCIFPNKH();
      this.getListCOMTSCT();
      this.getListCIFMANKT();
      this.getListDCGH();
      this.getListCIFKH78();
    }, 10);
    this.selectedCifTPKT = {
      code: '9000',
      name: '9000 - CAC THANH PHAN KINH TE KHAC',
    };
    this.selectedCifKH78 = {
      code: '0000',
      name: '0000 - KHONG PHAI KHACH HANG HAN CHE',
    };
    this.selectedCifLHKT = { code: '2100' };
    if (!this.ObjMisOwner) { return; }

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


  getListCIFLOAI(): void {
    this.cifMisService.getCIFLOAI((res) => {
      this.lstCIFLOAI = res;
      if (this.lstCIFLOAI !== null && this.lstCIFLOAI.length > 0) {
        this.lstCIFLOAI.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifLoaiCode) {
            this.selectedCifLoai = this.ObjMisOwner.cifLoaiCode ?
              {
                code: this.ObjMisOwner.cifLoaiCode,
                name: this.ObjMisOwner.cifLoaiCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFLHKT(): void {
    this.cifMisService.getCIF_LHKT((res) => {
      this.lstCIFLHKT = res;
      if (this.lstCIFLHKT !== null && this.lstCIFLHKT.length > 0) {
        this.lstCIFLHKT.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifLhktCode) {
            this.selectedCifLHKT = this.ObjMisOwner.cifLhktCode ?
              {
                code: this.ObjMisOwner.cifLhktCode,
                name: this.ObjMisOwner.cifLhktCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFTPKT(): void {
    this.cifMisService.getCIF_TPKT((res) => {
      this.lstCIFTPKT = res;
      if (this.lstCIFTPKT !== null && this.lstCIFTPKT.length > 0) {
        this.lstCIFTPKT.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifTpktCode) {
            this.selectedCifTPKT = this.ObjMisOwner.cifTpktCode ?
              {
                code: this.ObjMisOwner.cifTpktCode,
                name: this.ObjMisOwner.cifTpktCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFKBHTG(): void {
    this.cifMisService.getCIF_KBHTG((res) => {
      this.lstCIFKBHTG = res;
      if (this.lstCIFKBHTG !== null && this.lstCIFKBHTG.length > 0) {
        this.lstCIFKBHTG.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifKbhtgCode) {
            this.selectedCifKBHTG = this.ObjMisOwner.cifKbhtgCode ?
              {
                code: this.ObjMisOwner.cifKbhtgCode,
                name: this.ObjMisOwner.cifKbhtgCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListLHNNNTVAY(): void {
    this.cifMisService.getLHNNNTVAY((res) => {
      this.lstLHNNNTVAY = res;
      if (this.lstLHNNNTVAY !== null && this.lstLHNNNTVAY.length > 0) {
        this.lstLHNNNTVAY.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.lhnnntvayCode) {
            this.selectedLHNNNTVAY = this.ObjMisOwner.lhnnntvayCode ?
              {
                code: this.ObjMisOwner.lhnnntvayCode,
                name: this.ObjMisOwner.lhnnntvayCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListTDMANKT(): void {
    this.cifMisService.getTD_MANKT((res) => {
      this.lstTDMANKT = res;
      if (this.lstTDMANKT !== null && this.lstTDMANKT.length > 0) {
        this.lstTDMANKT.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.tdManktCode) {
            this.selectedTdMANKT = this.ObjMisOwner.tdManktCode ?
              {
                code: this.ObjMisOwner.tdManktCode,
                name: this.ObjMisOwner.tdManktCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFNGANH(): void {
    this.cifMisService.getCIF_NGANH((res) => {
      this.lstCIFNGANH = res;
      if (this.lstCIFNGANH !== null && this.lstCIFNGANH.length > 0) {
        this.lstCIFNGANH.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifNganhCode) {
            this.selectedCifNganh = this.ObjMisOwner.cifNganhCode ?
              {
                code: this.ObjMisOwner.cifNganhCode,
                name: this.ObjMisOwner.cifNganhCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFPNKH(): void {
    this.cifMisService.getCIF_PNKH((res) => {
      this.lstCIFPNKH = res;
      if (this.lstCIFPNKH !== null && this.lstCIFPNKH.length > 0) {
        this.lstCIFPNKH.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifPnkhCode) {
            this.selectedCifPNKH = this.ObjMisOwner.cifPnkhCode ?
              {
                code: this.ObjMisOwner.cifPnkhCode,
                name: this.ObjMisOwner.cifPnkhCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCOMTSCT(): void {
    this.cifMisService.getCOM_TSCT((res) => {
      this.lstCOMTSCT = res;
      if (this.lstCOMTSCT !== null && this.lstCOMTSCT.length > 0) {
        this.lstCOMTSCT.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.comTsctCode) {
            this.selectedComTSCT = this.ObjMisOwner.comTsctCode ?
              {
                code: this.ObjMisOwner.comTsctCode,
                name: this.ObjMisOwner.comTsctCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFMANKT(): void {
    this.cifMisService.getCIF_MANKT((res) => {
      this.lstCIFMANKT = res;
      if (this.lstCIFMANKT !== null && this.lstCIFMANKT.length > 0) {
        this.lstCIFMANKT.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifManktCode) {
            this.selectedCifMankt = this.ObjMisOwner.cifManktCode ?
              {
                code: this.ObjMisOwner.cifManktCode,
                name: this.ObjMisOwner.cifManktCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListDCGH(): void {
    this.cifMisService.getDC_GH((res) => {
      this.lstDCGH = res;
      if (this.lstDCGH !== null && this.lstDCGH.length > 0) {
        this.lstDCGH.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.dcGhCode) {
            this.selectedDCGH = this.ObjMisOwner.dcGhCode ?
              {
                code: this.ObjMisOwner.dcGhCode,
                name: this.ObjMisOwner.dcGhCode + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getListCIFKH78(): void {
    this.cifMisService.getCIF_KH78((res) => {
      this.lstCIFKH78 = res;
      if (this.lstCIFKH78 !== null && this.lstCIFKH78.length > 0) {
        this.lstCIFKH78.forEach(e => {
          if (this.ObjMisOwner && e.code === this.ObjMisOwner.cifKh78Code) {
            this.selectedCifKH78 = this.ObjMisOwner.cifKh78Code ?
              {
                code: this.ObjMisOwner.cifKh78Code,
                name: this.ObjMisOwner.cifKh78Code + ' - ' + (e.name ? e.name.split(' - ')[1] : null)
              } : null;
          }
        });
      }
    });
  }

  getDataMIS(): any {
    let result = null;
    result = {
      cifLhktCode: this.selectedCifLHKT ? this.selectedCifLHKT.code : null,
      cifLhktName: this.selectedCifLHKT ? this.selectedCifLHKT.name : null,
      cifKh78Code: this.selectedCifKH78 ? this.selectedCifKH78.code : null,
      cifManktCode: this.selectedCifMankt ? this.selectedCifMankt.code : null,
      cifTpktCode: this.selectedCifTPKT ? this.selectedCifTPKT.code : null,
      cifKbhtgCode: this.selectedCifKBHTG ? this.selectedCifKBHTG.code : null,
      cifPnkhCode: this.selectedCifPNKH ? this.selectedCifPNKH.code : null,
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
    this.selectedCifLHKT = this.ObjMisOwner.cifLhktCode && this.ObjMisOwner.cifLhktName ?
      {
        code: this.ObjMisOwner.cifLhktCode,
        name: this.ObjMisOwner.cifLhktCode + ' - ' + this.ObjMisOwner.cifLhktName
      } : null;
    this.selectedCifKH78 = this.ObjMisOwner.cifKh78Code && this.ObjMisOwner.cifKh78Name ?
      {
        code: this.ObjMisOwner.cifKh78Code,
        name: this.ObjMisOwner.cifKh78Code + ' - ' + this.ObjMisOwner.cifKh78Name
      } : null;
    this.selectedCifMankt = this.ObjMisOwner.cifManktCode && this.ObjMisOwner.cifManktName ?
      {
        code: this.ObjMisOwner.cifManktCode,
        name: this.ObjMisOwner.cifManktCode + ' - ' + this.ObjMisOwner.cifManktName
      } : null;
    this.selectedCifTPKT = this.ObjMisOwner.cifTpktCode && this.ObjMisOwner.cifTpktName ?
      {
        code: this.ObjMisOwner.cifTpktCode,
        name: this.ObjMisOwner.cifTpktCode + ' - ' + this.ObjMisOwner.cifTpktName
      } : null;
    this.selectedCifKBHTG = this.ObjMisOwner.cifKbhtgCode && this.ObjMisOwner.cifKbhtgName ?
      {
        code: this.ObjMisOwner.cifKbhtgCode,
        name: this.ObjMisOwner.cifKbhtgCode + ' - ' + this.ObjMisOwner.cifKbhtgName
      } : null;
    this.selectedCifPNKH = this.ObjMisOwner.cifPnkhCode && this.ObjMisOwner.cifPnkhName ?
      {
        code: this.ObjMisOwner.cifPnkhCode,
        name: this.ObjMisOwner.cifPnkhCode + ' - ' + this.ObjMisOwner.cifPnkhName
      } : null;
    this.selectedCifLoai = this.ObjMisOwner.cifLoaiCode && this.ObjMisOwner.cifLoaiName ?
      {
        code: this.ObjMisOwner.cifLoaiCode,
        name: this.ObjMisOwner.cifLoaiCode + ' - ' + this.ObjMisOwner.cifLoaiName
      } : null;
    this.selectedLHNNNTVAY = this.ObjMisOwner.lhnnntvayCode && this.ObjMisOwner.lhnnntvayName ?
      {
        code: this.ObjMisOwner.lhnnntvayCode,
        name: this.ObjMisOwner.lhnnntvayCode + ' - ' + this.ObjMisOwner.lhnnntvayName
      } : null;
    this.selectedTdMANKT = this.ObjMisOwner.tdManktCode && this.ObjMisOwner.tdManktName ?
      {
        code: this.ObjMisOwner.tdManktCode,
        name: this.ObjMisOwner.tdManktCode + ' - ' + this.ObjMisOwner.tdManktName
      } : null;
    this.selectedCifNganh = this.ObjMisOwner.cifNganhCode && this.ObjMisOwner.cifNganhName ?
      {
        code: this.ObjMisOwner.cifNganhCode,
        name: this.ObjMisOwner.cifNganhCode + ' - ' + this.ObjMisOwner.cifNganhName
      } : null;
    this.selectedDCGH = this.ObjMisOwner.dcGhCode && this.ObjMisOwner.dcGhName ?
      {
        code: this.ObjMisOwner.dcGhCode,
        name: this.ObjMisOwner.dcGhCode + ' - ' + this.ObjMisOwner.dcGhName
      } : null;
    this.selectedComTSCT = this.ObjMisOwner.comTsctCode && this.ObjMisOwner.comTsctName ?
      {
        code: this.ObjMisOwner.comTsctCode,
        name: this.ObjMisOwner.comTsctCode + ' - ' + this.ObjMisOwner.comTsctName
      } : null;
  }
  close(): void {
    this.closeMis.emit(false);
  }

}
