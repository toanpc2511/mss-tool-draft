import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { CustomerUserInfo } from '../../models/common';
import { LV24Service } from '../../services/lv24.service';

@Component({
  selector: 'app-customer-user-info-form',
  templateUrl: './customer-user-info-form.component.html',
  styleUrls: [
    './customer-user-info-form.component.scss',
    '../../styles/common.scss',
  ],
})
export class CustomerUserInfoFormComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() form: FormGroup;

  @Input() isDetail: boolean = false;

  @Input() customerUserInfo: CustomerUserInfo;
  @Output('customerUserInfoChange') customerUserInfoChange =
    new EventEmitter<CustomerUserInfo>();

  newCustomerUserInfo: CustomerUserInfo;

  @Input() isSearchCustomerUserInfo = false;
  @Output('isSearchCustomerUserInfoChange') isSearchCustomerUserInfoChange =
    new EventEmitter<boolean>(false);

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    REQUIRED_ONE_IN_TWO: 'requiredOneInTwo',
    NO_EXIST: 'noExist',
    MAX_LENGTH: 'maxlength',
  };

  @Input() sortedInfos: any;

  constructor(
    private lv24Service: LV24Service,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const { customerUserInfo, sortedInfos } = changes;
    this.newCustomerUserInfo = { ...customerUserInfo?.currentValue } || {
      ...this.customerUserInfo,
    };

    if (customerUserInfo || sortedInfos) {
      if (this.customerUserInfo && this.sortedInfos) {
        this.sortedInfos
          .flatMap((a) => a)
          .forEach(({ code, transform }) => {
            if (transform) {
              this.newCustomerUserInfo[code] = transform(
                this.newCustomerUserInfo[code]
              );
            }
          });
      }
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getCustomerUserInfo(
    controlName: 'docNum' | 'phoneNumber',
    txtSearch: string
  ): void {
    const control = this.form.get(controlName);
    this.isSearchCustomerUserInfoChange.emit(true);
    this.customerUserInfoChange.emit(null);

    this.lv24Service
      .getCustomerUserInfo({ input: controlName, txtSearch })
      .pipe(
        finalize(() => {
          this.isSearchCustomerUserInfoChange.emit(false);
        })
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.form.patchValue(res.data);
            this.customerUserInfoChange.emit(res.data);
            FormHelpers.clearFormError({
              control: control,
              errorName: this.FORM_VAL_ERRORS.NO_EXIST,
            });
          } else {
            FormHelpers.setFormError({
              control: control,
              errorName: this.FORM_VAL_ERRORS.NO_EXIST,
            });
            this.clearControl(controlName);
          }
        },
        (error) => {
          this.clearControl(controlName);
          FormHelpers.setFormError({
            control: control,
            errorName: this.FORM_VAL_ERRORS.NO_EXIST,
          });
        }
      );
  }

  changeControlValue(
    event: Event & { target: HTMLInputElement },
    controlName: 'docNum' | 'phoneNumber'
  ): void {
    const docNumControl = this.form.get('docNum');
    const phoneNumberControl = this.form.get('phoneNumber');

    phoneNumberControl.markAllAsTouched();
    docNumControl.markAllAsTouched();

    const txtSearch = event.target.value;
    if (!txtSearch) {
      return;
    }

    console.log(this.form.get('phoneNumber'));

    if (phoneNumberControl.invalid || docNumControl.invalid) {
      return;
    }

    this.getCustomerUserInfo(controlName, txtSearch);
  }

  onInputChange(
    event: Event & { target: HTMLInputElement },
    controlName: 'docNum' | 'phoneNumber'
  ): void {
    const txt = event.target.value?.trim();
    if (!txt) {
      this.clearControl(controlName);
    }
  }

  clearControl(
    controlName: 'docNum' | 'phoneNumber',
    eraseCrrText: boolean = false
  ): void {
    this.customerUserInfoChange.emit(null);
    const otherControlName =
      controlName === 'docNum' ? 'phoneNumber' : 'docNum';
    this.form.get(otherControlName).setValue('');

    if (eraseCrrText) {
      this.form.get(controlName).setValue('');
    }
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
