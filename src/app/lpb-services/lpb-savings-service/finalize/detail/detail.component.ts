import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { IBuilder } from '../../shared/components/form-array/form-array.component';
import { FORM_VAL_ERRORS, NO_EMIT } from '../../shared/constants/common';
import { SETTLEMENT_TYPE } from '../../shared/constants/finalize';
import { FINALIZE } from '../../shared/models/finalize';
import { CommonService } from '../../shared/services/common.service';
import { FinalizeService } from '../../shared/services/finalize.service';
import { MoneyListFormService } from '../../shared/services/money-list-form.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, AfterViewInit {
  FORM_VAL_ERRORS = {
    ...FORM_VAL_ERRORS,
    INVALID_AMOUNT_RECEIVED: 'inValidAmountReceived',
    INVALID_AMOUNT_RECEIVED_COUNT: 'inValidAmountReceivedCount',
    INVALID_AMOUNT_PERCENT_RECEIVED: 'inValidAmountPercentReceived',
  };
  form: FormGroup;
  formArray: FormArray;
  builder: IBuilder;
  actions: ActionModel[];

  id: string;
  settlementDepositsData;

  @ViewChild('formFinalizeForm') formFinalizeForm: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private moneyListFormService: MoneyListFormService,
    private dialog: MatDialog,
    private dialogService: LpbDialogService,
    private commonService: CommonService,
    private finalizeService: FinalizeService
  ) {
    this.dialogService.setDialog(this.dialog);
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb(['Dịch vụ tài chính', '']);

    this.actions = [
      {
        actionIcon: 'keyboard_backspace',
        actionName: 'Quay lại',
        actionClick: () => this.navigateBack(),
      },
    ];
    this.innitForm();
  }
  ngAfterViewInit(): void {
    this.patchFormData();
  }

  innitForm(): void {
    this.form = this.fb.group({
      accountNumber: [{ value: null, disabled: true }],
      serial: [{ value: null, disabled: true }],
      currency: [{ value: null, disabled: true }],
      description: [{ value: null, disabled: true }],
      settlementType: [SETTLEMENT_TYPE.ALL],
      openingDate: [{ value: null, disabled: true }],
      settlementDate: [{ value: null, disabled: true }],
      interestRate: [{ value: null, disabled: true }],
      bookStatus: [{ value: null, disabled: true }],
      prematureInterest: [{ value: null, disabled: true }],
      amount: [{ value: null, disabled: true }],
      matureInterest: [{ value: null, disabled: true }],
      totalAmount: [{ value: null, disabled: true }],
      moneyList: this.moneyListFormService.getDefaultMoneyList(),
      settlementDeposits: this.fb.array([]),
      additionalExpenses: [false],
    });
  }

  patchFormData(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          this.id = params['transId'];
          if (!this.id) {
            throw new Error('Không tìm thấy dữ liệu');
          }
          return this.finalizeService.getFinalizeById(this.id);
        })
      )
      .subscribe(
        (res: DataResponse<FINALIZE>) => {
          const { data } = res;
          this.settlementDepositsData = data;
          if (!data) {
            this.commonService.handleError('Không tìm thấy dữ liệu!', () => {
              this.navigateBack();
            });
            return;
          }
          // if (!isHoiSo()) {
          //   if (
          //     (isKSV() && data.branchCode !== USER_INFO().branchCode) ||
          //     (isGDV() && data.createdBy !== USER_INFO().userName)
          //   ) {
          //     this.navigateBack();
          //   }
          // }

          this.form.patchValue({
            ...data,
            totalAmount:
              (Number(data.amount) || 0) +
              (Number(data.prematureInterest) || 0),
          });
          if (data.bookStatus === 'NORMAL') {
            this.settlementType.patchValue(SETTLEMENT_TYPE.ALL, NO_EMIT);
            this.settlementType.disable(NO_EMIT);
          }

          const settlementDepositsValue = {
            sourceOfMoney: null,
            accountNumber: null,

            amount: this.form.get('totalAmount').value,
            amountPercent: { value: 100, disabled: true },
          };
          if (this.settlementDeposit_0) {
            this.settlementDeposit_0.patchValue(settlementDepositsValue);
          } else {
            this.settlementDeposits.insert(
              0,
              this.fb.group(settlementDepositsValue)
            );
          }
        },
        (error) => {
          this.commonService.handleError(error, () => {
            this.navigateBack();
          });
        }
      );
  }

  onSave(): void {
    const formValues = this.submitForm();
    console.log(formValues);
  }

  submitForm(): { [name: string]: any } | null {
    this.form.markAllAsTouched();
    const settlementDeposits = this.form.get('settlementDeposits');
    settlementDeposits.markAllAsTouched();
    if (
      this.form.invalid ||
      settlementDeposits.invalid ||
      !settlementDeposits.value?.length
    ) {
      FormHelpers.focusToInValidControl(this.formFinalizeForm);
      return;
    }
    return FormHelpers.trimValues(this.form.getRawValue());
  }
  navigateBack(): void {
    this.router
      .navigate(['../../'], { relativeTo: this.activatedRoute })
      .then(() => {})
      .catch((e) => e);
  }
  get settlementDeposits(): FormArray {
    return this.form.get('settlementDeposits') as FormArray;
  }
  get settlementDeposit_0(): FormGroup {
    return this.settlementDeposits.controls[0] as FormGroup;
  }
  get settlementType(): AbstractControl {
    return this.form.get('settlementType');
  }
}
