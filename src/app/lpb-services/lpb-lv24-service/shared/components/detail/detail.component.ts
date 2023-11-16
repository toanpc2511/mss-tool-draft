import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { HiddenButton } from 'src/app/lpb-services/lpb-transfer-service/shared/models/common';
import { LpbFooterComponent } from 'src/app/shared/components/lpb-footer/lpb-footer.component';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { isGDV, isHoiSo, isKSV } from 'src/app/shared/utilites/role-check';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import {
  TRANSACTION_STATUSES,
  TRANS_STATUS_CODES,
} from '../../constants/common';
import { CustomerUserInfo } from '../../models/common';
import { ISubmit, TransactionData } from '../../models/lv24';
import {
  LV24_PROFILE_STATUS,
  ParseLVL24ProfileStatusCodeToVI,
} from '../../pipes/LVL24ProfileStatusVi.pipe';
import { LV24Service } from '../../services/lv24.service';

@Component({
  selector: 'app-lv24-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss', '../../styles/common.scss'],
})
export class DetailComponent implements OnInit {
  userInfo: any;
  id: string;
  customerUserInfo: CustomerUserInfo;
  isSearchCustomerUserInfo = false;

  transactionData: TransactionData;
  detailForm: FormGroup;
  detailFormExtend: FormGroup;

  TRANS_STATUS_CODES = TRANS_STATUS_CODES;

  actions: ActionModel[];

  hiddenExtend = false;

  sortedInfos: {
    code: string;
    title: string;
    class?: string;
    transform?: (value) => string;
  }[][];

  @Output() approve: EventEmitter<ISubmit> = new EventEmitter<ISubmit>();
  @Output() reject: EventEmitter<ISubmit> = new EventEmitter<ISubmit>();

  @ViewChild('footer') footer: LpbFooterComponent;

  hiddenButtons = [];
  constructor(
    private fb: FormBuilder,
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private lv24Service: LV24Service,
    private router: Router,
    private lbl24ProfileStatusViPipe: ParseLVL24ProfileStatusCodeToVI,
    private datePipe: DatePipe
  ) {
    this.dialogService.setDialog(this.dialog);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    this.actions = [
      {
        actionIcon: 'keyboard_backspace',
        actionName: 'Quay lại',
        actionClick: () =>
          this.router.navigate(['../'], { relativeTo: this.activatedRoute }),
      },
    ];

    this.sortedInfos = [
      [
        {
          code: 'cif',
          title: 'Mã khách hàng',
        },
        {
          code: 'cusName',
          title: 'Họ tên',
          class: 'white-space-pre',
        },
        {
          code: 'email',
          title: 'Email',
        },
        {
          code: 'address',
          title: 'Địa chỉ',
        },
        {
          code: 'cusTypeDes',
          title: 'Loại khách hàng',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.CUSTOMER_TYPE
            );
          },
        },
        {
          code: 'docType',
          title: 'Loại định danh',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.DOC_TYPE
            );
          },
        },
        {
          code: 'docNum',
          title: 'Số định danh',
        },
        {
          code: 'docMethod',
          title: 'Phương thức định danh',
        },
      ],
      [
        {
          code: 'userMakerId',
          title: 'Người tạo',
        },
        {
          code: 'userCreatedTime',
          title: 'Thời gian tạo',
          transform: (value) => {
            return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm:ss');
          },
        },
        {
          code: 'userName',
          title: 'User name',
        },
        {
          code: 'phoneNumber',
          title: 'Số điện thoại',
        },
        {
          code: 'wrongPassCount',
          title: 'Số lần nhập sai mật khẩu',
        },
        {
          code: 'userStatus',
          title: 'Trạng thái user',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.USER_STATUS
            );
          },
        },
        {
          code: 'accountStatus',
          title: 'Trạng thái tài khoản',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.ACCOUNT_STATUS
            );
          },
        },
        {
          code: 'cusStatus',
          title: 'Trạng thái khách hàng',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.CUSTOMER_STATUS
            );
          },
        },
      ],
    ];
  }

  ngAfterViewInit(): void {
    const hiddenButtons: HiddenButton[] = this.footer.buttonActions.map(
      (btnAct) => ({ actionCode: btnAct.actionCode, hiddenType: 'disable' })
    );
    this.hiddenButtons = hiddenButtons;
  }

  initForm() {
    this.detailForm = this.fb.group({
      docNum: [{ value: null, disabled: true }, [ValidatorHelper.required]],
      phoneNum: [{ value: null, disabled: true }, [ValidatorHelper.required]],
      serviceCode: [
        { value: null, disabled: true },
        [ValidatorHelper.required],
      ],
      reason: { value: '', disabled: true },
      note: [{ value: null, disabled: true }],
      status: [{ value: null, disabled: true }],
      approveNote: [{ value: null, disabled: true }],
    });
  }
  initDetailForm() {
    this.detailFormExtend = this.fb.group({
      status: [{ value: null, disabled: true }],
      approveNote: [{ value: null, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetailForm();

    this.activatedRoute.queryParams
      .pipe(
        switchMap((params) => {
          this.id = params['transId'];
          if (!this.id) {
            throw new Error('Không tìm thấy dữ liệu');
          }
          return this.lv24Service.getTransactionById(this.id);
        })
      )
      .subscribe(
        (res: DataResponse<TransactionData>) => {
          const { data } = res;
          if (!data) {
            this.lv24Service.handleError('Không tìm thấy dữ liệu!', () => {
              this.navigateBack();
            });
            return;
          }
          if (!isHoiSo()) {
            if (
              (isKSV() && data.branchCode !== this.userInfo.branchCode) ||
              (isGDV() && data.createdBy !== this.userInfo.userName)
            ) {
              this.navigateBack();
            }
          }

          this.transactionData = data;
          this.detailForm.patchValue(data);

          this.customerUserInfo = data;
          if (data?.status === TRANS_STATUS_CODES.WAIT_APPROVE) {
            this.hiddenButtons = [];
          }
          this.detailFormExtend
            .get('status')
            .setValue(
              TRANSACTION_STATUSES.find((e) => e.code === data.status)?.name ||
                ''
            );
          this.detailFormExtend.get('approveNote').setValue(data.approveNote);
        },
        (error) => {
          this.lv24Service.handleError(error, () => {
            this.navigateBack();
          });
        }
      );
  }

  onApprove() {
    const frmValues = this.detailForm.getRawValue();
    for (let key in frmValues) {
      if (typeof frmValues[key] === 'string') {
        frmValues[key] = frmValues[key].trim();
      }
    }

    this.approve.emit({
      frmValues,
      customerUserInfo: this.customerUserInfo,
      form: this.detailForm,
      transactionData: this.transactionData,
      id: this.id,
    });
  }

  onReject() {
    const frmValues = this.detailForm.getRawValue();
    for (let key in frmValues) {
      if (typeof frmValues[key] === 'string') {
        frmValues[key] = frmValues[key].trim();
      }
    }

    this.reject.emit({
      frmValues,
      customerUserInfo: this.customerUserInfo,
      form: this.detailForm,
      transactionData: this.transactionData,
      id: this.id,
    });
  }

  getFirstError(controlName: string): string {
    const errors = this.detailForm.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
  navigateBack() {
    this.router
      .navigate(['../'], { relativeTo: this.activatedRoute })
      .then(() => {})
      .catch((e) => {});
  }
}
