import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HTTPMethod } from '../../constants/http-method';
import { HelpsService } from '../../services/helps.service';
import { LpbSelectComponent } from '../lpb-select/lpb-select.component';

@Component({
  selector: 'app-lpb-address',
  templateUrl: './lpb-address.component.html',
  styleUrls: ['./lpb-address.component.scss']
})
export class LpbAddressComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() objCurrentAddress: any;
  @Input() objResidentAddress: any;
  // @Input() requireCurrentAddress = true;
  @Input() requireResidentAddress = true;
  @Input() objCifCustomerInfoCore: any;
  @Output() getDataAddress = new EventEmitter();

  selectedCurrentCountry: any;
  selectedCurrentProvince: any;
  selectedCurrentDistrict: any;
  selectedCurrentWard: any;

  selectedResidentCountry: any;
  selectedResidentProvince: any;
  selectedResidentDistrict: any;
  selectedResidentWard: any;

  @ViewChild('f') form: any;

  @ViewChild('currentCountry', { static: false }) currentCountry: LpbSelectComponent; // Quốc gia hiện tại
  @ViewChild('currentProvince', { static: false }) currentProvince: LpbSelectComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('currentProvinceForeign', { static: false }) currentProvinceForeign: ElementRef; // Tỉnh - Thành phố hiện tại (quốc tế)
  @ViewChild('currentDistrict', { static: false }) currentDistrict: LpbSelectComponent; // Quận - Huyện hiện tại (nội địa)
  @ViewChild('currentDistrictForeign', { static: false }) currentDistrictForeign: ElementRef; // Quận - Huyện hiện tại (quốc tế)
  @ViewChild('currentWard', { static: false }) currentWard: LpbSelectComponent; // Phường - Xã hiện tại (nội địa)
  @ViewChild('currentWardForeign', { static: false }) currentWardForeign: ElementRef; // Phường - Xã hiện tại (quốc tế)
  @ViewChild('currentAddress', { static: false }) currentAddress: ElementRef; // Địa chỉ hiện tại

  @ViewChild('residentCountry', { static: false }) residentCountry: LpbSelectComponent; // Quốc gia hiện tại
  @ViewChild('residentProvince', { static: false }) residentProvince: LpbSelectComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('residentProvinceForeign', { static: false }) residentProvinceForeign: ElementRef; // Tỉnh - Thành phố hiện tại (quốc tế)
  @ViewChild('residentDistrict', { static: false }) residentDistrict: LpbSelectComponent; // Quận - Huyện hiện tại (nội địa)
  @ViewChild('residentDistrictForeign', { static: false }) residentDistrictForeign: ElementRef; // Quận - Huyện hiện tại (quốc tế)
  @ViewChild('residentWard', { static: false }) residentWard: LpbSelectComponent; // Phường - Xã hiện tại (nội địa)
  @ViewChild('residentWardForeign', { static: false }) residentWardForeign: ElementRef; // Phường - Xã hiện tại (quốc tế)
  @ViewChild('residentAddress', { static: false }) residentAddress: ElementRef; // Địa chỉ hiện tại

  lstCurrentCountry = [];
  lstCurrentProvince = [];
  lstCurrentDistrict = [];
  lstCurrentWard = [];

  errMsgCurrentCountry = '';
  errMsgCurrentProvice = '';
  errMsgCurrentDistrict = '';
  errMsgCurrentWard = '';
  errMsgCurrentAddress = '';

  lstResidentCountry = [];
  lstResidentProvince = [];
  lstResidentDistrict = [];
  lstResidentWard = [];

  errMsgResidentCountry = '';
  errMsgResidentProvice = '';
  errMsgResidentDistrict = '';
  errMsgResidentWard = '';
  errMsgResidentAddress = '';

  isCurrentCountryForeign = false;
  isResidentCountryForeign = false;

  constructor(private helpService: HelpsService) { }

  ngOnInit(): void {
    // this.objCurrentAddress = {
    //   currentCountryCode : 'VN',
    //   currentCountryName : 'Vietnam',
    //   currentCityName : 'TP HA NOI',
    //   currentDistrictName : 'CHUONG MY',
    //   currentWardName : 'DONG SON',
    //   currentStreetNumber : '34324'
    // };
    // this.objResidentAddress = {
    //   residenceCountryCode : 'VN',
    //   residenceCountryName : 'Vietnam',
    //   residenceCityName : '1000',
    //   residenceDistrictName : 'HIEP HOA',
    //   residenceWardName : 'CHAU MINH',
    //   residenceStreetNumber : 'số 5 ngõ 168'
    // };
  }

  ngAfterViewInit(): void {
    this.initDataCurrentAddress();
    this.initDataResidentAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.objCurrentAddress && changes.objCurrentAddress.previousValue) {
      this.initDataCurrentAddress();
    }
    if (changes.objResidentAddress && changes.objCurrentAddress.previousValue) {
      this.initDataResidentAddress();
    }
  }

  initDataCurrentAddress(): void {
    // console.log('vao day');
    // Nếu không tồn tại địa chỉ hiện tại
    if (!this.objCurrentAddress) {
      this.getCountry(resCountry => {
        this.lstCurrentCountry = resCountry.items.filter(item => item.statusCode === 'A');
      });
      this.getProvince(resProvince => {
        this.lstCurrentProvince = resProvince.items.filter(item => item.statusCode === 'A');
      });
    } else {
      this.getCountry(resCountry => {
        this.lstCurrentCountry = resCountry.items.filter(item => item.statusCode === 'A');
        this.selectedCurrentCountry = {
          code: this.objCurrentAddress.currentCountryCode,
          name: this.objCurrentAddress.currentCountryName
        };
        this.checkIsCurrentCountryForeign();
      });
      // tslint:disable-next-line:max-line-length
      this.currentAddress.nativeElement.value = this.objCurrentAddress.currentStreetNumber ? this.objCurrentAddress.currentStreetNumber : '';
      if (this.objCurrentAddress.currentCountryCode === 'VN') {
        // Lấy danh sách Tỉnh / Thành phố
        this.getProvince(resProvince => {
          this.lstCurrentProvince = resProvince.items.filter(item => item.statusCode === 'A');
          // tslint:disable-next-line:prefer-const
          let provinceSelected = this.lstCurrentProvince.find(item => item.name === this.objCurrentAddress.currentCityName);
          // Gán tỉnh / thành phố đã được chọn
          if (provinceSelected) {
            this.selectedCurrentProvince = { code: provinceSelected.code, name: provinceSelected.name };
          }
          if (!this.selectedCurrentProvince) {
            return;
          }
          // Lấy danh sách quận huyện theo thành phố
          this.getDistrictByProvince(this.selectedCurrentProvince.name, resDistrict => {
            this.lstCurrentDistrict = resDistrict.items.filter(item => item.statusCode === 'A');
            // tslint:disable-next-line:prefer-const
            let districtSelected = this.lstCurrentDistrict.find(item => item.name === this.objCurrentAddress.currentDistrictName);
            // Gián quận / huyện đã được chọn
            if (districtSelected) {
              this.selectedCurrentDistrict = { code: districtSelected.code, name: districtSelected.name };
            }

            if (!this.selectedCurrentDistrict) {
              return;
            }
            // Lấy danh sách phường xã
            this.getWardByDistrict(this.selectedCurrentDistrict.name, resWard => {
              this.lstCurrentWard = resWard.items.filter(item => item.statusCode === 'A');
              // tslint:disable-next-line:prefer-const
              let wardSelected = this.lstCurrentWard.find(item => item.name === this.objCurrentAddress.currentWardName);
              if (wardSelected) {
                this.selectedCurrentWard = { code: wardSelected.code, name: wardSelected.name };
              }
            });
          });
        });
      } else {
        this.currentProvinceForeign.nativeElement.value = this.objCurrentAddress.currentCityName ? this.objCurrentAddress.currentCityName : '';
        // tslint:disable-next-line:max-line-length
        this.currentDistrictForeign.nativeElement.value = this.objCurrentAddress.currentDistrictName ? this.objCurrentAddress.currentDistrictName : '';
        this.currentWardForeign.nativeElement.value = this.objCurrentAddress.currentWardName ? this.objCurrentAddress.currentWardName : '';
      }
    }
  }

  initDataResidentAddress(): void {
    // Nếu không tồn tại địa chỉ thường trú
    if (!this.objResidentAddress) {
      this.getCountry(resCountry => {
        this.lstResidentCountry = resCountry.items.filter(item => item.statusCode === 'A');
      });
      this.getProvince(resProvince => {
        this.lstResidentProvince = resProvince.items.filter(item => item.statusCode === 'A');
      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.residentAddress.nativeElement.value = this.objResidentAddress.residenceStreetNumber ? this.objResidentAddress.residenceStreetNumber : '';
      this.getCountry(resCountry => {
        this.lstResidentCountry = resCountry.items.filter(item => item.statusCode === 'A');
        this.selectedResidentCountry = {
          code: this.objResidentAddress.residenceCountryCode,
          name: this.objResidentAddress.residenceCountryName
        };
        this.checkIsResidentCountryForeign();
      });
      if (this.objResidentAddress.residenceCountryCode === 'VN') {
        // Lấy danh sách Tỉnh / Thành phố
        this.getProvince(resProvince => {
          this.lstResidentProvince = resProvince.items.filter(item => item.statusCode === 'A');
          // tslint:disable-next-line:prefer-const
          let provinceSelected = this.lstResidentProvince.find(item => item.name === this.objResidentAddress.residenceCityName);
          // Gán tỉnh / thành phố đã được chọn
          if (provinceSelected) {
            this.selectedResidentProvince = { code: provinceSelected.code, name: provinceSelected.name };
          }
          if (!this.selectedResidentProvince) { return; }
          // Lấy danh sách quận huyện theo thành phố
          this.getDistrictByProvince(this.selectedResidentProvince.name, resDistrict => {
            this.lstResidentDistrict = resDistrict.items.filter(item => item.statusCode === 'A');
            // tslint:disable-next-line:prefer-const
            let districtSelected = this.lstResidentDistrict.find(item => item.name === this.objResidentAddress.residenceDistrictName);
            // Gián quận / huyện đã được chọn
            if (districtSelected) {
              this.selectedResidentDistrict = { code: districtSelected.code, name: districtSelected.name };
            }
            if (!this.selectedResidentDistrict) { return; }
            // Lấy danh sách phường xã
            this.getWardByDistrict(this.selectedResidentDistrict.name, resWard => {
              this.lstResidentWard = resWard.items.filter(item => item.statusCode === 'A');
              // tslint:disable-next-line:prefer-const
              let wardSelected = this.lstResidentWard.find(item => item.name === this.objResidentAddress.residenceWardName);
              if (wardSelected) {
                this.selectedResidentWard = { code: wardSelected.code, name: wardSelected.name };
              }
              if (!this.selectedResidentWard) { return; }
            });
          });
        });
      } else {
        // tslint:disable-next-line:max-line-length
        this.residentProvinceForeign.nativeElement.value = this.objResidentAddress.residenceCityName ? this.objResidentAddress.residenceCityName : '';
        // tslint:disable-next-line:max-line-length
        this.residentDistrictForeign.nativeElement.value = this.objResidentAddress.residenceDistrictName ? this.objResidentAddress.residenceDistrictName : '';
        // tslint:disable-next-line:max-line-length
        this.residentWardForeign.nativeElement.value = this.objResidentAddress.residenceWardName ? this.objResidentAddress.residenceWardName : '';
      }
    }
  }

  getCountry(callback?: any): void {
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/country/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            if (callback) {
              callback(res);
            }
          } else {
            if (callback) {
              callback([]);
            }
          }
        }
      }
    );
  }

  getProvince(callback?): void {
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/city/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.items) {
            if (callback) {
              callback(res);
            }
          } else {
            if (callback) {
              callback([]);
            }
          }
        }
      }
    );
  }

  // tslint:disable-next-line:variable-name
  getDistrictByProvince(province_value, callback?): void {
    const body = {
      cityName: province_value,
      page: 1,
      size: 1000
    };

    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/district/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.items) {
            if (callback) {
              callback(res);
            }
          } else {
            if (callback) {
              callback([]);
            }
          }
        }
      }
    );
  }

  // tslint:disable-next-line:variable-name
  getWardByDistrict(district_value, callback?): void {
    const body = {
      districtName: district_value,
      page: 1,
      size: 1000
    };

    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/ward/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.items) {
            if (callback) {
              callback(res);
            }
          } else {
            if (callback) {
              callback([]);
            }
          }
        }
      }
    );
  }


  checkIsCurrentCountryForeign(): void {
    if (this.selectedCurrentCountry && this.selectedCurrentCountry.code !== 'VN') {
      this.isCurrentCountryForeign = true;
    } else {
      this.isCurrentCountryForeign = false;
    }
  }

  blurSelectDropdown(fieldName: string): void {
    switch (fieldName) {
      case 'CURRENT_COUTRY':
        this.validateCurrentCountry();
        break;
      case 'CURRENT_PROVINCE':
        this.validateCurrentProvince();
        break;
      case 'CURRENT_DISTRICT':
        this.validateCurrentDistrict();
        break;
      case 'CURRENT_WARD':
        this.validateCurrentWard();
        break;
      case 'RESIDENT_COUTRY':
        this.validateResidentCountry();
        break;
      case 'RESIDENT_PROVINCE':
        this.validateResidentProvince();
        break;
      case 'RESIDENT_DISTRICT':
        this.validateResidentDistrict();
        break;
      case 'RESIDENT_WARD':
        this.validateResidentWard();
        break;
      default:
        break;
    }
  }

  currentCountryChanged(evt): void {
    this.selectedCurrentCountry = evt;
    this.checkIsCurrentCountryForeign();
    this.lstCurrentDistrict = [];
    this.lstCurrentWard = [];
    this.selectedCurrentProvince = null;
    this.selectedCurrentDistrict = null;
    this.selectedCurrentWard = null;
    if (!this.isCurrentCountryForeign) {
      this.getProvince(resProvince => {
        this.lstCurrentProvince = resProvince.items.filter(item => item.statusCode === 'A');
      });
    }
    // this.currentAddress.nativeElement.value = '';
  }
  validateCurrentCountry(): void {
    this.errMsgCurrentCountry = '';
    this.errMsgCurrentCountry = (this.selectedCurrentCountry && this.selectedCurrentCountry.name !== '') ? '' : 'Quốc gia không được để trống';
  }

  currentProvinceChanged(evt): void {
    this.selectedCurrentProvince = evt;
    this.lstCurrentDistrict = [];
    this.lstCurrentWard = [];
    this.selectedCurrentDistrict = null;
    this.selectedCurrentWard = null;
    // Lấy danh sách Quận / Huyện
    this.getDistrictByProvince(this.selectedCurrentProvince.name, resDistrict => {
      this.lstCurrentDistrict = resDistrict.items.filter(item => item.statusCode === 'A');
    });
  }
  validateCurrentProvince(): void {
    this.errMsgCurrentProvice = '';
    this.errMsgCurrentProvice = (this.selectedCurrentProvince && this.selectedCurrentProvince.name !== '') ? '' : 'Tỉnh/Thành phố không được để trống';
  }

  currentDistrictChanged(evt): void {
    this.selectedCurrentDistrict = evt;
    this.lstCurrentWard = [];
    this.selectedCurrentWard = null;

    // Lấy danh sách Phường / Xã
    this.getWardByDistrict(this.selectedCurrentDistrict.name, resWard => {
      this.lstCurrentWard = resWard.items.filter(item => item.statusCode === 'A');
    });
  }
  validateCurrentDistrict(): void {
    this.errMsgCurrentDistrict = '';
    this.errMsgCurrentDistrict = (this.selectedCurrentDistrict && this.selectedCurrentDistrict.name !== '') ? '' : 'Quận/Huyện không được để trống';
  }

  currentWardChanged(evt): void {
    this.selectedCurrentWard = evt;
  }
  validateCurrentWard(): void {
    this.errMsgCurrentWard = '';
    this.errMsgCurrentWard = (this.selectedCurrentWard && this.selectedCurrentWard.name !== '') ? '' : 'Phường / Xã không được để trống';
  }

  validateCurrentAddress(): void {
    this.errMsgCurrentAddress = '';
    if (!this.currentAddress.nativeElement.value || this.currentAddress.nativeElement.value === '') {
      this.errMsgCurrentAddress = 'Số nhà / Đường phố không được để trống';
    }
  }

  checkIsResidentCountryForeign(): void {
    if (this.selectedResidentCountry && this.selectedResidentCountry.code !== 'VN') {
      this.isResidentCountryForeign = true;
    } else {
      this.isResidentCountryForeign = false;
    }
  }

  residentCountryChanged(evt): void {
    this.selectedResidentCountry = evt;
    this.checkIsResidentCountryForeign();
    this.lstResidentDistrict = [];
    this.lstResidentWard = [];
    this.selectedResidentProvince = null;
    this.selectedResidentDistrict = null;
    this.selectedResidentWard = null;
    if (!this.isResidentCountryForeign) {
      this.getProvince(resProvince => {
        this.lstResidentProvince = resProvince.items.filter(item => item.statusCode === 'A');
      });
    }
    // this.residentAddress.nativeElement.value = '';
  }
  validateResidentCountry(): void {
    this.errMsgResidentCountry = '';
    if (this.requireResidentAddress) {
      this.errMsgResidentCountry = (this.selectedResidentCountry && this.selectedResidentCountry.name !== '') ? '' : 'Quốc gia không được để trống';
    }
  }

  residentProvinceChanged(evt): void {
    this.selectedResidentProvince = evt;
    this.lstResidentDistrict = [];
    this.lstResidentWard = [];
    this.selectedResidentDistrict = null;
    this.selectedResidentWard = null;

    // Lấy danh sách Quận / Huyện
    this.getDistrictByProvince(this.selectedResidentProvince.name, resDistrict => {
      this.lstResidentDistrict = resDistrict.items.filter(item => item.statusCode === 'A');
    });
  }
  validateResidentProvince(): void {
    this.errMsgResidentProvice = '';
    if (this.requireResidentAddress) {
      this.errMsgResidentProvice = (this.selectedResidentProvince && this.selectedResidentProvince.name !== '') ? '' : 'Tỉnh / Thành phố không được để trống';
    }
  }

  residentDistrictChanged(evt): void {
    this.selectedResidentDistrict = evt;
    this.lstResidentWard = [];
    this.selectedResidentWard = null;

    // Lấy danh sách Phường / Xã
    this.getWardByDistrict(this.selectedResidentDistrict.name, resWard => {
      this.lstResidentWard = resWard.items.filter(item => item.statusCode === 'A');
    });
  }
  validateResidentDistrict(): void {
    this.errMsgResidentDistrict = '';
    if (this.requireResidentAddress) {
      this.errMsgResidentDistrict = (this.selectedResidentDistrict && this.selectedResidentDistrict.name !== '') ? '' : 'Quận/Huyện không được để trống';
    }
  }

  residentWardChanged(evt): void {
    this.selectedResidentWard = evt;
  }
  validateResidentWard(): void {
    this.errMsgResidentWard = '';
    if (this.requireResidentAddress) {
      this.errMsgResidentWard = (this.selectedResidentWard && this.selectedResidentWard.name !== '') ? '' : 'Phường / Xã không được để trống';
    }
  }

  validateResidentAddress(): void {
    this.errMsgResidentAddress = '';
    if (this.requireResidentAddress && (!this.residentAddress.nativeElement.value || this.residentAddress.nativeElement.value === '')) {
      this.errMsgResidentAddress = 'Số nhà / Đường phố không được để trống';
    }
  }

  // tslint:disable-next-line:variable-name
  getCopyList(lst_input: any[]): any[] {
    // tslint:disable-next-line:prefer-const
    let ret = [];
    lst_input.forEach(val => ret.push(Object.assign({}, val)));
    return ret;
  }

  selectDuplicateAddress(): void {
    this.lstResidentCountry = this.getCopyList(this.lstCurrentCountry);
    this.lstResidentProvince = this.getCopyList(this.lstCurrentProvince);
    this.lstResidentDistrict = this.getCopyList(this.lstCurrentDistrict);
    this.lstResidentWard = this.getCopyList(this.lstCurrentWard);

    this.selectedResidentCountry = this.selectedCurrentCountry;
    this.selectedResidentProvince = this.selectedCurrentProvince;
    this.selectedResidentDistrict = this.selectedCurrentDistrict;
    this.selectedResidentWard = this.selectedCurrentWard;

    this.residentProvinceForeign.nativeElement.value = this.currentProvinceForeign.nativeElement.value;
    this.residentDistrictForeign.nativeElement.value = this.currentDistrictForeign.nativeElement.value;
    this.residentWardForeign.nativeElement.value = this.currentWardForeign.nativeElement.value;
    this.residentAddress.nativeElement.value = this.currentAddress.nativeElement.value;
    this.checkIsResidentCountryForeign();
    this.validateResidentCountry();
    this.validateResidentProvince();
    this.validateResidentDistrict();
    this.validateResidentWard();
    this.validateResidentAddress();
  }

  getDataFormAddress(): any {
    this.errMsgCurrentCountry = '';
    this.errMsgCurrentProvice = '';
    this.errMsgCurrentDistrict = '';
    this.errMsgCurrentWard = '';
    this.errMsgCurrentAddress = '';
    this.errMsgResidentCountry = '';
    this.errMsgResidentProvice = '';
    this.errMsgResidentDistrict = '';
    this.errMsgResidentWard = '';
    this.errMsgResidentAddress = '';
    this.validateCurrentCountry();
    this.validateCurrentAddress();
    if (this.errMsgCurrentCountry === '' && !this.isCurrentCountryForeign) {
      this.validateCurrentProvince();
      this.validateCurrentDistrict();
      this.validateCurrentWard();
    }

    if (this.requireResidentAddress) {
      this.validateResidentCountry();
      this.validateResidentAddress();
      if (this.errMsgResidentCountry === '' && !this.isResidentCountryForeign) {
        this.validateResidentProvince();
        this.validateResidentDistrict();
        this.validateResidentWard();
      }
    }
    let result = null;
    if (this.errMsgCurrentCountry === '' && this.errMsgCurrentProvice === '' && this.errMsgCurrentDistrict === '' &&
      this.errMsgCurrentWard === '' && this.errMsgCurrentAddress === '' &&
      this.errMsgResidentCountry === '' && this.errMsgResidentProvice === '' &&
      this.errMsgResidentDistrict === '' && this.errMsgResidentWard === '' && this.errMsgResidentAddress === '') {
      // địa chỉ hiện tại và địa chỉ thường trú ở Việt Nam
      if (this.selectedCurrentCountry.code === 'VN' && this.selectedResidentCountry.code === 'VN') {
        result = Object.assign(this.getdataAddCurrentress(), this.getDataResidentAddress());
        return result;
      }
      // địa chỉ hiện tại khác Việt Nam và địa chỉ thường trú khác Việt Nam
      if (this.selectedCurrentCountry.code !== 'VN' && this.selectedResidentCountry.code !== 'VN') {
        result = Object.assign(this.getDataResidentAddressForeign(), this.getDataCurrentAddressForeign());
        return result;
      }
      // địa chỉ hiện tại ở Việt Nam và địa chỉ thường trú khác Việt Nam
      if (this.selectedCurrentCountry.code === 'VN' && this.selectedResidentCountry.code !== 'VN') {
        result = Object.assign(this.getdataAddCurrentress(), this.getDataResidentAddressForeign());
        return result;
      }
      // địa chỉ hiện tại khác Việt Nam và địa chỉ thường trú ở Việt Nam
      if (this.selectedCurrentCountry.code !== 'VN' && this.selectedResidentCountry.code === 'VN') {
        result = Object.assign(this.getDataCurrentAddressForeign(), this.getDataResidentAddress());
        return result;
      }
      this.getDataAddress.emit(result);
    }
  }
  testClearData(): void {
    this.getDataFormAddress();
  }
  // trả về địa chỉ hiện tại có quốc tịch là Việt Nam
  getdataAddCurrentress(): any {
    const result = {
      currentCountryName: this.selectedCurrentCountry ? this.selectedCurrentCountry.name : '',
      currentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      currentCityName: this.selectedCurrentProvince ? this.selectedCurrentProvince.name : '',
      currentCityCode: this.selectedCurrentProvince ? this.selectedCurrentProvince.code : '',
      currentDistrictName: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.name : '',
      currentDistrictCode: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.code : '',
      currentWardName: this.selectedCurrentWard ? this.selectedCurrentWard.name : '',
      currentWardCode: this.selectedCurrentWard ? this.selectedCurrentWard.code : '',
      currentStreetNumber: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
  // trả về địa chỉ thường trú có quốc tịch là Việt Nam
  getDataResidentAddress(): any {
    const result = {
      residenceCountryName: this.selectedResidentCountry ? this.selectedResidentCountry.name : '',
      residenceCityName: this.selectedResidentProvince ? this.selectedResidentProvince.name : '',
      residenceDistrictName: this.selectedResidentDistrict ? this.selectedResidentDistrict.name : '',
      residenceWardName: this.selectedResidentWard ? this.selectedResidentWard.name : '',
      residenceCountryCode: this.selectedResidentCountry ? this.selectedResidentCountry.code : '',
      residenceCityCode: this.selectedResidentProvince ? this.selectedResidentProvince.code : '',
      residenceDistrictCode: this.selectedResidentDistrict ? this.selectedResidentDistrict.code : '',
      residenceWardCode: this.selectedResidentWard ? this.selectedResidentWard.code : '',
      residenceStreetNumber: this.residentAddress.nativeElement.value ? this.residentAddress.nativeElement.value : '',
    };
    return result;
  }
  // trả về dịa chỉ thường trú quốc tịch khác Việt Nam
  getDataResidentAddressForeign(): any {
    const result = {
      residenceCountryCode: this.selectedResidentCountry ? this.selectedResidentCountry.code : '',
      residenceCityName: this.residentProvinceForeign.nativeElement.value ? this.residentProvinceForeign.nativeElement.value : '',
      residenceDistrictName: this.residentDistrictForeign.nativeElement.value ? this.residentDistrictForeign.nativeElement.value : '',
      residenceWardName: this.residentWardForeign.nativeElement.value ? this.residentWardForeign.nativeElement.value : '',
      residenceStreetNumber: this.residentAddress.nativeElement.value ? this.residentAddress.nativeElement.value : '',
    };
    return result;
  }
  // trả về dịa chỉ hiện tại quốc tịch khác Việt Nam
  getDataCurrentAddressForeign(): any {
    const result = {
      currentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      currentCityName: this.currentProvinceForeign.nativeElement.value ? this.currentProvinceForeign.nativeElement.value : '',
      currentDistrictName: this.currentDistrictForeign.nativeElement.value ? this.currentDistrictForeign.nativeElement.value : '',
      currentWardName: this.currentWardForeign.nativeElement.value ? this.currentWardForeign.nativeElement.value : '',
      currentStreetNumber: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
}
