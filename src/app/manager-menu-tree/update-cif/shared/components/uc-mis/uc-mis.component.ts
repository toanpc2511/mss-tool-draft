import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { objCifDetail } from 'src/app/shared/constants/cif/cifDetail';
import { CifMisService } from 'src/app/shared/services/cif-mis.service';

@Component({
  selector: 'app-uc-mis',
  templateUrl: './uc-mis.component.html',
  styleUrls: ['./uc-mis.component.scss']
})
export class UcMisComponent implements OnInit, AfterViewInit {
  @Input() show = false;
  @Output() closeMis = new EventEmitter();
  @Output() hideModal = new EventEmitter();
  @Input() objMisCif: any;
  @Output() objectMisCif = new EventEmitter();
  @Input() objCustomerMisCore: any;

  // các trường thông tin MIS
  id;
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

  errMsgCIFKH78 = '';
  errMsgCIFTPKT = '';

  constructor(
    private cifMisService: CifMisService
  ) { }
  ngAfterViewInit(): void {

  }

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
    this.fillDataMisToForm();
  }

  validateCIF_KH78(): void {
    this.errMsgCIFKH78 = '';
    if (this.selectedCifKH78 !== '' && this.selectedCifKH78 === '') {
      this.errMsgCIFKH78 = 'CIF_KH78 không được để trống';
      return;
    }
  }

  validateCIF_TPKT(): void {
    this.errMsgCIFTPKT = '';
    if (this.selectedCifTPKT !== '' && this.selectedCifTPKT === '') {
      this.errMsgCIFTPKT = 'CIF_TPKT không được để trống';
      return;
    }
  }

  onChangecifLhktCode(evt): void { this.selectedCifLHKT = evt; }
  onChangeCifKh78Code(evt): void { this.selectedCifKH78 = evt; }
  onChangeCifManktCode(evt): void { this.selectedCifMankt = evt; }
  onChangeCifTpktCode(evt): void { this.selectedCifTPKT = evt; }
  onChangeCifKbhtgCode(evt): void { this.selectedCifKBHTG = evt; }
  onChangeCifPnkhCode(evt): void { this.selectedCifPNKH = evt; }
  onChangeCifLoaiCode(evt): void { this.selectedCifLoai = evt; }
  onChangeChnnntvayCode(evt): void { this.selectedLHNNNTVAY = evt; }
  onChangeCdManktCode(evt): void { this.selectedTdMANKT = evt; }
  onChangeCifNganhCode(evt): void { this.selectedCifNganh = evt; }
  onChangeComTsctCode(evt): void { this.selectedComTSCT = evt; }
  onChangeCcGhCode(evt): void { this.selectedDCGH = evt; }

  getDataMIS(): any {
    this.validateCIF_KH78();
    this.validateCIF_TPKT();
    let result = null;
    if (this.errMsgCIFKH78 !== '' || this.errMsgCIFTPKT !== '') {
      return;
    }
    result = {
      id: this.objMisCif.id,
      cifLhktCode: this.selectedCifLHKT ? this.selectedCifLHKT.name.split(' - ')[0] : null,
      cifLhktName: this.selectedCifLHKT ? this.selectedCifLHKT.name.split(' - ')[1] : null,
      cifKh78Code: this.selectedCifKH78 ? this.selectedCifKH78.name.split(' - ')[0] : null,
      cifKh78Name: this.selectedCifKH78 ? this.selectedCifKH78.name.split(' - ')[1] : null,
      cifManktCode: this.selectedCifMankt ? this.selectedCifMankt.name.split(' - ')[0] : null,
      cifManktName: this.selectedCifMankt ? this.selectedCifMankt.name.split(' - ')[1] : null,
      cifTpktCode: this.selectedCifTPKT ? this.selectedCifTPKT.name.split(' - ')[0] : null,
      cifTpktName: this.selectedCifTPKT ? this.selectedCifTPKT.name.split(' - ')[1] : null,
      cifKbhtgCode: this.selectedCifKBHTG ? this.selectedCifKBHTG.name.split(' - ')[0] : null,
      cifKbhtgName: this.selectedCifKBHTG ? this.selectedCifKBHTG.name.split(' - ')[1] : null,
      cifPnkhCode: '00',
      cifPnkhName: this.selectedCifPNKH ? this.selectedCifPNKH.name.split(' - ')[1] : null,
      cifLoaiCode: this.selectedCifLoai ? this.selectedCifLoai.name.split(' - ')[0] : null,
      cifLoaiName: this.selectedCifLoai ? this.selectedCifLoai.name.split(' - ')[1] : null,
      lhnnntvayCode: this.selectedLHNNNTVAY ? this.selectedLHNNNTVAY.name.split(' - ')[0] : null,
      lhnnntvayName: this.selectedLHNNNTVAY ? this.selectedLHNNNTVAY.name.split(' - ')[1] : null,
      tdManktCode: this.selectedTdMANKT ? this.selectedTdMANKT.name.split(' - ')[0] : null,
      tdManktName: this.selectedTdMANKT ? this.selectedTdMANKT.name.split(' - ')[1] : null,
      cifNganhCode: this.selectedCifNganh ? this.selectedCifNganh.name.split(' - ')[0] : null,
      cifNganhName: this.selectedCifNganh ? this.selectedCifNganh.name.split(' - ')[1] : null,
      comTsctCode: this.selectedComTSCT ? this.selectedComTSCT.name.split(' - ')[0] : null,
      comTsctName: this.selectedComTSCT ? this.selectedComTSCT.name.split(' - ')[1] : null,
      dcGhCode: this.selectedDCGH ? this.selectedDCGH.name.split(' - ')[0] : null,
      dcGhName: this.selectedDCGH ? this.selectedDCGH.name.split(' - ')[1] : null,
    };

    // console.log(result);
    return this.objectMisCif.emit(result);

  }

  fillDataMisToForm(): void {
    // console.log(this.objMisCif);
    this.id = this.objMisCif.id;
    this.selectedCifLHKT = this.objMisCif.cifLhktCode ?
      {
        code: this.objMisCif.cifLhktCode,
        name: this.objMisCif.cifLhktCode + ' - ' + this.objMisCif.cifLhktName
      } : null;
    this.selectedCifKH78 = this.objMisCif.cifKh78Code ?
      {
        code: this.objMisCif.cifKh78Code,
        name: this.objMisCif.cifKh78Code + ' - ' + this.objMisCif.cifKh78Name
      } : null;
    this.selectedCifMankt = this.objMisCif.cifManktCode ?
      {
        code: this.objMisCif.cifManktCode,
        name: this.objMisCif.cifManktCode + ' - ' + this.objMisCif.cifManktName
      } : null;
    this.selectedCifTPKT = this.objMisCif.cifTpktCode ?
      {
        code: this.objMisCif.cifTpktCode,
        name: this.objMisCif.cifTpktCode + ' - ' + this.objMisCif.cifTpktName
      } : null;
    this.selectedCifKBHTG = this.objMisCif.cifKbhtgCode ?
      {
        code: this.objMisCif.cifKbhtgCode,
        name: this.objMisCif.cifKbhtgCode + ' - ' + this.objMisCif.cifKbhtgName
      } : null;
    this.selectedCifPNKH = this.objMisCif.cifPnkhCode ?
      {
        code: this.objMisCif.cifPnkhCode,
        name: this.objMisCif.cifPnkhCode + ' - ' + this.objMisCif.cifPnkhName
      } : null;
    this.selectedCifLoai = this.objMisCif.cifLoaiCode ?
      {
        code: this.objMisCif.cifLoaiCode,
        name: this.objMisCif.cifLoaiCode + ' - ' + this.objMisCif.cifLoaiName
      } : null;
    this.selectedLHNNNTVAY = this.objMisCif.lhnnntvayCode ?
      {
        code: this.objMisCif.lhnnntvayCode,
        name: this.objMisCif.lhnnntvayCode + ' - ' + this.objMisCif.lhnnntvayName
      } : null;
    this.selectedTdMANKT = this.objMisCif.tdManktCode ?
      {
        code: this.objMisCif.tdManktCode,
        name: this.objMisCif.tdManktCode + ' - ' + this.objMisCif.tdManktName
      } : null;
    this.selectedCifNganh = this.objMisCif.cifNganhCode ?
      {
        code: this.objMisCif.cifNganhCode,
        name: this.objMisCif.cifNganhCode + ' - ' + this.objMisCif.cifNganhName
      } : null;
    this.selectedDCGH = this.objMisCif.dcGhCode ?
      {
        code: this.objMisCif.dcGhCode,
        name: this.objMisCif.dcGhCode + ' - ' + this.objMisCif.dcGhName
      } : null;
    this.selectedComTSCT = this.objMisCif.comTsctCode ?
      {
        code: this.objMisCif.comTsctCode,
        name: this.objMisCif.comTsctCode + ' - ' + this.objMisCif.comTsctName
      } : null;
  }
  close(): void {
    this.closeMis.emit(false);
    // console.log('davafo');
  }
}
