import { Injectable } from '@angular/core';
import { HTTPMethod } from '../constants/http-method';
import { HelpsService } from './helps.service';

@Injectable({
  providedIn: 'root'
})
export class CifMisService {
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
  constructor(private helpService: HelpsService) { }

  getCIFLOAI(callBack): void {
    if (this.lstCIFLOAI && this.lstCIFLOAI.length > 0) {
      callBack(this.lstCIFLOAI);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifLoai/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFLOAI = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFLOAI.push(el);
                }
              });
            }
            callBack(this.lstCIFLOAI);
          }
        }
      }
    );
  }

  getCIF_LHKT(callBack): void {
    if (this.lstCIFLHKT && this.lstCIFLHKT.length > 0) {
      callBack(this.lstCIFLHKT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifLhkt/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFLHKT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFLHKT.push(el);
                }
              });
            }
            callBack(this.lstCIFLHKT);
          }
        }
      }
    );
  }

  getCIF_TPKT(callBack): void {
    if (this.lstCIFTPKT && this.lstCIFTPKT.length > 0) {
      callBack(this.lstCIFTPKT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifTpkt/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFTPKT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFTPKT.push(el);
                }
              });
            }
            callBack(this.lstCIFTPKT);
          }
        }
      }
    );
  }

  getCIF_KBHTG(callBack): void {
    if (this.lstCIFKBHTG && this.lstCIFKBHTG.length > 0) {
      callBack(this.lstCIFKBHTG);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifKbhtg/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFKBHTG = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFKBHTG.push(el);
                }
              });
            }
            callBack(this.lstCIFKBHTG);
          }
        }
      }
    );
  }

  getLHNNNTVAY(callBack): void {
    if (this.lstLHNNNTVAY && this.lstLHNNNTVAY.length > 0) {
      callBack(this.lstLHNNNTVAY);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misLhnnntvay/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstLHNNNTVAY = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstLHNNNTVAY.push(el);
                }
              });
            }
            callBack(this.lstLHNNNTVAY);
          }
        }
      }
    );
  }

  getTD_MANKT(callBack): void {
    if (this.lstTDMANKT && this.lstTDMANKT.length > 0) {
      callBack(this.lstTDMANKT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misTdMankt/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstTDMANKT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstTDMANKT.push(el);
                }
              });
            }
            callBack(this.lstTDMANKT);
          }
        }
      }
    );
  }
  getCIF_NGANH(callBack): void {
    if (this.lstCIFNGANH && this.lstCIFNGANH.length > 0) {
      callBack(this.lstCIFNGANH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifNganh/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFNGANH = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFNGANH.push(el);
                }
              });
            }
            callBack(this.lstCIFNGANH);
          }
        }
      }
    );
  }

  getCIF_PNKH(callBack): void {
    if (this.lstCIFPNKH && this.lstCIFPNKH.length > 0) {
      callBack(this.lstCIFPNKH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifPnkh/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFPNKH = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFPNKH.push(el);
                }
              });
            }
            callBack(this.lstCIFPNKH);
          }
        }
      }
    );
  }

  getCOM_TSCT(callBack): void {
    if (this.lstCOMTSCT && this.lstCOMTSCT.length > 0) {
      callBack(this.lstCOMTSCT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misComTsct/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCOMTSCT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCOMTSCT.push(el);
                }
              });
            }
            callBack(this.lstCOMTSCT);
          }
        }
      }
    );
  }

  getDC_GH(callBack): void {
    if (this.lstDCGH && this.lstDCGH.length > 0) {
      callBack(this.lstDCGH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misDcGh/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstDCGH = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstDCGH.push(el);
                }
              });
            }
            callBack(this.lstDCGH);
          }
        }
      }
    );
  }

  getCIF_MANKT(callBack): void {
    if (this.lstCIFMANKT && this.lstCIFMANKT.length > 0) {
      callBack(this.lstCIFMANKT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifMankt/listAll',
        data: body,
        progress: false,
        success: (res) => {
          this.lstCIFMANKT = [];
          if (res) {
            this.lstCIFMANKT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFMANKT.push(el);
                }
              });
            }
            callBack(this.lstCIFMANKT);
          }
        }
      }
    );
  }

  getCIF_KH78(callBack): void {
    if (this.lstCIFKH78 && this.lstCIFKH78.length > 0) {
      callBack(this.lstCIFKH78);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/misCifKh78/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFKH78 = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFKH78.push(el);
                }
              });
            }
            callBack(this.lstCIFKH78);
          }
        }
      }
    );
  }
}
