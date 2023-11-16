import { Directive, forwardRef, Injectable } from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CommonService } from '../_services/common.service';
import { GlobalConstant } from '../_utils/GlobalConstant';

@Injectable({ providedIn: 'root' })
export class GtxmValidator implements AsyncValidator {
  constructor(private commonService: CommonService) {
  }

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const perDocTypeCode = ctrl.get('perDocTypeCode')?.value;
    const perDocTypeCodeTemp = ctrl.get('perDocTypeCodeTemp')?.value;
    const perDocNo = ctrl.get('perDocNo')?.value;
    const perDocNoTemp = ctrl.get('perDocNoTemp')?.value;

    if (!perDocTypeCode || !perDocNo) {
      return of(null);
    }

    if (perDocTypeCode === perDocTypeCodeTemp && perDocNo === perDocNoTemp) {
      return of(null);
    }

    return this.commonService.isExistIdentifyNumber(perDocTypeCode, perDocNo).pipe(
      map((response: any) => {
        // console.log(response);
        // console.log(response.items);
        return response.items.length > 0 ? { isExist: true } : null;

      }),
      catchError(() => of(null))
    );
  }
}
