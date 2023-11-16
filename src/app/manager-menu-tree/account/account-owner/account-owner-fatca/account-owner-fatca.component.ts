import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { fatcaFormList, typeFatcaList } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-account-owner-fatca',
  templateUrl: './account-owner-fatca.component.html',
  styleUrls: ['./account-owner-fatca.component.scss']
})
export class AccountOwnFatcaComponent implements OnInit, OnChanges {
  @Input() inpNationality = 'VN';
  @Input() isExistCore: any;
  @Input() fatcaObject;
  checkedFatca = false;
  isRequiredFatca = false; // biến bắt buộc nhập Fatca
  lstTypeFatca = typeFatcaList; // danh mục Fatca
  lstFatcaForm = fatcaFormList; // mẫu biểu bổ sung
  fatcaAnswer;
  @ViewChild('fatcaCode', { static: true }) fatcaCode: ElementRef;
  @ViewChild('fatcaForm', { static: true }) fatcaForm: ElementRef;
  errMsgfatcaAnswer = '';
  errMsgFatcaCode = '';
  errMsgFatcaType = '';
  errMsgFatcaForm = '';
  errMsgFatcaBlock = '';
  errMsgBlockFatca = '';
  hiddenFatcaAnswer: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inpNationality && changes.inpNationality.currentValue) {
      this.nationlityChange();
      this.validateFatcaByNational();
    }
    if (changes.fatcaObject) {
      this.initFormFatca();
      this.changeFatcaCode();
    }
  }
  initFormFatca(): void {
    if (this.fatcaObject) {
      this.checkedFatca = true;
      this.fatcaCode.nativeElement.value = this.fatcaObject.fatcaCode;
      this.fatcaAnswer = this.fatcaObject.fatcaAnswer;
      this.fatcaForm.nativeElement.value = this.fatcaObject.fatcaForm;
    }
  }
  nationlityChange(): void {
    // gán giá trị radio button
    this.inpNationality === 'AS' || this.inpNationality === 'US' ? this.checkedFatca = true : this.checkedFatca = false;
    this.inpNationality === 'AS' || this.inpNationality === 'US' ? this.isRequiredFatca = true : this.isRequiredFatca = false;
  }
  checkFormFatca(): void {
    this.errMsgFatcaCode = '';
    this.errMsgFatcaType = '';
    this.errMsgFatcaForm = '';
    this.validateFatcaByNational();
  }
  validateFatcaByNational(): void {
    this.errMsgFatcaBlock = '';
    if ((this.inpNationality === 'AS' || this.inpNationality === 'US') && this.checkedFatca === false) {
      this.errMsgFatcaBlock = 'Công dân là Quốc tịch Mỹ Không được trống Fatca';
    }
  }
  ngOnInit(): void {
  }
  validatefatcaAnswer(): void {
    this.errMsgfatcaAnswer = '';
    if (this.hiddenFatcaAnswer === 'US PERSON') {
      if (!this.fatcaAnswer || this.fatcaAnswer === '' || this.fatcaAnswer === null) {
        this.errMsgfatcaAnswer = 'Mã số thuế không được để trống';
        return;
      }
      if (this.fatcaAnswer.length !== 9) {
        this.errMsgfatcaAnswer = 'Mã số thuế phải là 9 ký tự số';
        return;
      }
      if (isNaN(this.fatcaAnswer)) {
        this.errMsgfatcaAnswer = 'Mã số thuế chỉ được nhập số';
        return;
      }
    }
    return;
  }
  changeFatcaCode(): void {
    this.validateFormFatca();
    this.hiddenFatcaAnswer = this.fatcaCode.nativeElement.value;
    this.fatcaAnswer = (this.hiddenFatcaAnswer === 'US PERSON' ? this.fatcaAnswer : '');
  }
  validateTypeFatca(): void {
    this.errMsgFatcaCode = '';
    if (this.fatcaCode.nativeElement.value === '') {
      this.errMsgFatcaCode = 'Loại Fatca không được để trống';
      return;
    }
  }
  validateFormFatca(): void {
    this.errMsgFatcaForm = '';
    if (this.fatcaForm.nativeElement.value === '') {
      this.errMsgFatcaForm = 'Mẫu biểu bổ sung không được để trống';
      return;
    }
  }
  getFATCAform(): any {
    let fatca = null;
    this.validatefatcaAnswer();
    this.validateTypeFatca();
    this.validateFormFatca();
    this.validateBlockFatcaByNational();
    if (this.errMsgfatcaAnswer === '' && this.errMsgFatcaCode === '' && this.errMsgFatcaForm === '' && this.checkedFatca) {
      fatca = {
        fatcaCode: this.fatcaCode.nativeElement.value ? this.fatcaCode.nativeElement.value : '',
        fatcaAnswer: this.fatcaAnswer ? this.fatcaAnswer : '',
        fatcaForm: this.fatcaForm.nativeElement.value ? this.fatcaForm.nativeElement.value : '',
        checkedFatca: this.checkedFatca
      };
    } else {
      fatca = {
        fatcaCode: null,
        checkedFatca: this.checkedFatca
      };
    }
    return fatca;
  }

  validateBlockFatcaByNational(): void {
    this.errMsgBlockFatca = '';
    if (this.inpNationality === 'US' && !this.checkedFatca) {
      this.errMsgBlockFatca = 'Với Quốc tịch Mỹ bắt buộc nhập thông tin khối Fatca';
    }
  }
}
