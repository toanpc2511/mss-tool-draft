import {IndividualConfig } from 'ngx-toastr'

export interface IActionToast {
  title: string;
  action: () => void;
}

export interface ICusToastrPakage extends IndividualConfig {
  payload?: IActionToast[]
}

export interface ISearchFilter {
  property: string,
  operator: string,
  value: string
}
