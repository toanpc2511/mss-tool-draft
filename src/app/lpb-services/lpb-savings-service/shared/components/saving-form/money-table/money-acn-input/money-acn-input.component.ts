import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BasicSavingService } from '../../../../services/basic-saving.service';
import { Account } from 'src/app/shared/models/common.interface';
import { FORM_VAL_ERRORS } from '../../../../constants/common';
import {
  FormControlWarn,
  FormHelpers,
} from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-money-acn-input',
  templateUrl: './money-acn-input.component.html',
  styleUrls: ['./money-acn-input.component.scss'],
})
export class MoneyAcnInputComponent implements OnInit {
  @Input() control: FormControlWarn;
  @Input() type: 'deposit' | 'receipt';

  constructor(private basicSavingService: BasicSavingService) {}

  warningName = null;
  errorName = null;
  parent: FormGroup;

  ngOnInit() {
    this.parent = this.control.parent as FormGroup;

    this.control.statusChanges.subscribe((status) => {
      if (status === 'INVALID') {
        this.control.warnings = {};
      }
    });
  }

  validateAcn(account: Account): void {
    if (!account) {
      FormHelpers.setFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.NO_EXIST,
      });
    } else {
      FormHelpers.clearFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.NO_EXIST,
      });
    }

    if (this.type === 'deposit' && account.noDrStatus === 'Y') {
      FormHelpers.setFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.NO_DR,
      });
    } else {
      FormHelpers.clearFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.NO_DR,
      });
    }

    if (this.type === 'receipt' && account.noCrStatus === 'Y') {
      FormHelpers.setFormWarning({
        control: this.control,
        warningName: FORM_VAL_ERRORS.NO_CR,
      });
    } else {
      FormHelpers.clearFormWarning({
        control: this.control,
        warningName: FORM_VAL_ERRORS.NO_CR,
      });
    }

    if (this.type === 'deposit' && account.frozenStatus === 'Y') {
      FormHelpers.setFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.FROZEN,
      });
    } else {
      FormHelpers.clearFormError({
        control: this.control,
        errorName: FORM_VAL_ERRORS.FROZEN,
      });
    }

    if (this.type === 'receipt' && account.frozenStatus === 'Y') {
      FormHelpers.setFormWarning({
        control: this.control,
        warningName: FORM_VAL_ERRORS.FROZEN,
      });
    } else {
      FormHelpers.clearFormWarning({
        control: this.control,
        warningName: FORM_VAL_ERRORS.FROZEN,
      });
    }
  }

  blurChangeAcn(event: { target: HTMLInputElement }) {
    const acn = event.target.value?.trim();
    if (acn && !this.control.hasError(FORM_VAL_ERRORS.MIN_LENGTH)) {
      this.basicSavingService.getAccountInfo(acn).subscribe(
        (res) => {
          const account = res.data[0];
          this.validateAcn(account);

          this.parent.get('curCode').setValue(account.curCode);
          this.parent.get('branchCode').setValue(account.accountBranchCode);
        },
        (error) => {
          FormHelpers.setFormError({
            control: this.control,
            errorName: FORM_VAL_ERRORS.NO_EXIST,
          });
        }
      );
    }
  }

  inputChangeAcn(event: { target: HTMLInputElement }) {
    const acn = event.target.value?.trim();
    if(!acn){
      this.parent.get('curCode').setValue(null);
      this.parent.get('branchCode').setValue(null);
    }
  }
}
