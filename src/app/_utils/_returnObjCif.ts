import { Customer, DeputyCif, GuardianList } from '../_models/deputy';
import { OwnerBenefitsCif } from '../_models/ownerBenefitsCif';
import { CifModel, Mis, PerDocNoList, Udf } from '../_models/register.cif';

export class ObjCif {
    static objCif: CifModel;
    static objPerDoc: PerDocNoList;
    static person: DeputyCif;
    static objOwnerBenefitsCif: OwnerBenefitsCif;
    static objMis: Mis;
    static objUdf: Udf;
    static guardianList: GuardianList;
    static customer: Customer;
    static returnObjCif(controlForm: any): CifModel {
        this.objCif = new CifModel();
        this.objCif.branchCode = controlForm.branchCode.value;
        // this.objCif.employeeId = controlForm.employeeId.value
        this.returnObjCustomerBase(controlForm);
        return this.objCif;
    }
    static returnObjPerson(controlForm: any): void {
        this.objCif.customer.person.dateOfBirth = controlForm.birthDate.value;
        this.objCif.customer.person.creditStatus = controlForm.creditStatus.value === 1 ? true : false;
        this.objCif.customer.person.currentCityName = controlForm.currentProvince.value;
        this.objCif.customer.person.currentCountryCode = controlForm.currentCountry.value;
        this.objCif.customer.person.currentDistrictName = controlForm.currentDistrict.value;
        this.objCif.customer.person.currentStreetNumber = controlForm.currentAddress.value;
        this.objCif.customer.person.currentWardName = controlForm.currentWards.value;
        this.objCif.customer.person.email = controlForm.email.value;
        this.objCif.customer.person.fullName = controlForm.fullName.value;
        this.objCif.customer.person.genderCode = controlForm.genderCode.value;
        this.objCif.customer.person.mobileNo = controlForm.mobilePhone.value;
        this.objCif.customer.person.nationality1Code = controlForm.nationality.value;
        this.objCif.customer.person.nationality2Code = controlForm.nationality2.value;
        this.objCif.customer.person.nationality3Code = controlForm.nationality3.value;
        this.objCif.customer.person.nationality4Code = controlForm.nationality4.value;
        this.objCif.customer.person.payStatus = controlForm.payStatus.value;
        this.objCif.customer.person.position = controlForm.position.value;
        this.objCif.customer.person.profession = controlForm.profession.value;
        this.objCif.customer.person.residenceCityName = controlForm.permanentProvince.value;
        this.objCif.customer.person.residenceCountryCode = controlForm.permanentCountry.value;
        this.objCif.customer.person.residenceDistrictName = controlForm.permanentDistrict.value;
        this.objCif.customer.person.residenceStreetNumber = controlForm.permanentAddress.value;
        this.objCif.customer.person.residenceWardName = controlForm.permanentWards.value;
        this.objCif.customer.person.residentStatus = controlForm.residentStatus.value === 1 ? true : false;
        this.objCif.customer.person.taxNumber = controlForm.taxNumber.value;
        this.objCif.customer.person.visaExemption = controlForm.visaExemption.value !== '' ?
            controlForm.visaExemption.value === '1' ? true : false : null;
        this.objCif.customer.person.visaExpireDate = controlForm.visaExpireDate.value !== '' ? controlForm.visaExpireDate.value : null;
        this.objCif.customer.person.visaIssueDate = controlForm.visaIssueDate.value !== '' ? controlForm.visaIssueDate.value : null;
        this.objCif.customer.person.workPlace = controlForm.workPlace.value;
        this.returnLstPerDocNo(controlForm);
    }
    static returnLstPerDocNo(controlForm: any): void {
        if (controlForm.perDocType.value !== '' && controlForm.expiredDate.value !== ''
            && controlForm.issuedDate.value !== '' && controlForm.issuedPlace.value !== '' &&
            controlForm.perDocNo.value !== '') {
            this.objPerDoc = new PerDocNoList();
            this.objPerDoc.perDocIndex = 1;
            this.objPerDoc.perDocTypeCode = controlForm.perDocType.value;
            this.objPerDoc.expireDate = controlForm.expiredDate.value;
            this.objPerDoc.issueDate = controlForm.issuedDate.value;
            this.objPerDoc.issuePlace = controlForm.issuedPlace.value;
            this.objPerDoc.perDocNo = controlForm.perDocNo.value;
            this.objCif.customer.person.perDocNoList.push(this.objPerDoc);
        }

        if (controlForm.perDocType2.value !== '' && controlForm.expiredDate2.value !== ''
            && controlForm.issuedDate2.value !== '' && controlForm.issuedPlace2.value !== '' &&
            controlForm.perDocNo2.value !== '') {
            this.objPerDoc = new PerDocNoList();
            this.objPerDoc.perDocIndex = 2;
            this.objPerDoc.perDocTypeCode = controlForm.perDocType2.value;
            this.objPerDoc.expireDate = controlForm.expiredDate2.value;
            this.objPerDoc.issueDate = controlForm.issuedDate2.value;
            this.objPerDoc.issuePlace = controlForm.issuedPlace2.value;
            this.objPerDoc.perDocNo = controlForm.perDocNo2.value;
            this.objCif.customer.person.perDocNoList.push(this.objPerDoc);
        }

        if (controlForm.perDocType3.value !== '' && controlForm.expiredDate3.value !== ''
            && controlForm.issuedDate3.value !== '' && controlForm.issuedPlace3.value !== '' &&
            controlForm.perDocNo3.value !== '') {
            this.objPerDoc = new PerDocNoList();
            this.objPerDoc.perDocIndex = 3;
            this.objPerDoc.perDocTypeCode = controlForm.perDocType3.value;
            this.objPerDoc.expireDate = controlForm.expiredDate3.value;
            this.objPerDoc.issueDate = controlForm.issuedDate3.value;
            this.objPerDoc.issuePlace = controlForm.issuedPlace3.value;
            this.objPerDoc.perDocNo = controlForm.perDocNo3.value;
            this.objCif.customer.person.perDocNoList.push(this.objPerDoc);
        }
    }
    static returnObjCustomerBase(controlForm: any): void {
        this.objCif.customer.branchCode = controlForm.branchCode.value;
        this.objCif.customer.customerCategoryCode = controlForm.customerCategoryCode.value;
        this.objCif.customer.customerTypeCode = controlForm.customerTypeCode.value;
        this.objCif.customer.employeeId = controlForm.employeeId.value;
        this.returnObjPerson(controlForm);
    }
    static returnGuardianList(controlForm: any): GuardianList {
        this.guardianList = new GuardianList();
        this.guardianList.id = controlForm.id.value;
        this.guardianList.guardianTypeCode = 'INDIV_GUARDIAN';
        this.guardianList.guardianRelationCode = controlForm.guardianRelationCode.value;
        this.guardianList.inEffect = controlForm.inEffect.value;
        this.returnCustomer(controlForm);
        return this.guardianList;
    }
    static returnCustomer(controlForm: any): void {
        this.customer = new Customer();
        // nếu search dữ liệu thì truyền vào
        this.customer.id = controlForm.customerId;
        this.guardianList.customer.branchCode = '';
        this.guardianList.customer.customerCode = null;
        this.guardianList.customer.customerTypeCode = 'INDIV';
        this.guardianList.customer.customerCategoryCode = 'INDIV';
        this.guardianList.customer.mnemonicName = '';
        this.guardianList.customer.employeeId = '';
        // ket thuc
        this.returnDuputyCif(controlForm);
    }

    static returnDuputyCif(controlForm: any): void {
        this.person = new DeputyCif();
        this.guardianList.customer.person.id = controlForm.personId.value;
        this.guardianList.customer.person.fullName = controlForm.fullName.value;
        this.guardianList.customer.person.residentStatus = controlForm.residentStatus.value;
        this.guardianList.customer.person.dateOfBirth = controlForm.dateOfBirth.value;
        this.guardianList.customer.person.genderCode = controlForm.genderCode.value;
        // this.person.perDocNo = controlForm.perDocNo.value
        this.guardianList.customer.person.mobileNo = controlForm.mobileNo.value;
        this.guardianList.customer.person.guardianRelationCode = controlForm.guardianRelationCode.value;
        this.guardianList.customer.person.nationality1Code = controlForm.nationality1Code.value;
        this.guardianList.customer.person.taxCode = controlForm.taxCode.value;
        this.guardianList.customer.person.currentCountryCode = controlForm.currentCountryCode.value;
        this.guardianList.customer.person.currentCityName = controlForm.currentCityName.value;
        this.guardianList.customer.person.currentDistrictName = controlForm.currentDistrictName.value;
        this.guardianList.customer.person.currentWardName = controlForm.currentWardName.value;
        this.guardianList.customer.person.currentStreetNumber = controlForm.currentStreetNumber.value;
        this.guardianList.customer.person.visaExemption = controlForm.visaExemption.value;
        this.guardianList.customer.person.visaIssueDate = controlForm.visaIssueDate.value;
        this.guardianList.customer.person.visaExpireDate = controlForm.visaExpireDate.value;
        this.returnPerDocNoList(controlForm);
    }
    static returnPerDocNoList(controlForm: any): void {
        this.objPerDoc = new PerDocNoList();
        this.objPerDoc.perDocIndex = 1;
        this.objPerDoc.id = controlForm.perDocNoId.value;
        this.objPerDoc.perDocTypeCode = controlForm.perDocTypeCode.value; // fix tạm
        this.objPerDoc.expireDate = controlForm.issueDate.value;
        this.objPerDoc.issueDate = controlForm.issueDate.value;
        this.objPerDoc.issuePlace = controlForm.issuePlace.value;
        this.objPerDoc.perDocNo = controlForm.perDocNo.value;
        this.guardianList.customer.person.perDocNoList.push(this.objPerDoc);
    }
    static returnOwnerBenefitsCif(controlForm: any): OwnerBenefitsCif {
        this.objOwnerBenefitsCif = new OwnerBenefitsCif();
        this.objOwnerBenefitsCif.fullName = controlForm.fullName.value;
        this.objOwnerBenefitsCif.numberGTXM = controlForm.numberGTXM.value;
        this.objOwnerBenefitsCif.dateOfBirth = controlForm.dateOfBirth.value;
        this.objOwnerBenefitsCif.issuedBy = controlForm.issuedBy.value;
        this.objOwnerBenefitsCif.nationality = controlForm.nationality.value;
        this.objOwnerBenefitsCif.nationality2 = controlForm.nationality2.value;
        this.objOwnerBenefitsCif.nationality3 = controlForm.nationality3.value;
        this.objOwnerBenefitsCif.nationality4 = controlForm.nationality4.value;
        this.objOwnerBenefitsCif.dateOfAgreement = controlForm.dateOfAgreement.value;
        this.objOwnerBenefitsCif.resident = controlForm.resident.value;
        this.objOwnerBenefitsCif.phone = controlForm.phone.value;
        this.objOwnerBenefitsCif.job = controlForm.job.value;
        this.objOwnerBenefitsCif.smartPhone = controlForm.smartPhone.value;
        this.objOwnerBenefitsCif.regency = controlForm.regency.value;
        this.objOwnerBenefitsCif.email = controlForm.email.value;
        this.objOwnerBenefitsCif.nationalityResident = controlForm.nationalityResident.value;
        this.objOwnerBenefitsCif.nationalityPresent = controlForm.nationalityPresent.value;
        this.objOwnerBenefitsCif.currentProvinceResident = controlForm.currentProvinceResident.value;
        this.objOwnerBenefitsCif.currentProvincePresent = controlForm.currentProvincePresent.value;
        this.objOwnerBenefitsCif.currentDistrictResident = controlForm.currentDistrictResident.value;
        this.objOwnerBenefitsCif.currentDistrictPresent = controlForm.currentDistrictPresent.value;
        this.objOwnerBenefitsCif.currentWardsResident = controlForm.currentWardsResident.value;
        this.objOwnerBenefitsCif.currentWardsPresent = controlForm.currentWardsPresent.value;
        this.objOwnerBenefitsCif.numberHomeResident = controlForm.numberHomeResident.value;
        this.objOwnerBenefitsCif.numberHomePresent = controlForm.numberHomePresent.value;
        this.objOwnerBenefitsCif.visaExemption = controlForm.visaExemption.value;
        this.objOwnerBenefitsCif.visaIssueDate = controlForm.visaIssueDate.value;
        this.objOwnerBenefitsCif.visaExpireDate = controlForm.visaExpireDate.value;
        return this.objOwnerBenefitsCif;
    }

    static returnObjMis(controlForm: any): Mis {
        this.objMis = new Mis();
        this.objMis.cifLoaiCode = controlForm.CIF_LOAI.value;
        this.objMis.cifLhktCode = controlForm.CIF_LHKT.value;
        this.objMis.cifTpktCode = controlForm.CIF_TPKT.value;
        this.objMis.cifKbhtgCode = controlForm.CIF_KBHTG.value;
        this.objMis.lhnnntvayCode = controlForm.LHNNNTVAY.value;
        this.objMis.tdManktCode = controlForm.TD_MANKT.value;
        this.objMis.cifNganhCode = controlForm.CIF_NGANH.value;
        this.objMis.cifKh78Code = controlForm.CIF_KH78.value;
        this.objMis.cifPnkhCode = controlForm.CIF_PNKH.value;
        this.objMis.comTsctCode = controlForm.COM_TSCT.value;
        this.objMis.dcGhCode = controlForm.DC_GH.value;
        this.objMis.cifManktCode = controlForm.CIF_MANKT.value;
        return this.objMis;
    }
    static returnObjUdf(controlForm: any): Udf {
        this.objUdf = new Udf();
        this.objUdf.canBoGioiThieu = controlForm.canBoGioiThieu.value;
        this.objUdf.cifPnkhCode = controlForm.cifPnkhCode.value;
        this.objUdf.cmndCccdHc = controlForm.cmndCccdHc.value;
        this.objUdf.nguoiDaidienPhapluat = controlForm.nguoiDaidienPhapluat.value;
        this.objUdf.soSoBaoHiemXaHoi = controlForm.soSoBaoHiemXaHoi.value;
        this.objUdf.sdtNhanSmsGdtetkiem = controlForm.sdtNhanSmsGdtetkiem.value;
        this.objUdf.tracuuTtstkwebVivietCode = controlForm.tracuuTtstkwebVivietCode.value;
        this.objUdf.pnkhKhdk = controlForm.pnkhKhdk.value;
        this.objUdf.expiredDate = controlForm.expiredDate.value;
        this.objUdf.comboSanPham2018Code = controlForm.comboSanPham2018Code.value;
        this.objUdf.cifKeToanTruong = controlForm.cifKeToanTruong.value;
        this.objUdf.cifGiamDoc = controlForm.cifGiamDoc.value;
        this.objUdf.noiCapCmndHc = controlForm.noiCapCmndHc.value;
        this.objUdf.nhanHdtQuaMail = controlForm.nhanHdtQuaMail.value;
        this.objUdf.maCbnvLpbCode = controlForm.maCbnvLpbCode.value;
        this.objUdf.diaBanNongThonCode = controlForm.diaBanNongThonCode.value;
        this.objUdf.khoiDonViGioiThieuCode = controlForm.khoiDonViGioiThieuCode.value;
        this.objUdf.tongDoanhThu = controlForm.tongDoanhThu.value;
        this.objUdf.dangkyDvGdemailDvkd = controlForm.dangkyDvGdemailDvkd.value;
        this.objUdf.cifDinhdanhCode = controlForm.cifDinhdanhCode.value;
        this.objUdf.groupCodeCode = controlForm.groupCodeCode.value;
        this.objUdf.congTyNhaNuocCode = controlForm.congTyNhaNuocCode.value;
        this.objUdf.dbKhVayCode = controlForm.dbKhVayCode.value;
        this.objUdf.cnUtpt1483CifCode = controlForm.cnUtpt1483CifCode.value;
        this.objUdf.lvUdCnCaoCifCode = controlForm.lvUdCnCaoCifCode.value;
        this.objUdf.khutCode = controlForm.khutCode.value;
        this.objUdf.thuongTatCode = controlForm.thuongTatCode.value;
        this.objUdf.denNgay = controlForm.denNgay.value;
        this.objUdf.tuNgay = controlForm.tuNgay.value;
        this.objUdf.loaiChuongTrinhCode = controlForm.loaiChuongTrinhCode.value;
        this.objUdf.khachHangCode = controlForm.khachHangCode.value;
        this.objUdf.kyDanhGiaTvn = controlForm.kyDanhGiaTvn.value;
        this.objUdf.tongnguonvon = controlForm.tongnguonvon.value;
        this.objUdf.tcKTctdCode = controlForm.tcKTctdCode.value;
        this.objUdf.maTctdCode = controlForm.maTctdCode.value;
        this.objUdf.viTriToLketVayvonCode = controlForm.viTriToLketVayvonCode.value;
        this.objUdf.maHuyenThiXaCode = controlForm.maHuyenThiXaCode.value;
        this.objUdf.noPhaiTra = controlForm.noPhaiTra.value;
        this.objUdf.vonLuuDong = controlForm.vonLuuDong.value;
        this.objUdf.ngayCapCmndHc = controlForm.ngayCapCmndHc.value;
        this.objUdf.coCmndHc = controlForm.coCmndHc.value;
        this.objUdf.hoTenVoChong = controlForm.hoTenVoChong.value;
        this.objUdf.tenVietTat = controlForm.tenVietTat.value;
        this.objUdf.nganhNgheKinhDoanh = controlForm.nganhNgheKinhDoanh.value;
        this.objUdf.tongSoLdHienTai = controlForm.tongSoLdHienTai.value;
        this.objUdf.dienThoai = controlForm.dienThoai.value;
        this.objUdf.email = controlForm.email.value;
        this.objUdf.website = controlForm.website.value;
        this.objUdf.tenDoiNgoai = controlForm.tenDoiNgoai.value;
        this.objUdf.vonCoDinh = controlForm.vonCoDinh.value;
        this.objUdf.noPhaiThu = controlForm.noPhaiThu.value;
        return this.objUdf;
    }
}
