import {
  IActionToast,
  ICusToastrPakage,
} from './../../models/shared.interface';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

@Component({
  selector: '[custom-toast-component]',
  styleUrls: [`./custom-toast.component.scss`],
  templateUrl: `./custom-toast.component.html`,
  animations: [
    trigger('flyInOut', [
      state(
        'inactive',
        style({
          display: 'none',
          opacity: 0,
        })
      ),
      transition(
        'inactive => active',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              opacity: 0,
            }),
            style({
              opacity: 1,
            }),
          ])
        )
      ),
      transition(
        'active => removed',
        animate(
          '400ms ease-out',
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              transform: 'translate3d(10%, 0, 0) skewX(10deg)',
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
  preserveWhitespaces: false,
})
export class CustomToastComponent extends Toast implements OnInit {
  typeToast: string;
  actions: IActionToast[] = [];

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
    this.actions = (this.toastPackage.config as ICusToastrPakage).payload;
    this.typeToast = this.toastPackage.toastType;
  }

  ngOnInit(): void {}
}
