import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Bigger3Date, futureDate, pastDate } from '../_validator/cif.register.validator';
import { DetailCIF } from './CustomerInformationFile';

export class CustomerInformationFileForm {
  /**
   * Danh sách các trường cần validate khi submit
   */
  cifFieldToValidate: string[] = [
    'fullName',
    'genderCode',
    'mobilePhone',
    'birthDate',
    'residentStatus',
    'profession',
    'position',
    'employeeId',
    'branchCode',
    'nationality',
    'visaIssueDate',
    'visaExpireDate',

    'perDocType', 'perDocNo', 'issuedDate', 'issuedPlace', 'expiredDate',
    'perDocType2', 'perDocNo2', 'issuedDate2', 'issuedPlace2', 'expiredDate2',
    'perDocType3', 'perDocNo3', 'issuedDate3', 'issuedPlace3', 'expiredDate3',


    'currentCountry',
    'currentProvince',
    'currentDistrict',
    'currentWards',
    'currentAddress',

    'permanentCountry',
    'permanentProvince',
    'permanentDistrict',
    'permanentWards',
    'permanentAddress',
  ]
  cifFieldToTouch: string[] = [
    'birthDate',
    'issuedDate',
    'expiredDate',
    'issuedDate2',
    'expiredDate2',
    'issuedDate3',
    'expiredDate3',
    'visaIssueDate',
    'visaExpireDate',
  ]
  cifFieldWhenChangeAddress: string[] = [
    'currentProvince',
    'currentDistrict',
    'permanentProvince',
    'permanentDistrict',
  ]

  /**
   * Gọi sau khi lấy thông tin chi tiết
   * @param process
   */
  // updateFormData(process: DetailCIF) {
  //   let person = process.customerBase.person
  //   let perDocs = process.customerBase.person.perDocNoList
  //   if (process && process.processId != '' && process.processId != undefined) {
  //     this.cifFormGroup.get('fullName').setValue(person.fullName)
  //     this.cifFormGroup.get('genderCode').setValue(person.genderCode)

  //     this.cifFormGroup.get('perDocType').setValue(perDocs[0].perDocTypeCode)
  //     this.cifFormGroup.get('perDocNo').setValue(perDocs[0].perDocNo)
  //     this.cifFormGroup.get('issuedDate').setValue(perDocs[0].getEditDate(perDocs[0].issueDate))
  //     this.cifFormGroup.get('issuedPlace').setValue(perDocs[0].issuePlace)
  //     this.cifFormGroup.get('expiredDate').setValue(perDocs[0].getEditDate(perDocs[0].expireDate))

  //     this.cifFormGroup.get('perDocType2').setValue(perDocs[1]?.perDocTypeCode)
  //     this.cifFormGroup.get('perDocNo2').setValue(perDocs[1]?.perDocNo)
  //     this.cifFormGroup.get('issuedDate2').setValue(perDocs[1].getEditDate(perDocs[1]?.issueDate))
  //     this.cifFormGroup.get('issuedPlace2').setValue(perDocs[1]?.issuePlace)
  //     this.cifFormGroup.get('expiredDate2').setValue(perDocs[1].getEditDate(perDocs[1]?.expireDate))

  //     this.cifFormGroup.get('perDocType3').setValue(perDocs[2]?.perDocTypeCode)
  //     this.cifFormGroup.get('perDocNo3').setValue(perDocs[2]?.perDocNo)
  //     this.cifFormGroup.get('issuedDate3').setValue(perDocs[2].getEditDate(perDocs[2]?.issueDate))
  //     this.cifFormGroup.get('issuedPlace3').setValue(perDocs[2]?.issuePlace)
  //     this.cifFormGroup.get('expiredDate3').setValue(perDocs[2].getEditDate(perDocs[2]?.expireDate))

  //     this.cifFormGroup.get('mobilePhone').setValue(person.mobilePhone)
  //     this.cifFormGroup.get('birthDate').setValue(person.getEditDate(person.birthDate))
  //     this.cifFormGroup.get('residentStatus').setValue(person.residentStatus ? '1' : '2')
  //     this.cifFormGroup.get('profession').setValue(person.profession)
  //     this.cifFormGroup.get('position').setValue(person.position)
  //     this.cifFormGroup.get('workPlace').setValue(person.workPlace)
  //     this.cifFormGroup.get('workPlace').setValue(person.workPlace)
  //     this.cifFormGroup.get('employeeId').setValue(process.employeeId)
  //     this.cifFormGroup.get('branchCodeActive').setValue(process.branchCode)
  //     this.cifFormGroup.get('branchCode').setValue(process.customerBase.branchCode)
  //     this.cifFormGroup.get('email').setValue(person.email)
  //     this.cifFormGroup.get('nationality').setValue(person.nationality1Name)
  //     this.cifFormGroup.get('nationality2').setValue(person.nationality2Name)
  //     this.cifFormGroup.get('nationality3').setValue(person.nationality3Name)
  //     this.cifFormGroup.get('nationality4').setValue(person.nationality4Name)
  //     this.cifFormGroup.get('visaExemption').setValue(person.getVisaExemption())
  //     this.cifFormGroup.get('visaIssueDate').setValue(person.getEditDate(person.visaIssueDate))
  //     this.cifFormGroup.get('visaExpireDate').setValue(person.getEditDate(person.visaExpireDate))
  //     this.cifFormGroup.get('creditStatus').setValue(person.getEditDate(person.getCreditStatus()))
  //     this.cifFormGroup.get('payStatus').setValue(person.payStatus)
  //     this.cifFormGroup.get('taxNumber').setValue(person?.taxNumber)

  //     this.cifFormGroup.get('currentCountry').setValue(person?.currentCountryCode)
  //     this.cifFormGroup.get('currentProvince').setValue(person?.currentCityName)
  //     this.cifFormGroup.get('currentDistrict').setValue(person?.currentDistrictName)
  //     this.cifFormGroup.get('currentWards').setValue(person?.currentWardName)
  //     this.cifFormGroup.get('currentAddress').setValue(person?.currentStreetNumber)

  //     this.cifFormGroup.get('permanentCountry').setValue(person?.residenceCountryCode)
  //     this.cifFormGroup.get('permanentProvince').setValue(person?.residenceCityName)
  //     this.cifFormGroup.get('permanentDistrict').setValue(person?.residenceDistrictName)
  //     this.cifFormGroup.get('permanentWards').setValue(person?.residenceWardName)
  //     this.cifFormGroup.get('permanentAddress').setValue(person?.residenceStreetNumber)

  //   }
  // }
  cifFormGroup: FormGroup = new FormGroup({
    fullName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(35)])),
    genderCode: new FormControl('', Validators.required),

    perDocType: new FormControl('', Validators.required),
    perDocNo: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
    issuedPlace: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
    issuedDate: new FormControl('', Validators.compose([Validators.required, futureDate])),
    expiredDate: new FormControl('', Validators.compose([Validators.required, pastDate])),

    perDocType2: new FormControl(''),
    perDocNo2: new FormControl(''),
    issuedPlace2: new FormControl(''),
    issuedDate2: new FormControl(''),
    expiredDate2: new FormControl(''),

    perDocType3: new FormControl(''),
    perDocNo3: new FormControl(''),
    issuedPlace3: new FormControl(''),
    issuedDate3: new FormControl(''),
    expiredDate3: new FormControl(''),

    mobilePhone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    birthDate: new FormControl('', Validators.compose([Validators.required, futureDate])),
    residentStatus: new FormControl('1', Validators.required),
    profession: new FormControl(null, Validators.required),
    position: new FormControl('', Validators.required),
    workPlace: new FormControl(''),
    employeeId: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
    branchCode: new FormControl('', Validators.required),
    branchCodeActive: new FormControl(''),
    email: new FormControl('', [Validators.maxLength(100), Validators.email,
    Validators.pattern('^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$')
    ]),

    nationality: new FormControl('VN', Validators.required),
    nationality2: new FormControl(null),
    nationality3: new FormControl(null),
    nationality4: new FormControl(null),

    visaExemption: new FormControl(''),
    visaExpireDate: new FormControl(''),
    visaIssueDate: new FormControl(''),

    creditStatus: new FormControl('2'),
    payStatus: new FormControl(''),
    taxNumber: new FormControl(''),

    currentCountry: new FormControl('VN', Validators.required),
    currentProvince: new FormControl(null, Validators.required),
    currentDistrict: new FormControl(null, Validators.required),
    currentWards: new FormControl(null, Validators.required),
    currentAddress: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),

    permanentCountry: new FormControl('VN', Validators.required),
    permanentProvince: new FormControl(null, Validators.required),
    permanentDistrict: new FormControl(null, Validators.required),
    permanentWards: new FormControl(null, Validators.required),
    permanentAddress: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
    customerCategoryCode: new FormControl('INDIV'),
    customerTypeCode: new FormControl('INDIV'),
    fatcaCode:new FormControl(null),
    // add more field for group here

  }, {
    validators: [
      Bigger3Date('birthDate', 'issuedDate', 'expiredDate')
    ]
  })

}
