import { Injectable } from '@angular/core';
import { HTTPMethod } from '../constants/http-method';
import { HelpsService } from './helps.service';

@Injectable({
  providedIn: 'root'
})
export class CifUdfService {

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
  constructor(private helpService: HelpsService) { }

  getlstCIFDINHDANH(callBack): void {
    if (this.lstCIFDINHDANH && this.lstCIFDINHDANH.length > 0) {
      callBack(this.lstCIFDINHDANH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfCifDinhdanh/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCIFDINHDANH = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCIFDINHDANH.push(el);
                }
              });
            }
            callBack(this.lstCIFDINHDANH);
          }
        }
      }
    );
  }
  getlstMACBNVLPB(callBack): void {
    if (this.lstMACBNVLPB && this.lstMACBNVLPB.length > 0) {
      callBack(this.lstMACBNVLPB);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfMaCbnvLpb/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstMACBNVLPB = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstMACBNVLPB.push(el);
                }
              });
            }
            callBack(this.lstMACBNVLPB);
          }
        }
      }
    );
  }
  getlstKHUT(callBack): void {
    if (this.lstKHUT && this.lstKHUT.length > 0) {
      callBack(this.lstKHUT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfKhut/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstKHUT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstKHUT.push(el);
                }
              });
            }
            callBack(this.lstKHUT);
          }
        }
      }
    );
  }
  getlstCIFPNKH(callBack): void {
    if (this.lstCIFPNKH && this.lstCIFPNKH.length > 0) {
      callBack(this.lstCIFPNKH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfCifPnkh/listAll',
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
  getlstKHACHHANG(callBack): void {
    if (this.lstKHACHHANG && this.lstKHACHHANG.length > 0) {
      callBack(this.lstKHACHHANG);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfKhachHang/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstKHACHHANG = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstKHACHHANG.push(el);
                }
              });
            }
            callBack(this.lstKHACHHANG);
          }
        }
      }
    );
  }
  getlstTHUONGTAT(callBack): void {
    if (this.lstTHUONGTAT && this.lstTHUONGTAT.length > 0) {
      callBack(this.lstTHUONGTAT);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfThuongTat/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstTHUONGTAT = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstTHUONGTAT.push(el);
                }
              });
            }
            callBack(this.lstTHUONGTAT);
          }
        }
      }
    );
  }
  getlstKHOIDONVIGIOITHIEU(callBack): void {
    if (this.lstKHOIDONVIGIOITHIEU && this.lstKHOIDONVIGIOITHIEU.length > 0) {
      callBack(this.lstKHOIDONVIGIOITHIEU);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfKhoiDonViGioiThieu/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstKHOIDONVIGIOITHIEU = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstKHOIDONVIGIOITHIEU.push(el);
                }
              });
            }
            callBack(this.lstKHOIDONVIGIOITHIEU);
          }
        }
      }
    );
  }
  getlstLOAICHUONGTRINH(callBack): void {
    if (this.lstLOAICHUONGTRINH && this.lstLOAICHUONGTRINH.length > 0) {
      callBack(this.lstLOAICHUONGTRINH);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfLoaiChuongTrinh/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstLOAICHUONGTRINH = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstLOAICHUONGTRINH.push(el);
                }
              });
            }
            callBack(this.lstLOAICHUONGTRINH);
          }
        }
      }
    );
  }
  getlstTRACUUTTSTK(callBack): void {
    if (this.lstTRACUUTTSTK && this.lstTRACUUTTSTK.length > 0) {
      callBack(this.lstTRACUUTTSTK);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfTracuuTtstkwebViviet/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstTRACUUTTSTK = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstTRACUUTTSTK.push(el);
                }
              });
            }
            callBack(this.lstTRACUUTTSTK);
          }
        }
      }
    );
  }
  getlstDBKHVAY(callBack): void {
    if (this.lstDBKHVAY && this.lstDBKHVAY.length > 0) {
      callBack(this.lstDBKHVAY);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfDbKhVay/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstDBKHVAY = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstDBKHVAY.push(el);
                }
              });
            }
            callBack(this.lstDBKHVAY);
          }
        }
      }
    );
  }
  getlstMAHUYENTHIXA(callBack): void {
    if (this.lstMAHUYENTHIXA && this.lstMAHUYENTHIXA.length > 0) {
      callBack(this.lstMAHUYENTHIXA);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfMaHuyenThiXa/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstMAHUYENTHIXA = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstMAHUYENTHIXA.push(el);
                }
              });
            }
            callBack(this.lstMAHUYENTHIXA);
          }
        }
      }
    );
  }
  getlstDIABANNONGTHON(callBack): void {
    if (this.lstDIABANNONGTHON && this.lstDIABANNONGTHON.length > 0) {
      callBack(this.lstDIABANNONGTHON);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfDiaBanNongThon/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstDIABANNONGTHON = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstDIABANNONGTHON.push(el);
                }
              });
            }
            callBack(this.lstDIABANNONGTHON);
          }
        }
      }
    );
  }
  getlstVITRITOLKETVAYVON(callBack): void {
    if (this.lstVITRITOLKETVAYVON && this.lstVITRITOLKETVAYVON.length > 0) {
      callBack(this.lstVITRITOLKETVAYVON);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfViTriToLketVayvon/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstVITRITOLKETVAYVON = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstVITRITOLKETVAYVON.push(el);
                }
              });
            }
            callBack(this.lstVITRITOLKETVAYVON);
          }
        }
      }
    );
  }
  getlstLVUDCNCAOCIF(callBack): void {
    if (this.lstLVUDCNCAOCIF && this.lstLVUDCNCAOCIF.length > 0) {
      callBack(this.lstLVUDCNCAOCIF);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfLvUdCnCaoCif/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstLVUDCNCAOCIF = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstLVUDCNCAOCIF.push(el);
                }
              });
            }
            callBack(this.lstLVUDCNCAOCIF);
          }
        }
      }
    );
  }
  getlstCNUTPT1483CIF(callBack): void {
    if (this.lstCNUTPT1483CIF && this.lstCNUTPT1483CIF.length > 0) {
      callBack(this.lstCNUTPT1483CIF);
      return;
    }
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/udfCnUtpt1483Cif/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCNUTPT1483CIF = [];
            if (res && res.items.length > 0) {
              res.items.forEach(el => {
                if (el.statusCode === 'A') {
                  el.name = el.code + ' - ' + el.name;
                  this.lstCNUTPT1483CIF.push(el);
                }
              });
            }
            callBack(this.lstCNUTPT1483CIF);
          }
        }
      }
    );
  }
}
