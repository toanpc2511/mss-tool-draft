import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import {
  CURRENCIES,
  FORM_VAL_ERRORS,
  PRODUCTS,
  PRODUCTS_TYPES,
  PRODUCTS_TYPE_CODES
} from '../../../constants/common';
import {
  FINALIZE_METHODS,
  FINALIZE_METHOD_CODE,
  TERMS,
  TERM_CODE,
  ctrlNames
} from '../../../constants/saving';
import { Term } from '../../../models/saving-basic';
import { BasicSavingService } from '../../../services/basic-saving.service';

@Component({
  selector: 'app-saving-account-info',
  templateUrl: './saving-account-info.component.html',
  styleUrls: [
    '../../../styles/common.scss',
    './saving-account-info.component.scss',
    '../../../styles/lpb-saving-form.scss',
  ],
})
export class SavingAccountInfoComponent implements OnInit {
  @Input() form: FormGroup;

  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  FORM_VAL_ERRORS = FORM_VAL_ERRORS;
  ctrlNames = ctrlNames.ACC;
  PRODUCTS_TYPES = PRODUCTS_TYPES;
  PRODUCTS = PRODUCTS;

  lstCurrencies = [];

  lstTermCode: { code: string; name: string }[] = TERMS;
  lstTerm: number[] = [];
  crrTermData: Term[] = [];
  lstFinalizeMethod = FINALIZE_METHODS;

  constructor(
    private datePipe: DatePipe,
    private basicSavingService: BasicSavingService
  ) {
    this.lstCurrencies = [
      {
        code: 'VND',
        label: 'VND',
      },
      {
        code: 'USD',
        label: 'USD',
      }
    ];
  }

  ngOnInit() {
    //#region handle collections of controls change including productType, curCode, term, termCode

    //#region watch change productType, curCode
    const watchChangeTermsCtrlNames = [
      this.ctrlNames.productType,
      this.ctrlNames.curCode,
    ];

    const termObs = watchChangeTermsCtrlNames.map((field) => {
      const crrVal = this.form.get(field).value;
      return this.form.get(field).valueChanges.pipe(startWith(<string>crrVal));
    });

    combineLatest(termObs).subscribe(([productType, curCode]) => {
      if (this.form.disabled) {
        return;
      }

      this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
      if (!(productType && curCode)) {
        return;
      }

      this.basicSavingService
        .getTerms({ curCode, productType })
        .subscribe((res) => {
          this.crrTermData = res.data;
          this.lstTermCode = TERMS.filter((termData) =>
            res.data.some((record) => termData.code === record.termCode)
          );
          this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
        });
    });
    //#endregion

    //#region watch change termCode
    this.form
      .get(this.ctrlNames.termCode)
      .valueChanges.subscribe((crrTermCode) => {
        if (this.form.disabled) {
          return;
        }

        if (!crrTermCode) {
          this.lstTerm = [];
          this.form.get(this.ctrlNames.term).setValue(null);
          return;
        }

        this.lstTerm = this.crrTermData.find(
          (data) => data.termCode === crrTermCode
        )?.terms;

        if (this.lstTerm) {
          const crrTerm = this.form.get(this.ctrlNames.termCode).value;
          if (!this.lstTerm?.includes(crrTerm)) {
            this.form.get(this.ctrlNames.term).setValue(null);
            return;
          }
        }
      });
    //#endregion

    //#region watch change term
    this.form
      .get(this.ctrlNames.term)
      .valueChanges.subscribe((crrTerm: number) => {
        if (this.form.disabled) {
          return;
        }

        const maturityDateCtrl = this.form.get(this.ctrlNames.maturityDate);
        const startDateCtrl = this.form.get(this.ctrlNames.startDate);
        const termCodeCtrl = this.form.get(this.ctrlNames.termCode);

        if (!crrTerm) {
          maturityDateCtrl.setValue(null);
          return;
        }

        const crrTermCode = termCodeCtrl.value;
        let startDate = DateHelper.getDateFromString(startDateCtrl.value);
        let maturityDate = new Date();

        switch (crrTermCode) {
          case TERM_CODE.WEEK: {
            maturityDate.setDate(startDate.getDate() + crrTerm * 7);
            break;
          }

          case TERM_CODE.MONTH: {
            maturityDate = startDate;
            let maturityMonth = startDate.getMonth() + crrTerm;
            if (maturityMonth > 12) {
              maturityDate.setFullYear(
                startDate.getFullYear() + Math.floor(maturityMonth / 12)
              );
              maturityMonth = maturityMonth % 12;
            }
            maturityDate.setMonth(maturityMonth);
            break;
          }
        }
        maturityDateCtrl.setValue(
          this.datePipe.transform(maturityDate, 'dd/MM/yyyy')
        );
      });
    //#endregion

    //#endregion

    //#region watch change curCode, depositAmount to validate
    const validateAmountCtrlNames = [
      this.ctrlNames.depositAmount,
      this.ctrlNames.curCode,
    ];

    const validateObs = validateAmountCtrlNames.map((field) =>
      this.form.get(field).valueChanges.pipe(startWith(<string>null))
    );
    combineLatest(validateObs).subscribe(([depositAmount, curCode]) => {
      const checkVND = curCode === CURRENCIES.VND && depositAmount < 500000;
      const checkUSD = curCode === CURRENCIES.USD && depositAmount < 50;

      if (checkVND || checkUSD) {
        FormHelpers.setFormError({
          control: this.form.get(this.ctrlNames.depositAmount),
          errorName: FORM_VAL_ERRORS.BELOW_MIN,
        });
      } else {
        FormHelpers.clearFormError({
          control: this.form.get(this.ctrlNames.depositAmount),
          errorName: FORM_VAL_ERRORS.BELOW_MIN,
        });
      }
    });
    //#endregion

    //#region watch change curCode, term, termCode to update note
    const watchChangeNoteCtrlNames = [
      this.ctrlNames.curCode,
      this.ctrlNames.termCode,
      this.ctrlNames.term,
    ];

    const noteObs = watchChangeNoteCtrlNames.map((field) => {
      const crrVal = this.form.get(field).value;
      return this.form.get(field).valueChanges.pipe(startWith(<string>crrVal));
    });

    combineLatest(noteObs).subscribe(([curCode, termCode, term]) => {
       if(this.form.disabled){
        return;
       }

       let note = 'Gửi tiết kiệm';
       const termName = TERMS.find((term) => term.code === termCode)?.name;
       note = `${note} ${term || ''} ${termName || ''} ${curCode || ''}`;

       this.form.get(this.ctrlNames.note).setValue(note);
    })
    //#endregion
  }

  changeProductType(value: string) {
    const rollOverPrincipalOnly = FINALIZE_METHODS.filter(
      (method) => method.code === FINALIZE_METHOD_CODE.ROLL_OVER_PRINCIPAL
    );

    switch (value) {
      case PRODUCTS_TYPE_CODES.MATURITY_INTEREST: {
        this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
        this.lstFinalizeMethod = FINALIZE_METHODS;
        break;
      }

      case PRODUCTS_TYPE_CODES.UPFRONT_INTEREST: {
        this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
        this.form.get(this.ctrlNames.finalizeMethod).setValue(null);
        this.lstFinalizeMethod = rollOverPrincipalOnly;
        break;
      }

      case PRODUCTS_TYPE_CODES.MONTHLY_INTEREST: {
        this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
        this.form.get(this.ctrlNames.finalizeMethod).setValue(null);
        this.lstFinalizeMethod = rollOverPrincipalOnly;
        break;
      }

      case PRODUCTS_TYPE_CODES.QUARTERLY_INTEREST: {
        this.form.get(this.ctrlNames.termCode).setValue(TERM_CODE.MONTH);
        this.form.get(this.ctrlNames.finalizeMethod).setValue(null);
        this.lstFinalizeMethod = rollOverPrincipalOnly;
        break;
      }

      default: {
        this.lstFinalizeMethod = FINALIZE_METHODS;
      }
    }
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
