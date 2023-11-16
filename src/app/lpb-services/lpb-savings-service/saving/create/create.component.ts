import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LpbFooterComponent } from 'src/app/shared/components/lpb-footer/lpb-footer.component';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import {
  ValidatorHelper,
  viRegStr,
} from 'src/app/shared/utilites/validators.helper';
import { SavingFormComponent } from '../../shared/components/saving-form/saving-form.component';
import { DOC_TYPES, PRODUCTS_CODES } from '../../shared/constants/common';
import { MoneyListFormService } from '../../shared/services/money-list-form.service';
import { SavingFormService } from '../../shared/services/saving-form.service';
import { ExtendInfoService } from '../../shared/services/extend-info.service';
import { AUTHORIZED_PERSON, CO_OWNER } from '../../shared/models/saving-basic';
import { UDF } from '../../shared/models/saving-basic';
import { TERM_CODE } from '../../shared/constants/saving';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  createForm: FormGroup;
  actions: ActionModel[];
  openAllCollapse = 0;

  extendInfos: {
    coOwners: CO_OWNER[];
    authorizedPersons: AUTHORIZED_PERSON[];
    udf: UDF;
  };

  @ViewChild(SavingFormComponent) savingForm: SavingFormComponent;
  @ViewChild(LpbFooterComponent) footer: LpbFooterComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private moneyListFormService: MoneyListFormService,
    private savingFormService: SavingFormService,
    private extendInfoService: ExtendInfoService
  ) {
    this.actions = [
      {
        actionIcon: 'print',
        actionName: 'In biểu mẫu',
        actionClick: () => {},
        hiddenType: 'disable',
      },
      {
        actionIcon: 'print',
        actionName: 'In STK',
        actionClick: () => {},
        hiddenType: 'disable',
      },
      {
        actionIcon: 'save',
        actionName: 'Lưu thông tin',
        actionClick: () => this.onSave(),
      },
      {
        actionIcon: 'send',
        actionName: 'Gửi duyệt',
        actionClick: () => {},
        hiddenType: 'disable',
      },
      {
        actionIcon: 'edit',
        actionName: 'Sửa',
        actionClick: () => {},
        hiddenType: 'disable',
      },
      {
        actionIcon: 'delete',
        actionName: 'Xóa',
        actionClick: () => {},
        hiddenType: 'disable',
      },
      {
        actionIcon: 'keyboard_backspace',
        actionName: 'Quay lại',
        actionClick: () =>
          this.router.navigate(['../'], { relativeTo: this.activatedRoute }),
      },
    ];
  }

  ngOnInit() {
    BreadCrumbHelper.setBreadCrumb(['Dịch vụ tài chính', '']);
    this.initForm();
    this.getExtendInfos();

    this.extendInfoService.setLegalRepresentative(legalRepresentative);
  }
  ngOnDestroy(): void {
    this.extendInfoService.clearAll();
  }

  initForm() {
    const crrDateStr = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    this.createForm = this.fb.group({
      sender: this.fb.group({
        senderCif: [null, ValidatorHelper.required],
        senderDocNum: [null, ValidatorHelper.required],
        senderDocType: [{ value: DOC_TYPES.CCCD, disabled: true }],
        senderFullName: [null],
      }),

      account: this.fb.group({
        productCode: [{ value: PRODUCTS_CODES.BASIC, disabled: true }],
        productType: [null, Validators.required],
        classCode: [{ value: null, disabled: true }],
        interestRate: [{ value: null, disabled: true }],
        curCode: [null, Validators.required],
        serialNo: [null, Validators.required],
        forecastInterest: [{ value: null, disabled: true }],
        termCode: [TERM_CODE.MONTH, Validators.required],
        term: [null, Validators.required],
        acn: [{ value: null, disabled: true }],
        finalizeMethod: [null, Validators.required],
        startDate: [{ value: crrDateStr, disabled: true }, Validators.required],
        maturityDate: [{ value: null, disabled: true }, Validators.required],
        depositAmount: [null, Validators.required],
        note: [
          '',
          [
            ValidatorHelper.required,
            Validators.pattern(`^([A-Za-z0-9-,./\\s]|[${viRegStr()}])+$`),
          ],
        ],
      }),

      moneyList: this.moneyListFormService.getDefaultMoneyList(),
    });

    this.savingFormService.setSavingAccountCurCodeControl(
      this.createForm.get('account').get('curCode')
    );

    this.createForm.addControl(
      'depositArr',
      this.savingFormService.getDefaultDepositFormArray()
    );
    this.createForm.addControl(
      'receiptArr',
      this.savingFormService.getDefaultReceiptFormArray()
    );
  }

  getExtendInfos() {
    this.extendInfoService.savingExtendInfo.subscribe((extendInfos) => {
      this.extendInfos = extendInfos;
      console.log('extendInfos', extendInfos);
    });
  }

  onSave(): void {
    if (this.savingForm.validate()) {
      const formValues = FormHelpers.trimValues(this.createForm.getRawValue());
      console.log('formValues', formValues);
      console.log('extendInfos', this.extendInfos);
    }
  }
}

var legalRepresentative = [
  {
    cifNo: '123456789',
    fullName: 'Nguyễn Thị Lan Anh',
    birthDate: '12/05/1998',
    docNum: '00123456789',
    docType: 'CAN CUOC CONG DAN',
    issueDate: '01/01/2018',
    issuePlace: 'Hà Nam',
    visaExemption: true,
    hasExpiration: false,
    fromDate: '01/01/2018',
    toDate: '31/12/2027',
    currentAddress:
      'Số 12, đường Trần Hưng Đạo, thị trấn Vĩnh Trụ, huyện Lý Nhân, tỉnh Hà Nam',
    permanentAddress:
      'Số 12, đường Trần Hưng Đạo, thị trấn Vĩnh Trụ, huyện Lý Nhân, tỉnh Hà Nam',
    nationality: 'Việt Nam',
    mobilePhone: '0987654321',
    homePhone: '0351234567',
    email: 'lananh@gmail.com',
    occupation: 'Giáo viên',
    position: 'Giáo viên tiểu học',
    relation: 'sister',
    otherRelation: 'sister',
    legalDocument: 'Giấy chứng nhận giáo viên',
    guardianType: 'Giám hộ loại A',
  },
  {
    cifNo: '987654321',
    fullName: 'Phan Văn Minh',
    birthDate: '25/10/1995',
    docNum: 'AA123456789',
    docType: 'HO CHIEU',
    issueDate: '15/07/2019',
    issuePlace: 'Hà Nội',
    visaExemption: false,
    hasExpiration: true,
    fromDate: '01/08/2021',
    toDate: '31/07/2022',
    currentAddress:
      'Số 34, ngõ 56, đường Lê Duẩn, quận Hoàn Kiếm, thành phố Hà Nội',
    permanentAddress:
      'Số 34, ngõ 56, đường Lê Duẩn, quận Hoàn Kiếm, thành phố Hà Nội',
    nationality: 'Việt Nam',
    mobilePhone: '0123456789',
    homePhone: '0123456789',
    email: 'minhphan@gmail.com',
    occupation: 'Kỹ sư',
    position: 'Kỹ sư cầu đường',
    relation: 'sister',
    otherRelation: 'sister',
    legalDocument: 'Giấy chứng nhận kỹ sư',
    guardianType: 'Giám hộ loại B',
  },
  {
    cifNo: '456789123',
    fullName: 'Lê Thị Kim Oanh',
    birthDate: '03/03/2000',
    docNum: '1234567890',
    docType: 'CHUNG MINH NHAN DAN',
    issueDate: '05/05/2015',
    issuePlace: 'TP. Hồ Chí Minh',
    visaExemption: true,
    hasExpiration: false,
    fromDate: '05/05/2015',
    toDate: '04/05/2025',
    currentAddress:
      'Số 67, đường Nguyễn Thị Minh Khai, phường Bến Thành, quận 1, TP. Hồ Chí Minh',
    permanentAddress:
      'Số 67, đường Nguyễn Thị Minh Khai, phường Bến Thành, quận 1, TP. Hồ Chí Minh',
    nationality: 'Việt Nam',
    mobilePhone: '0909090909',
    homePhone: '0909090909',
    email: 'kimoanh@gmail.com',
    occupation: 'Sinh viên',
    position: 'Sinh viên năm thứ hai',
    relation: 'sister',
    otherRelation: 'sister',
    legalDocument: 'Giấy chứng nhận sinh viên',
    guardianType: 'Giám hộ loại C',
  },
];
