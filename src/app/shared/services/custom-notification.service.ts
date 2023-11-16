import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {CustomToastComponent} from './../components/cusom-toast/custom-toast.component';
import {IActionToast} from './../models/shared.interface';

interface Meta {
  code: string | number;
  errors: [
    {
      description: string;
      field: string;
    }
  ];
  message: string;
  page: 0;
  size: 0;
  total: 0;
}

@Injectable({
  providedIn: 'root',
})
export class CustomNotificationService {
  optionToast: any = {
    disableTimeOut: false,
    tapToDismiss: false,
    timeOut: 5000,
    closeButton: true,
    onActivateTick: true,
    positionClass: 'toast-top-right',
    toastComponent: CustomToastComponent,
  };

  constructor(private toastr: ToastrService) {
  }

  error(title: string, message: string, actions?: IActionToast[]): void {
    this.toastr.error(message, title, {
      ...this.optionToast,
      disableTimeOut: true,
      toastClass: ' border-error',
      payload: actions,
    });
  }

  success(title: string, message: string, actions?: IActionToast[]): void {
    this.toastr.success(message, title, {
      ...this.optionToast,
      toastClass: ' border-success',
      payload: actions,
    });
  }

  warning(title: string, message: string, actions?: IActionToast[]): void {
    this.toastr.warning(message, title, {
      ...this.optionToast,
      toastClass: ' border-warning',
      payload: actions,
    });
  }

  handleErrors(
    error?: { code: string; message?: string },
    {
      title = 'Thông báo',
      message = 'Có lỗi xảy ra xin vui lòng thử lại',
      actions,
    }: {
      title: string;
      message: string;
      actions?: IActionToast[];
    } = {
      title: 'Thông báo',
      message: 'Có lỗi xảy ra xin vui lòng thử lại',
    }
  ): void {
    if (actions) {
      this.error(title, error.message || message, actions);
    } else {
      this.error(title, error.message || message);
    }
  }

  handleResponse(response): void {
    console.log('response.meta?.code.includes(\'200\')', response.meta?.code.includes('200'));
    if (response.meta?.code.split('-')[2] === '200' || response.meta?.code.includes('200')) {
      this.success('Thông báo', response.meta?.message);
    } else {
      if (response.meta?.code) {
        this.error('Lỗi', response.meta?.message);
      }

    }
  }
}
