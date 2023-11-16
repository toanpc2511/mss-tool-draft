import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HTTPMethod } from '../../constants/http-method';
import { HelpsService } from '../../services/helps.service';
import { LpbSelectComponent } from '../lpb-select/lpb-select.component';

@Component({
  selector: 'app-lpb-custom-single-address',
  templateUrl: './lpb-custom-single-address.component.html',
  styleUrls: ['./lpb-custom-single-address.component.scss']
})
export class LpbCustomSingleAddressComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() title = '';  // Có title hiển thị hay không
  @Input() isAddressRequire = true;  // Có bắt buộc nhập khối thông tin này hay không?
  @Input() isCountryRequire = true; // Có bắt buộc nhập khối thông tin này hay không?
  @Input() isProvinceRequire = true;  // Có bắt buộc nhập khối thông tin này hay không?
  @Input() isDistrictRequire = true;  // Có bắt buộc nhập khối thông tin này hay không?
  @Input() isWardRequire = true;  // Có bắt buộc nhập khối thông tin này hay không?
  @Input() objCurrentAddress: any;
  @Output() getDataAddress = new EventEmitter();

  selectedCurrentCountry: any;
  selectedCurrentProvince: any;
  selectedCurrentDistrict: any;
  selectedCurrentWard: any;

  @ViewChild('currentCountry', { static: false }) currentCountry: LpbSelectComponent; // Quốc gia hiện tại
  @ViewChild('currentProvince', { static: false }) currentProvince: LpbSelectComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('currentProvinceForeign', { static: false }) currentProvinceForeign: ElementRef; // Tỉnh - Thành phố hiện tại (quốc tế)
  @ViewChild('currentDistrict', { static: false }) currentDistrict: LpbSelectComponent; // Quận - Huyện hiện tại (nội địa)
  @ViewChild('currentDistrictForeign', { static: false }) currentDistrictForeign: ElementRef; // Quận - Huyện hiện tại (quốc tế)
  @ViewChild('currentWard', { static: false }) currentWard: LpbSelectComponent; // Phường - Xã hiện tại (nội địa)
  @ViewChild('currentWardForeign', { static: false }) currentWardForeign: ElementRef; // Phường - Xã hiện tại (quốc tế)
  @ViewChild('currentAddress', { static: false }) currentAddress: ElementRef; // Địa chỉ hiện tại

  lstCurrentCountry = [];
  lstCurrentProvince = [];
  lstCurrentDistrict = [];
  lstCurrentWard = [];

  errMsgCurrentCountry = '';
  errMsgCurrentProvice = '';
  errMsgCurrentDistrict = '';
  errMsgCurrentWard = '';
  errMsgCurrentAddress = '';
  isCurrentCountryForeign = false;
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
  }
  ngAfterViewInit(): void {
    this.initDataCurrentAddress();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.objCurrentAddress && changes.objCurrentAddress.previousValue) {
      this.initDataCurrentAddress();
    }
  }
  initDataCurrentAddress(): void {
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
        this.selectedCurrentCountry.code !== 'VN' ? this.isCurrentCountryForeign = true : this.isCurrentCountryForeign = false;
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
            if (!this.selectedCurrentDistrict) { return; }
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
    if (this.isCountryRequire) {
      this.errMsgCurrentCountry = (this.selectedCurrentCountry && this.selectedCurrentCountry.name !== '') ? '' : 'Quốc gia không được để trống';
    }
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
    if (this.isProvinceRequire) {
      this.errMsgCurrentProvice = (this.selectedCurrentProvince && this.selectedCurrentProvince.name !== '') ? '' : 'Tỉnh / Thành phố không được để trống';
    }
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
    if (this.isDistrictRequire) {
      this.errMsgCurrentDistrict = (this.selectedCurrentDistrict && this.selectedCurrentDistrict.name !== '') ? '' : 'Quận / Huyện không được để trống';
    }
  }

  currentWardChanged(evt): void {
    this.selectedCurrentWard = evt;
  }
  validateCurrentWard(): void {
    this.errMsgCurrentWard = '';
    if (this.isWardRequire) {
      this.errMsgCurrentWard = (this.selectedCurrentWard && this.selectedCurrentWard.name !== '') ? '' : 'Phường / Xã không được để trống';
    }
  }

  validateCurrentAddress(): void {
    this.errMsgCurrentAddress = '';
    if (this.isAddressRequire && (!this.currentAddress.nativeElement.value || this.currentAddress.nativeElement.value === '')) {
      this.errMsgCurrentAddress = 'Số nhà / Đường phố không được để trống';
    }
  }
  // lấy địa chỉ hiện tại
  getDataCurrentFormAddress(): any {
    this.errMsgCurrentCountry = '';
    this.errMsgCurrentProvice = '';
    this.errMsgCurrentDistrict = '';
    this.errMsgCurrentWard = '';
    this.errMsgCurrentAddress = '';
    this.validateCurrentCountry();
    this.validateCurrentAddress();
    if (this.errMsgCurrentCountry === '' && !this.isCurrentCountryForeign) {
      this.validateCurrentProvince();
      this.validateCurrentDistrict();
      this.validateCurrentWard();
    }
    let result = null;
    if (this.errMsgCurrentCountry === '' && this.errMsgCurrentProvice === '' && this.errMsgCurrentDistrict === '' &&
      this.errMsgCurrentWard === '' && this.errMsgCurrentAddress === '') {
      if (!this.isCurrentCountryForeign) {
        result = this.getDataCurrentAddress();
        return result;
      }
      if (this.isCurrentCountryForeign) {
        result = this.getDataCurrentAddressForeign();
        return result;
      }
    }
  }
  // lấy địa chỉ thường trú
  getDataResidentFormAddress(): any {
    this.errMsgCurrentCountry = '';
    this.errMsgCurrentProvice = '';
    this.errMsgCurrentDistrict = '';
    this.errMsgCurrentWard = '';
    this.errMsgCurrentAddress = '';
    this.validateCurrentCountry();
    this.validateCurrentAddress();
    if (this.errMsgCurrentCountry === '' && !this.isCurrentCountryForeign) {
      this.validateCurrentProvince();
      this.validateCurrentDistrict();
      this.validateCurrentWard();
    }
    let result = null;
    if (this.errMsgCurrentCountry === '' && this.errMsgCurrentProvice === '' && this.errMsgCurrentDistrict === '' &&
      this.errMsgCurrentWard === '' && this.errMsgCurrentAddress === '') {
      if (!this.isCurrentCountryForeign) {
        result = this.getDataResidentAddress();
        return result;
      }
      if (this.isCurrentCountryForeign) {
        result = this.getDataResidentAddressForeign();
        return result;
      }
    }
  }

  testClearData(): void {
    this.getDataCurrentFormAddress();
  }
  getDataCurrentAddress(): any {
    const result = {
      currentCountryName: this.selectedCurrentCountry ? this.selectedCurrentCountry.name : '',
      currentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      currentProvinceName: this.selectedCurrentProvince ? this.selectedCurrentProvince.name : '',
      currentProvinceCode: this.selectedCurrentProvince ? this.selectedCurrentProvince.code : '',
      currentDistrictName: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.name : '',
      currentDistrictCode: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.code : '',
      currentWardName: this.selectedCurrentWard ? this.selectedCurrentWard.name : '',
      currentWardCode: this.selectedCurrentWard ? this.selectedCurrentWard.code : '',
      currentAddress: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
  getDataCurrentAddressForeign(): any {
    const result = {
      currentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      currentCountryName: this.selectedCurrentCountry ? this.selectedCurrentCountry.name : '',
      currentProvinceName: this.currentProvinceForeign.nativeElement.value ? this.currentProvinceForeign.nativeElement.value : '',
      currentDistrictName: this.currentDistrictForeign.nativeElement.value ? this.currentDistrictForeign.nativeElement.value : '',
      currentWardName: this.currentWardForeign.nativeElement.value ? this.currentWardForeign.nativeElement.value : '',
      currentAddress: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
  getDataResidentAddress(): any {
    const result = {
      residentCountryName: this.selectedCurrentCountry ? this.selectedCurrentCountry.name : '',
      residentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      residentProvinceName: this.selectedCurrentProvince ? this.selectedCurrentProvince.name : '',
      residentProvinceCode: this.selectedCurrentProvince ? this.selectedCurrentProvince.code : '',
      residentDistrictName: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.name : '',
      residentDistrictCode: this.selectedCurrentDistrict ? this.selectedCurrentDistrict.code : '',
      residentWardName: this.selectedCurrentWard ? this.selectedCurrentWard.name : '',
      residentWardCode: this.selectedCurrentWard ? this.selectedCurrentWard.code : '',
      residentAddress: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
  getDataResidentAddressForeign(): any {
    const result = {
      residentCountryCode: this.selectedCurrentCountry ? this.selectedCurrentCountry.code : '',
      residentCountryName: this.selectedCurrentCountry ? this.selectedCurrentCountry.name : '',
      residentProvince: this.currentProvinceForeign.nativeElement.value ? this.currentProvinceForeign.nativeElement.value : '',
      residentDistrict: this.currentDistrictForeign.nativeElement.value ? this.currentDistrictForeign.nativeElement.value : '',
      residentWardForeign: this.currentWardForeign.nativeElement.value ? this.currentWardForeign.nativeElement.value : '',
      residentAddress: this.currentAddress.nativeElement.value ? this.currentAddress.nativeElement.value : '',
    };
    return result;
  }
}
