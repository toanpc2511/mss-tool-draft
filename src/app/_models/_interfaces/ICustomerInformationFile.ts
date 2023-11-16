import * as moment from 'moment';

export interface ICustomerInformationFile {
  /**
   * Mã chi nhánh
   * VN00110012
   */
  branchCode: string;
  /**
   * Thông tin chung của KH
   */
  customerBase: CustomerBase;
  /**
   * Mã nhân viên
   * E001
   */
  employeeId: string;
}
export class CustomerBase {
  /**
   * Mã chi nhánh quản lý
   * VN00110012
   */
  branchCode: string;
  /**
   * Mã phân loại KH
   * INDIV
   */
  customerCategoryCode?: string;
  /**
   * Mã loại KH
   * INDIV
   */
  customerTypeCode?: string;
  /**
   * Mã nhân viên giới thiệu
   * e18469bb69dc43b591d67884ebf58648
   */
  employeeId: string;
  /**
   * Thông tin cá nhân
   */
  person: Person;
}
export class Person {
  /**
   * Ngày sinh
   * 2021-01-01
   */
  birthDate: string;
  /**
   * Nhu cầu sử dụng thấu chi
   */
  creditStatus?: boolean;
  /**
   * Tên Tỉnh TP hiện tại
   */
  currentCityName?: string;
  /**
   * Mã quốc gia hiện tại
   */
  currentCountryCode: string;
  /**
   * Tên Quận Huyện hiện tại
   */
  currentDistrictName: string;
  /**
   * Số nhà đường phố hiện tại
   */
  currentStreetNumber: string;
  /**
   * Tên Phường Xã hiện tại
   */
  currentWardName: string;
  /**
   * Địa chỉ thư điện tử
   */
  email?: string;
  /**
   * Họ và tên
   */
  fullName: string;
  /**
   * Mã giới tính
   */
  genderCode: string;
  /**
   * Số điện thoại di động
   */
  mobilePhone: string;
  /**
   * Mã quốc tịch 1
   */
  nationality1Code: string;
  /**
   * Mã quốc tịch 2
   */
  nationality2Code?: string;
  /**
   * Mã quốc tịch 3
   */
  nationality3Code?: string;
  /**
   * Mã quốc tịch 4
   */
  nationality4Code?: string;
  /**
   * Trả lương qua NH
   */
  payStatus?: boolean;
  /**
   * Danh sách GTXM
   */
  perDocNoList: Array<PerDocNo>;
  /**
   * Chức vụ
   */
  position: string;
  /**
   * Nghề nghiệp
   */
  profession: string;
  /**
   * Tên Tỉnh TP thường trú
   */
  residenceCityName?: string;
  /**
   * Mã quốc gia thường trú
   */
  residenceCountryCode: string;
  /**
   * Tên Quận Huyện thường trú
   */
  residenceDistrictName: string;
  /**
   * Số nhà đường phố thường trú
   */
  residenceStreetNumber: string;
  /**
   * Tên Phường Xã thường trú
   */
  residenceWardName: string;
  /**
   * Tình trạng cư trú
   */
  residentStatus: boolean;
  /**
   * Mã số thuế TNCN
   */
  taxNumber?: string;
  /**
   * Miễn thị thực nhập cảnh
   */
  visaExemption?: boolean;
  /**
   * Thị thực tới ngày
   */
  visaExpireDate?: string;
  /**
   * Thị thực từ ngày
   */
  visaIssueDate?: string;
  /**
   * Nơi công tác
   */
  workPlace?: string;

  nationality1Name: string

  nationality2Name: string

  nationality3Name: string

  nationality4Name: string

  getPerDocNoList(form: any) {
    let perDocs: PerDocNo[] = []
    let perDoc1 = new PerDocNo
    let perDoc2 = new PerDocNo
    let perDoc3 = new PerDocNo
    perDoc1.expireDate = form.expiredDate?.value
    perDoc1.issueDate = form.issuedDate?.value
    perDoc1.issuePlace = form.issuedPlace?.value
    perDoc1.perDocNo = form.perDocNo?.value
    perDoc1.perDocTypeCode = form.perDocType?.value

    perDoc2.expireDate = form.expiredDate2?.value
    perDoc2.issueDate = form.issuedDate2?.value
    perDoc2.issuePlace = form.issuedPlace2?.value
    perDoc2.perDocNo = form.perDocNo2?.value
    perDoc2.perDocTypeCode = form.perDocType2?.value

    perDoc3.expireDate = form.expiredDate3?.value
    perDoc3.issueDate = form.issuedDate3?.value
    perDoc3.issuePlace = form.issuedPlace3?.value
    perDoc3.perDocNo = form.perDocNo3?.value
    perDoc3.perDocTypeCode = form.perDocType3?.value

    perDocs.push(perDoc1)
    if (perDoc2.perDocNo != '' && perDoc2.perDocNo != null) perDocs.push(perDoc2)
    if (perDoc3.perDocNo != '' && perDoc3.perDocNo != null) perDocs.push(perDoc3)
    return perDocs
  }
  getEditDate(date: string) {
    return (date != null && date != '' && date != undefined) ? moment(new Date(date)).format('yyyy-MM-DD') : ''
  }
  getVisaExemption() {
    return this.visaExemption == true ? '1' : '2'
  }
  getCreditStatus() {
    return this.creditStatus == true ? '1' : '2'
  }
}
export class PerDocNo {
  /**
   * Ngày hết hạn
   * 2021-01-01
   */
  expireDate: string;
  /**
   * Ngày cấp
   * 2021-01-01
   */
  issueDate: string;
  /**
   * Nơi cấp
   */
  issuePlace: string;
  /**
   * Số GTXM
   */
  perDocNo: string;
  /**
   * Mã loại GTXM
   */
  perDocTypeCode: string;
  /**
   * Tên loại GTXM
   */
  perDocTypeName?: string;

  getEditDate(date: string) {
    return (date != null && date != '' && date != undefined) ? moment(new Date(date)).format('yyyy-MM-DD') : ''
  }

}
