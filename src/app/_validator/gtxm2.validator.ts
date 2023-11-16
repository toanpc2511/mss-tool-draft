import {Directive, forwardRef, Injectable} from '@angular/core';
import {
  AsyncValidator,
  AbstractControl,
  NG_ASYNC_VALIDATORS,
  ValidationErrors
} from '@angular/forms';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {CommonService} from "../_services/common.service";

@Injectable({providedIn: 'root'})
export class Gtxm2Validator implements AsyncValidator {
  constructor(private commonService: CommonService) {
  }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const perDocTypeCode = ctrl.get('perDocType')?.value;
    const perDocNo = ctrl.get('perDocNo')?.value;

    // console.log(perDocTypeCode, perDocNo);
    if (!perDocTypeCode || !perDocNo) {
      return of(null);
    }
    // if (perDocTypeCode === perDocTypeCodeTemp && perDocNo === perDocNoTemp) {
    //   return of(null);
    // }
    return this.commonService.isExistIdentifyNumber(perDocTypeCode, perDocNo).pipe(
      map((response: any) => {
        // console.log(response);
        return response.items.length > 0 ? {isExist: true} : null;
      }),
      catchError(() => of(null))
    );
  }
}
