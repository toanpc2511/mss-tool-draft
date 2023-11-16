
export class AuthorityModel {
    accountId: string ;  // Mã PK tài khoản
    approveBy: string ; // Mã PK tài khoản user duyệt
    approveDate: string ; // example: 2021 - 01 - 01 Ngày duyệt
    authorTypes: AuthorizationScope[];  // Mã phạm vi ủy quyền
     //  authorTypeFreeText: string ; // Nội dung ủy quyền khác
    birthDate: string ; // example: 2021 - 01 - 01 Ngày sinh
    bornOfPlace: string ;  // example: Hà Nội Nơi sinh
    currentCountryCode: string ;  //  ma quoc gia hien tai
    currentCountryName: string ; // quoc gia name hien tai
    currentCityCode: string ;  // example: 1000 Mã Tỉnh / TP hiện tại
    currentCityName: string ;  // tinh/tp name
    currentDistrictCode: string ;  //  example: 007 Mã Quận Huyện hiện tại
    currentDistrictName: string ;  // quan/huyen name hien tai
    currentStreetNumber: string ;  // example: 11 / 101 Số nhà, đường phố hiện tại
    currentWardCode: string ; //   example: 00289 Mã Phường Xã hiện tại
    currentWardName: string ;  // phuong xa hien tai name
    customerCode: string ;  // example: 123456 Mã CIF KH
    email: string ; //  Địa chỉ Email
    expireAuthorCode: string ;  // example: ONE Mã thời gian ủy quyền
    expireDate: string ;  //  example: 2021 - 01 - 01 Ngày hết hạn giấy tờ tùy thân
    foreignAddress: string ; // Địa chỉ ở nước ngoài
    fullName: string ; //  example: VÕ HOÀNG VIỆT Họ và tên
    genderCode: string ; // example: MALE Mã giới tính
    genderName: string ;  // ten gioi tinh
    industry: string ; // example: Văn phòng Nghề nghiệp
    inputDate: string ; // example: 2021 - 01 - 01 Ngày nhập
    issueDate: string ;  // example: 2021 - 01 - 01 Ngày cấp
    issuePlace: string ;  // example:  Nơi cấp
    limitAmount: string ;  // example: 50.000.000 VNĐ Giá trị hạn mức
    maritalStatusCode: string ; // example: SINGLE Mã tình trạng hôn nhân
    mobilePhone: string ; // example: 0977112234 Điện thoại di động
    nationalityCode: string ;
    perDocNo: string ;  // example: 001090001101 Số giấy tờ tùy thân
    perDocTypeCode: string ;  // example: CCCD Mã loại giấy tờ tùy thân
    perDocTypeName: string ;  // ten loai giay to
    position: string ;  // example: Nhân viên Chức vụ
    requestId: string ; // example: 6386276a - 8ae1 - 4ac6 - a81b - 91435c20f7e9 Mã request sang ESB
    residence: boolean;  // example: false Người cư trú
    residenceCountryCode: string ;  // Ma quoc gia thuong tru
    residenceCountryName: string ;  //  quoc gia name
    residenceCityCode: string ;  // example: 1000 Mã Tỉnh / TP thường trú
    residenceCityName: string ;  //  tinh/tp name
    residenceDistrictCode: string ;  // example: 007 Mã Quận Huyện thường trú
    residenceDistrictName: string ;  // quan/huyen thuong tru name
    residenceStreetNumber: string ;  // example: 11 / 101 Số nhà, đường phố thường trú
    residenceWardCode: string ;  // example: 00289 phuong xa thường trú
    residenceWardName: string ; // ten phuong xa thuong tru
    validFrom: string ; // example: 2021 - 01 - 01 Thời hạn ủy quyền từ ngày
    validTo: string ; // example: 2021 - 01 - 01 Thời hạn ủy quyền tới ngày
    nationality1Code: string ;  // Mã quốc tịch 1
    nationality1Name: string ;  // ten qt 1
    nationality2Code: string ;  // Mã quốc tịch 2
    nationality2Name: string ;  // ten qt 2
    nationality3Code: string ;  // Mã quốc tịch 3
    nationality3Name: string ;  // ten qt 3
    nationality4Code: string ;  // Mã quốc tịch 4
    nationality4Name: string ;  // ten qt4
    visaExemption: boolean;
    visaIssueDate: string ;
    visaExpireDate: string ;
    currentStatusCode: string;
}
export class AuthorizationScope{
    authorTypeCode: string ;
    authorTypeFreeText: string ;
    limitAmount: number;
}
