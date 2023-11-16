import { Pipe, PipeTransform } from '@angular/core';
import {
  ACCOUNT_STATUS,
  CUSTOMER_STATUS,
  CUSTOMER_TYPE,
  DOC_TYPE,
  LV24_STATUS_VI,
  USER_STATUS,
} from '../constants/common';

export const LV24_PROFILE_STATUS = {
  CUSTOMER_STATUS: 'CUSTOMER_STATUS',
  ACCOUNT_STATUS: 'ACCOUNT_STATUS',
  USER_STATUS: 'USER_STATUS',
  DOC_TYPE: 'DOC_TYPE',
  CUSTOMER_TYPE: 'CUSTOMER_TYPE',
};
@Pipe({
  name: 'LVL24ProfileStatusVi',
})
export class ParseLVL24ProfileStatusCodeToVI implements PipeTransform {
  transform(code: string, status?: string): string {
    if (!status) {
      return LV24_STATUS_VI[code];
    }
    switch (status) {
      case LV24_PROFILE_STATUS.CUSTOMER_STATUS:
        return CUSTOMER_STATUS[code];
      case LV24_PROFILE_STATUS.ACCOUNT_STATUS:
        return ACCOUNT_STATUS[code];
      case LV24_PROFILE_STATUS.USER_STATUS:
        return USER_STATUS[code];
      case LV24_PROFILE_STATUS.DOC_TYPE:
        return DOC_TYPE[code];
      case LV24_PROFILE_STATUS.CUSTOMER_TYPE:
        return CUSTOMER_TYPE[code];
      default:
        return code;
    }
  }
}
