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
export class PhoneValidator implements AsyncValidator {
    constructor(private commonService: CommonService) {
    }

    validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

        const phone = ctrl.get('mobileNo')?.value;

        if (!phone) {
            return this.commonService.isExistPhoneNumber(phone).pipe(
                map((response: any) => {
                    // console.log(response);
                    // console.log(response.items);
                    return response.items.length > 0 ? { isExist: true } : null;

                }),
                catchError(() => of(null))
            );
        }
    }
}
