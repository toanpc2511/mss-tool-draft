export class TextMessage {
    // Nội dung popup xác nhận
    confirmSaveInformation = 'Bạn chưa lưu thông tin thay đổi ?'; // xác nhận lưu thông tin thay đổi khi chưa save
    confirmDeleteEmployee = 'Bạn có chắc xóa nhân viên có mã ?'; // xác nhận xóa 1 nhân viên
    confirmLockEmployee = 'Bạn có muốn khóa nhân viên có mã ?'; //  xác nhận khóa 1 nhân viên
    confirmUnlockEmployee = 'Bạn có muốn mở khóa cho nhân viên có mã ?'; // xác nhận mở khóa cho 1 nhân viên
    confirmDeleteTitle = 'Bạn có muốn xóa chức danh có mã ?'; //  xác nhận xóa chức danh
    confirmDeleteRole = 'Bạn có muốn xóa quyền có mã ?'; // xác nhận xóa quyền có mã
    confirmDeleteFileCode = 'Bạn có muốn xóa hồ sơ ?'; //  xác nhận xóa hồ sơ có mã
    confirmService = 'Bạn có muốn duyệt dịch vụ này không ?'; //  xác nhận duyệt dịch vụ
    confirmCloseFile = 'Bạn có chắc chắn muốn đóng hồ sơ ?'; //  xác nhận đóng hồ sơ
    confirmAllService = 'Bạn có chắc chắn muốn duyệt tất cả dịch vụ ?'; // xác nhận duyệt tất cả dịch vụ
    confirMmanipulation = 'Bạn có chắc chắn thực hiện thao tác ?'; //  xác nhận thực hiện thao tác
    confirmFile = 'Bạn có muốn gửi duyệt hồ sơ này không ?'; //  xác nhận gửi duyệt hồ sơ
    confirmDeleteFile = 'Bạn có muốn xóa hồ sơ này ?'; //  xác nhận xóa hồ sơ
    confirmDeleteAccount = 'Bạn có muốn xóa tài khoản ? '; // xác nhận xóa tài khoản
    confirmDeletePermision = 'Bạn có muốn xóa quyền ?'; //  xác nhận xóa quyền
    confirmDeleteCoowner = 'Bạn có chắc chắn muốn xóa đồng sở hữu này ?'; //  xác nhận xóa đồng sở hữu
    confirmStopMmanipulation = 'Bạn có chắc chắn muốn thoát? Thao tác sẽ không được lưu lại. ?'; //  xác nhận khi muốn đóng popup
    confirm = 'Bạn có đồng ý với thay đổi ?'; //  xác nhận sự thay đổi
    confirmDeleteLegalRepresentative = 'Bạn chắc chắn muốn xóa bản ghi này ?'; // xác nhận xóa người đại diện pháp luật
    confirmDeleteMainCard =
    'Xóa thông tin thẻ chính ? </br>(Các thông tin của thẻ ở thẻ phụ nếu có cũng sẽ bị xóa)';
    confirmDeleteSupCard = 'Bạn có muốn xóa thông tin thẻ phụ ?';
    rejectProcess = 'Bạn có chắc chắn muốn từ chối hồ sơ ?'; // xác nhận duyệt tất cả dịch vụ
    confirmDeleteEbank = 'Bạn có muốn xóa thông tin dịch vụ ?';
    confirmDeadTroyEbank = 'Bạn có chắc chắn HỦY dịch vụ Ebanking không ?';
    confirmSendApproveOne = 'Bạn có chắc chắn muốn gửi duyệt dịch vụ này không ?';
    confirmSendRejectOne = 'Bạn có chắc chắn muốn từ chối dịch vụ này không ?';
    confirmSendModifyOne = 'Bạn có muốn yêu cầu bổ sung dịch vụ này không ?';
    // kêt thúc

    // các lỗi message báo ra
    contentSearch = 'Giá trị tìm kiếm không được để trống'; // giá trị tìm kiếm
    contentFullName = 'Họ và tên không được để trống'; // Họ và tên
    contentDateOfBirthRequired = 'Ngày sinh không được để trống'; // Ngày sinh
    validateDate1 = 'Ngày cấp phải lớn hơn ngày sinh'; // Ngày sinh
    validateDate2 = 'Ngày sinh phải nhỏ hơn ngày cấp'; // Ngày sinh
    contentDateOfBirth = 'Ngày sinh không đúng định dạng'; // Ngày sinh
    contentDateOfBirthGreaterThanDate = 'Ngày sinh không được lớn hơn ngày hiện tại'; // check ngày sinh với ngày hiện tại
    dateOfAgreementGreaterThanDate = 'Ngày lập thỏa thuận không được lớn hơn ngày hiện tại'; // check ngày sinh với ngày hiện tại
    identifyDateOfBirthGreaterThanDate = 'Ngày cấp không được lớn hơn ngày hiện tại'; // check ngày sinh với ngày hiện tại
    contentGender = 'Giới tính chưa lựa chọn'; //  giới tính
    contentPhone = 'Số điện thoại không được để trống'; // số điện thoại
    contentPhoneMax = 'Số điện thoại phải từ 10-11 kí tự'; // số điện thoại
    contentRelationship = 'Quan hệ với chủ tài khoản chưa lựa chọn'; // quan hệ với chủ tài khoản
    contentResident = 'Người cư trú chưa lựa chọn'; // người cư trú
    contentNumberGTXM = 'Số giấy tờ xác minh không được để trống'; //  số giấy tờ xác minh
    contentNumberGTXMExist = 'Số giấy tờ xác minh đã tồn tại'; // check tồn tại GTXM
    contentIssuedBy = 'Nơi cấp không để trống'; //  nơi cấp
    contentIssueDate = 'Ngày cấp không đúng định dạng'; //  ngày cấp
    contentNationality = 'Quốc tịch không được để trống'; // quốc tịch
    contentNationalityDuplicate = 'Quốc tịch đã lựa chọn'; //  trùng quốc tich
    contentnationality2 = 'Quốc gia không được để trống'; //  quốc gia
    contentCurrentProvince = 'Tỉnh/ Thành phố không được để trống'; // tỉnh/ thành phố
    contentCurrentDistrict = 'Quận/ Huyện không được để trống'; //  quận/ huyện
    contentCurrentWards = 'Phường/ Xã không được để trống'; // phường/ xã
    contentNumberHome = 'Số nhà, đường phố không được để trống'; //  địa chỉ số nhà,đường phố
    contentNumberTax = 'Mã số thuế không được để trống'; // mã số thuế
    contentVisaIssueDate = 'Từ ngày không được để trống'; // từ ngày thị thực nhập cảnh
    contentVisaExpireDate = 'Đến ngày không được để trống'; //  đến ngày thị thực nhập cảnh
    contentVisaExpireDateSmallerThanVisaIssueDate = 'Đến ngày không được nhỏ hơn từ ngày'; //  so sánh đến ngày phải lớn từ ngày
    // tslint:disable-next-line:variable-name
    contentCIF_TPKT = 'CIF_TPKT chưa chọn'; // CIF_TPKT
    // tslint:disable-next-line:variable-name
    contentCIF_KH78 = 'CIF_KH78 chưa chọn'; // CIF_KH78
    // tslint:disable-next-line:variable-name
    contentCIF_PNKH = 'CIF_PNKH chưa chọn'; // CIF_PNKH
    // tslint:disable-next-line:variable-name
    contentSDT_NHAN_SMS = 'SDT NHAN SMS GD TIET KIEM không được để trống'; // SDT NHAN SMS GD TIET KIEM
    // tslint:disable-next-line:variable-name
    contentTRA_CUU_TT_STK = 'TRA CUU TT STK WEBSITE VI VIET chưa chọn'; // TRA CUU TT STK WEBSITE VI VIET
    contentDescriptionCommision = 'Nội dung không được để trống'; // nội dung thỏa thuận pháp lý
    contentAssetValue = 'Giá trị tiền/tài sản không để trống'; // thỏa thuận pháp lý
    contentDateOfAgreement = 'Ngày lập thỏa thuận không được để trống'; // ngày thỏa thuận pháp lý
    contentObject = 'Đối tượng chưa chọn'; // đối tượng thỏa thuận pháp lý
    relationship = 'Mối quan hệ không được để trống'; //  quận/ huyện
    // kết thúc
}
