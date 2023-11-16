import {LpbDatatablePaymentConfig} from './LpbDatatablePaymentConfig';

export class LpbDatatableConfig {
  filterDefault?: string;
  defaultSort?: string;
  hasSelection?: boolean;
  hasNoIndex?: boolean;
  hasAddtionButton?: boolean;
  hasPaging?: boolean;
  hasRowClick?: boolean;
  hiddenActionColumn?: boolean;
  paymentConfig?: LpbDatatablePaymentConfig;
  isDisableRow?: (row) => boolean;
  rowBgColor?: (row) => string;
  disableCheck?: boolean;
  hiddenSetting?: boolean;
  buttonOther?: IButtonOther[];
  cccdPrint?: boolean;
}

export interface IButtonOther {
  icon: string;
  tooltip: string;
  action: (row) => boolean;
  isDisable?: (row) => boolean;
}

export interface ISearchConditions {
  property: string;
    operator: string;
    value: string;
}
