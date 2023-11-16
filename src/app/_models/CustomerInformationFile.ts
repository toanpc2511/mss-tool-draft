import {CustomerBase, ICustomerInformationFile, Person} from './_interfaces/ICustomerInformationFile';
import * as moment from 'moment';

/**
 * Model khách hàng - CIF
 */
export class CustomerInformationFile implements ICustomerInformationFile {
  branchCode: string;
  customerBase: CustomerBase;
  employeeId: string;
}
export class GeneralInformationCIF extends CustomerInformationFile{
  constructor(form: any) {
    super(); // pass FormGroupName.controls to this constructor
    this.branchCode = form.branchCodeActive.value
    // customerBase
    this.customerBase = new CustomerBase()
    this.customerBase.branchCode = form.branchCode.value
    this.customerBase.customerCategoryCode = form.customerCategoryCode.value
    this.customerBase.customerTypeCode = form.customerTypeCode.value
    this.customerBase.employeeId = form.employeeId.value
    //person
    this.customerBase.person = new Person()
    this.customerBase.person.birthDate = form.birthDate.value
    this.customerBase.person.creditStatus = form.creditStatus.value == '1'
    this.customerBase.person.currentCityName = form.currentProvince.value
    this.customerBase.person.currentCountryCode = form.currentCountry.value
    this.customerBase.person.currentDistrictName = form.currentDistrict.value
    this.customerBase.person.currentStreetNumber = form.currentAddress.value
    this.customerBase.person.currentWardName = form.currentWards.value
    this.customerBase.person.email = form.email?.value
    this.customerBase.person.fullName = form.fullName.value
    this.customerBase.person.genderCode = form.genderCode.value
    this.customerBase.person.mobilePhone = form.mobilePhone.value
    this.customerBase.person.nationality1Code = form.nationality.value
    this.customerBase.person.nationality2Code = form.nationality2?.value
    this.customerBase.person.nationality3Code = form.nationality3?.value
    this.customerBase.person.nationality4Code = form.nationality4?.value
    this.customerBase.person.payStatus = form.payStatus.value == '1'
    // PerDocNoList
    this.customerBase.person.perDocNoList = this.customerBase.person.getPerDocNoList((form))
    this.customerBase.person.position = form.position.value
    this.customerBase.person.profession = form.profession.value
    this.customerBase.person.residenceCityName = form.permanentProvince.value
    this.customerBase.person.residenceCountryCode = form.permanentCountry.value
    this.customerBase.person.residenceDistrictName = form.permanentDistrict.value
    this.customerBase.person.residenceStreetNumber = form.permanentAddress.value
    this.customerBase.person.residenceWardName = form.permanentWards.value

    this.customerBase.person.residentStatus = form.residentStatus.value == '1'
    this.customerBase.person.taxNumber = form.taxNumber?.value
    this.customerBase.person.visaExemption = form.visaExemption?.value == '1'
    this.customerBase.person.visaIssueDate = form.visaIssueDate?.value
    this.customerBase.person.visaExpireDate = form.visaExpireDate?.value
    this.customerBase.person.workPlace = form.workPlace?.value

    this.employeeId = form.employeeId.value
  }
}



export class DetailCIF extends CustomerInformationFile {
  processId: string
  getEditDate(date: string) {
    return moment(new Date(date)).format('yyyy-MM-DD')
  }
}


