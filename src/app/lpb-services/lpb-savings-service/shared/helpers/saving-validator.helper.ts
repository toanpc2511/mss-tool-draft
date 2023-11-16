import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class SavingValidatorHelper {
  static validAmountReceived(totalCtrl: AbstractControl): ValidatorFn {
    return (formArray: FormArray): ValidationErrors | null => {
      try {
        const totalValue = Number(totalCtrl.value);
        const totalSubValue = formArray.getRawValue()?.reduce((acc, cur) => {
          return acc + (Number(cur.amount) || 0);
        }, 0);

        if (totalValue < totalSubValue) {
          return {
            inValidAmountReceived: true,
          };
        }

        if (totalValue !== totalSubValue) {
          return {
            inValidAmountReceivedCount: true,
          };
        }
        return;
      } catch (error) {
        return;
      }
    };
  }
  static validAmountPercentReceived(
    formArray: FormArray
  ): ValidationErrors | null {
    try {
      const totalSubValue = formArray.getRawValue()?.reduce((acc, cur) => {
        return acc + (Number(cur.amountPercent) || 0);
      }, 0);
      console.log();
      if (totalSubValue !== 100) {
        return {
          inValidAmountPercentReceived: true,
        };
      }
      return;
    } catch (error) {
      return;
    }
  }
}
