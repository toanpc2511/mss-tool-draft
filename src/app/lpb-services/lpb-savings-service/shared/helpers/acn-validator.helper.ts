import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, timer, of } from 'rxjs';
import { switchMap, map, catchError, delay, first } from 'rxjs/operators';
import { FORM_VAL_ERRORS } from '../constants/common';
import { BasicSavingService } from '../services/basic-saving.service';
import { ExtendInfoService } from '../services/extend-info.service';
import { CO_OWNER } from '../models/saving-basic';

export class AcnValidatorHelper {
  static valid(
    basicSavingService: BasicSavingService,
    type: 'credit' | 'debit'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(800).pipe(
        switchMap(() =>
          basicSavingService.getAccountInfo(control.value.trim()).pipe(
            map((res) => {
              if (res && res.data?.[0]) {
                let error = null;
                const account = res.data[0];
                if (account.frozenStatus === 'Y') {
                  error = { [FORM_VAL_ERRORS.FROZEN]: true };
                }

                if (type === 'debit' && account.noDrStatus === 'Y') {
                  error = { [FORM_VAL_ERRORS.NO_DR]: true };
                }

                if (type === 'credit' && account.noCrStatus === 'Y') {
                  error = { [FORM_VAL_ERRORS.NO_CR]: true };
                }

                return error;
              } else {
                return { [FORM_VAL_ERRORS.NO_EXIST]: true };
              }
            }),
            catchError(() => {
              return of({ [FORM_VAL_ERRORS.NO_EXIST]: true });
            })
          )
        )
      );
    };
  }

  static validCoOwner(
    extendInfoService: ExtendInfoService,
    coOwner: CO_OWNER
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log(coOwner);

      return extendInfoService.coOwners.pipe(
        map((result) => {
          const ownershipRateAll = result.reduce((acc, item) => {
            if (!coOwner || coOwner?.index !== item.index) {
              return acc + (Number(item.ownershipRate) || 0);
            }
            return acc;
          }, 0);
          if (ownershipRateAll + Number(control.value) > 100) {
            return { [FORM_VAL_ERRORS.OUT_OF_BOUNDS]: true };
          }
          return null;
        }),
        catchError(() => {
          return of(null);
        }),
        first()
      );
    };
  }
}
