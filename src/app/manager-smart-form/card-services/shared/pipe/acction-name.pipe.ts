import { Pipe, PipeTransform } from '@angular/core';
import {
  EBS_ACTIONS_SEARCH,
  LOCK_STATUSES
} from '../constants/card-service-constants';

@Pipe({
  name: 'actionName',
})
export class ActionNamePipe implements PipeTransform {
  transform(item: any, ...args: unknown[]): unknown {
    if (!item) {
      return '';
    }

    if (LOCK_STATUSES.find((status) => status.code === item.actionCode)) {
      return 'Khóa thẻ';
    }
    const actionCode = item.ebsActionName || item.actionCode;
    const action = EBS_ACTIONS_SEARCH.find(
      (actionSearch) => actionSearch.code === actionCode
    );
    return action ? action.name : '';
  }
}
