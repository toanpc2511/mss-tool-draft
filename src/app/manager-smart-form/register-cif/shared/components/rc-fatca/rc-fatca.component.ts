import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { fatcaFormList, typeFatcaList } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-rc-fatca',
  templateUrl: './rc-fatca.component.html',
  styleUrls: ['./rc-fatca.component.scss']
})
export class RcFatcaComponent implements OnInit, OnChanges {
  @Input() inpNationality = 'VN';
  checkedFatca = false;
  isRequiredFatca = false; // biến bắt buộc nhập Fatca
  lstTypeFatca = typeFatcaList; // danh mục Fatca
  lstFatcaForm = fatcaFormList; // mẫu biểu bổ sung
  fatcaCode;
  @ViewChild('fatcaType', { static: true }) fatcaType: ElementRef;
  @ViewChild('fatcaForm', { static: true }) fatcaForm: ElementRef;
  errMsgFatcaCode = '';
  errMsgFatcaType = '';
  errMsgFatcaForm = '';
  errMsgFatcaBlock = '';
  hiddenFatcaAnswer: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inpNationality && changes.inpNationality.currentValue) {
      this.nationlityChange();
      this.validateFatcaByNational();
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
  validateFatcaCode(): void {
    this.errMsgFatcaCode = '';
    if (this.hiddenFatcaAnswer === 'US PERSON') {
      if (!this.fatcaCode || this.fatcaCode === '' || this.fatcaCode === null) {
        this.errMsgFatcaCode = 'Mã số thuế không được để trống';
        return;
      }
      if (this.fatcaCode.length !== 9) {
        this.errMsgFatcaCode = 'Mã số thuế phải là 9 ký tự số';
        return;
      }
      if (isNaN(this.fatcaCode)) {
        this.errMsgFatcaCode = 'Mã số thuế chỉ được nhập số';
        return;
      }
    }
    return;
  }
  changeFatcaCode(): void {
    this.validateTypeFatca();
    this.hiddenFatcaAnswer = this.fatcaType.nativeElement.value;
    this.validateFatcaCode();
  }
  validateTypeFatca(): void {
    this.errMsgFatcaType = '';
    if (this.fatcaType.nativeElement.value === '') {
      this.errMsgFatcaType = 'Loại Fatca không được để trống';
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
    this.validateFatcaCode();
    this.validateTypeFatca();
    this.validateFormFatca();
    if (this.errMsgFatcaCode === '' && this.errMsgFatcaType === '' && this.errMsgFatcaForm === ''
      && this.checkedFatca && this.errMsgFatcaBlock === '') {
      fatca = {
        fatcaType: this.fatcaType.nativeElement.value,
        fatcaCode: this.fatcaCode ? this.fatcaCode : null,
        fatcaForm: this.fatcaForm.nativeElement.value,
        checkedFatca: this.checkedFatca
      };
    } else {
      fatca = {
        fatcaType: null,
        checkedFatca: this.checkedFatca
      };
    }
    return fatca;
  }
}
