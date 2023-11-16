export class ErrorMessage {

  public static DATE_OF_BIRTH = {
    REQUIRED: 'Ngày sinh không được để trống',
    FORMAT: 'Ngày sinh không đúng định dạng',
    GT_CURRENT_DATE: 'Ngày sinh không được lớn hơn ngày hiện tại',
    LT_IDENTIFY_DATE: 'Ngày sinh không được lớn hơn ngày cấp',
    EIGHTEEN_YEAR_OLD: 'Thông tin người giám hộ phải từ 18 tuổi trở lên',
    FOUR_YEAR_OLD: 'Thông tin đồng chủ sở hữu phải từ 14 tuổi trở lên',
    ONE_HUNDRED_TWENTY_YEARS_OLD: 'Ngày sinh không được quá 120 tuổi'
  };
  public static PHONE_NUMBER = {
    REQUIRED: 'Số điện thoại không được để trống',
    LENGTH: 'Số điện thoại phải từ 10-11 ký tự số',
  };
  public static IDENTIFY_DATE = {
    REQUIRED: 'Ngày cấp không được để trống',
    FORMAT: 'Ngày cấp không đúng định dạng',
    GT_CURRENT_DATE: 'Ngày cấp không được lớn hơn ngày hiện tại',
    GT_DATE_OF_BIRTH: 'Ngày cấp phải lớn hơn ngày sinh',
  };

  public static ISSUE_PLACE = {
    REQUIRED: 'Nơi Cấp không được để trống',
    LENGTH: 'Số điện thoại phải là 10 ký tự số',
  };

  public static FROM_DATE = {
    GT_CURRENT_DATE: 'Từ ngày không được lớn hơn ngày hiện tại',
  };

  public static TO_DATE = {
    LT_CURRENT_DATE: 'Đến ngày không được nhỏ hơn ngày hiện tại',
  };

  public static EMAIL = {
    REQUIRED: 'Email không được để trống',
    LENGTH: 'Số điện thoại phải là 10 ký tự số',
    FORMAT_INVALID: 'Định dạng email không đúng'
  };

  public static FULL_NAME = {
    REQUIRED: 'Họ tên không được để trống',
    LENGTH: 'Số điện thoại phải là 10 ký tự số',
  };

  public static NATIONALITY = {
    EXIST: 'Quốc tịch không được trùng nhau',
  };

  public static TAX_CODE = {
    REQUIRED: 'Họ tên không được để trống',
    REGEXP: 'Mã số thuế chỉ gồm các ký tự số',
    LENGTH: 'Mã số thuế phải là 10 ký tự số',
  };



  public static REQUIRED = (fieldName: string) => `${fieldName} không được để trống`;
  // tslint:disable-next-line:variable-name
  public static MIN = (fieldName: string, number) => `${fieldName} phải là ${number} ký tự `;
  public static DOESNT_EXIST = (fieldName: string) => `${fieldName} không hợp lệ`;
  public static IS_EXIST = (fieldName: string) => `${fieldName} không được để trống`;

}
