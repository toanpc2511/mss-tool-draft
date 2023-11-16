import { AbstractControl } from '@angular/forms';
import { merge } from 'rxjs';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { TextHelper } from 'src/app/shared/utilites/text';
import { DOC_TYPES, NO_EMIT, USER_INFO } from '../constants/common';

export class FormSavingHelpers {
  static setPlaceByDoc({
    docTypeControl,
    issueDateControl,
    issuePlaceControl,
  }: {
    docTypeControl: AbstractControl;
    issueDateControl: AbstractControl;
    issuePlaceControl: AbstractControl;
  }): void {
    merge(docTypeControl.valueChanges, issueDateControl.valueChanges).subscribe(
      () => {
        const docTypeValue = docTypeControl.value;
        const issueDateValue = issueDateControl.value;

        if (!docTypeValue || !issueDateValue) {
          return;
        }
        let issuePlaceValue = '';
        switch (docTypeValue) {
          case DOC_TYPES.CCCD:
            const lowDate = DateHelper.getDateFromString('01/01/2016');
            const highDate = DateHelper.getDateFromString('10/10/2018');
            const issueDate = DateHelper.getDateFromString(issueDateValue);

            if (issueDate >= lowDate && issueDate < highDate) {
              issuePlaceValue = 'CCS ĐKQL CT VA DLQG VE DC';
            } else if (issueDate >= highDate) {
              issuePlaceValue = 'CCS QLHC VE TTXH';
            }
            break;
          case DOC_TYPES.CMND:
            issuePlaceValue = TextHelper.latinNormalize(
              `CONG AN ${USER_INFO()?.cityName}`
            )?.toUpperCase();
            break;
          case DOC_TYPES.PASSPORT:
            issuePlaceValue = `CUC QUAN LY XNC`;
            break;
          default:
            break;
        }

        issuePlaceControl.patchValue(issuePlaceValue, NO_EMIT);
      }
    );
  }
  static patchValue(params: { control: AbstractControl; value: any }[]) {
    params?.forEach((e) => {
      e.control.patchValue(e.value, NO_EMIT);
    });
  }
}
