import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-account-owner-search',
  templateUrl: './account-owner-search.component.html',
  styleUrls: ['./account-owner-search.component.scss']
})
export class AccountOwnerSearchComponent implements OnInit {

  errMsgSearchCustomer = '';
  customers = []; // danh sách khách hàng
  msgEmpty = '';
  isListCustomer = false;
  objTypeCustomer: { cif?: any; uidValue?: any; phone?: any; uidName?: any; };
  objCustomer = {};
  typeCustomer = ''; // loại tìm kiếm khách hàng
  codeCustomer = ''; // mã loại tìm kiếm khách hàng
  misObject = {}; // mis block fill xuống từ tìm kiếm
  udfObject = {}; // Udf block fill xuống từ tìm kiếm
  typeParamSearch = {  // select loại tìm kiếm customer
    cif: 'CIF', // mã cif
    cmnd: 'CHUNG MINH NHAN DAN', // chứng minh nhân dân
    cccd: 'CAN CUOC CONG DAN', // căn cước công dân
    hc: 'HO CHIEU', // hộ chiếu
    gks: 'GIAY KHAI SINH' // giấy khai sinh
  };
  signatureOwner: any;

  @Output() listCustomer = new EventEmitter();
  @Output() listSignature = new EventEmitter();

  constructor(
    private helpService: HelpsService,
    private ckr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  /**
   * lựa chọn khách hàng khi tìm kiếm
   */
  selectCustomer(itemCif: any): void {
    const objCustomerInfor: any = {};
    objCustomerInfor.cif = itemCif;
    this.getDetailCustomeInfor(objCustomerInfor);
  }
  /**
   * lấy chi tiết khách hàng
   */
  getDetailCustomeInfor(objCustomer: any): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerESB/getCustomerInfo',
        data: objCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            // hàm xử lý nạp dữ liệu vào input
            this.isListCustomer = false;
            this.objCustomer = res.customer.person;
            this.misObject = res.customer.mis;
            this.udfObject = res.customer.udf;
            this.signatureOwner = res.signatures;
            // console.log(this.signatureOwner);
            const body = {
              objCustomer: this.objCustomer,
              udfObject: this.udfObject,
              misObject: this.misObject,
              customerCode: res.customer.customerCode,
              signatures: this.signatureOwner
            };
            // const body2 = {
            //   signatures: this.signatureOwner
            // };
            this.listCustomer.emit(body);
            // this.listSignature.emit(body2);
          }
        }
      }
    );
  }
  /**
   * tìm kiếm thông tin khác hàng
   */
  searchCustomer(): void {
    this.customers = [];
    this.msgEmpty = '';
    if (this.validSearchCustomer(this.codeCustomer)) {
      this.isListCustomer = true;
      this.typeCustomerChange(this.typeCustomer);
      this.getListCustomer();
    } else {
      this.isListCustomer = false;
    }
  }
  /**
   * lấy danh sách khách hàng
   */
  getListCustomer(callBack?: any): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: this.objTypeCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.customers = res.items;
            if (this.customers && this.customers.length === 0) {
              this.msgEmpty = 'Không có dữ liệu';
            } else {
              // tslint:disable-next-line:max-line-length
              if (this.typeCustomer !== this.typeParamSearch.cif && this.customers[0].UID_NAME !== this.typeCustomer) {
                this.customers = [];
                this.msgEmpty = 'Không có dữ liệu';
              }
            }
          }
        }
      }
    );
  }
  /**
   * thay đổi tham số đầu vào tim kiếm
   */
  typeCustomerChange(evt): void {
    this.objTypeCustomer = {};
    this.objTypeCustomer.cif = '';
    this.objTypeCustomer.uidValue = '';
    this.objTypeCustomer.phone = '';
    this.objTypeCustomer.uidName = '';
    if (evt === this.typeParamSearch.cif) {
      this.objTypeCustomer.cif = this.codeCustomer;
      this.objTypeCustomer.uidName = this.typeParamSearch.cif;
    }
    // tslint:disable-next-line:max-line-length
    if (evt === this.typeParamSearch.cmnd || evt === this.typeParamSearch.hc || evt === this.typeParamSearch.gks || evt === this.typeParamSearch.cccd) {
      this.objTypeCustomer.uidValue = this.codeCustomer;
    }
  }
  /**
   * bắt lỗi giá trị nhập
   */
  validSearchCustomer(event: string): boolean {
    if (event === '') {
      this.errMsgSearchCustomer = 'Giá trị tìm kiếm không được để trống';
      return false;
    } else {
      this.errMsgSearchCustomer = '';
    }
    return true;
  }

  customerChange(): void {
    this.validSearchCustomer(this.codeCustomer);
  }
  /**
   * đóng popup tìm kiếm
   */
  close(): void {
    this.isListCustomer = false;
  }
  /**
   * đóng popup tìm kiếm
   */
  addNewOwner(): void {
    this.isListCustomer = false;
    // reset atribute
  }
}
