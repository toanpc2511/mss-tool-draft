import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CustomerInfo } from 'src/app/shared/models/common.interface';

import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import {
  DOC_TYPES,
  DOC_TYPES_VI,
  FORM_VAL_ERRORS,
} from '../../../constants/common';
import { ctrlNames } from '../../../constants/saving';
import { NgAutocompleteComponent } from '../ng-autocomplete/ng-autocomplete.component';
import { FinanceCommonService } from 'src/app/shared/services/finance-common.service';
import { EnumInputType } from '../../form-array/form-array.component';
import { MatDialog } from '@angular/material/dialog';
import { ListDialogComponent } from '../../list-dialog/list-dialog.component';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import * as moment from 'moment';

export interface SearchCustomer {
  docNum: string;
  cifs: Omit<CustomerInfo, 'docNum'>[];
}

@Component({
  selector: 'app-sender-info',
  templateUrl: './sender-info.component.html',
  styleUrls: [
    '../../../styles/common.scss',
    './sender-info.component.scss',
    '../../../styles/lpb-saving-form.scss',
  ],
})
export class SenderInfoComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() changeSenderInfo = new EventEmitter<CustomerInfo>();

  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  @ViewChild(NgAutocompleteComponent, { static: false })
  docNumAutoComp: NgAutocompleteComponent;

  crrSenderInfo: CustomerInfo = null;
  lstCif: CustomerInfo[] = [];
  DOC_TYPES = [];
  FORM_VAL_ERRORS = FORM_VAL_ERRORS;
  senderCtrlName = ctrlNames.SENDER;

  constructor(
    private financeCommonService: FinanceCommonService,
    private customNotificationService: CustomNotificationService,
    private dialog: MatDialog,
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
  }

  ngOnInit() {}

  searchCustomer(
    inputType: 'cif' | 'gtxm',
    txtSearch: string
  ): Observable<SearchCustomer[]> {
    return new Observable<SearchCustomer[]>((observer) => {
      this.financeCommonService
        .getCustomerInfo(txtSearch, inputType)
        .pipe(
          catchError((error: any) => {
            if (error?.code.match(/400/g)) {
              return of(null);
            } else {
              return of(error);
            }
          }),
          switchMap((res): Observable<CustomerInfo[]> => {
            if (res && res?.data && res?.data?.length) {
              return of(res.data);
            } else {
              if (res?.code) {
                const error = res;
                return throwError(error);
              }
              return throwError(FORM_VAL_ERRORS.NO_EXIST);
            }
          })
        )
        .subscribe(
          (data) => {
            const map: Map<string, SearchCustomer> = new Map<
              string,
              SearchCustomer
            >();

            data.forEach((data) => {
              const { docNum, ...others } = data;
              if (!map.has(data.docNum)) {
                map.set(data.docNum, { docNum: data.docNum, cifs: [others] });
              } else {
                const docNumData = map.get(data.docNum);
                docNumData.cifs.push(others);
              }
            });

            let results = Array.from(map.values());
            observer.next(results);
            observer.complete();
          },
          (error) => {
            if (error?.code) {
              this.customNotificationService.error('Thông báo', error.message);
            }

            observer.next([]);
            observer.complete();
          }
        );
    });
  }

  searchDocNum = (term: string): Observable<SearchCustomer[]> => {
    return this.searchCustomer('gtxm', term);
  };

  get searchDocNumFn() {
    return this.searchDocNum.bind(this);
  }

  changeCustomerInfo(event: SearchCustomer) {
    if (!event) {
      this.lstCif = [];
      this.loadCustomerInfo(null);
      return;
    }

    this.lstCif = event.cifs.map((data) => ({
      ...data,
      docNum: event.docNum,
    }));

    if (this.lstCif.length === 1) {
      const senderInfo = { docNum: event.docNum, ...event.cifs[0] };
      this.loadCustomerInfo(senderInfo);
    } else if(this.lstCif.length > 1){
      this.openCifListPopup(this.lstCif);
    }
  }

  openCifListPopup(cifs: CustomerInfo[]){
    const id = 'cifList';
    const builderCifs = {
      cifNo: {
        label: 'Số Cif',
        inputType: EnumInputType.link,
        onClick: ({ item }) => {
          this.loadCustomerInfo(item, [this.senderCtrlName.docNum]);
          const cifListPopup = this.dialog.openDialogs.find(
            (dialog) => dialog.id === id
          );
          cifListPopup.close();
        },
      },
      fullName: {
        label: 'Họ và tên',
        inputType: EnumInputType.text,
      },
      docNum: {
        label: 'Số GTXM',
        inputType: EnumInputType.text,
      },
      docIssueDate: {
        label: 'Ngày cấp',
        inputType: EnumInputType.text,
      },
      docIssuePlace: {
        label: 'Nơi cấp',
        inputType: EnumInputType.text,
      },
    };

    cifs = cifs.map((data) => {
      let docIssueDate = DateHelper.getDateFromString(data.docIssueDate);
      const docIssueDateStr = moment(docIssueDate).format('DD/MM/YYYY');
      return {...data, docIssueDate: docIssueDateStr};
    })

    this.dialog.open(ListDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '750px',
      id,
      data: {
        title: 'Thông tin người đồng sở hữu',
        data: cifs,
        builder: builderCifs,
      },
    });
  }

  getCustomerInfoByCif(txt: string) {
    this.searchCustomer('cif', txt).subscribe((data) => {
      if (!data.length) {
        FormHelpers.setFormError({
          control: this.form.get(this.senderCtrlName.cif),
          errorName: FORM_VAL_ERRORS.NO_EXIST,
        });
      } else {
        const senderInfo = { docNum: data[0].docNum, ...data[0].cifs[0] };
        this.loadCustomerInfo(senderInfo, [this.senderCtrlName.cif]);
        FormHelpers.clearFormError({
          control: this.form.get(this.senderCtrlName.cif),
          errorName: FORM_VAL_ERRORS.NO_EXIST,
        });
      }
    });
  }

  loadCustomerInfo(customerInfo: CustomerInfo, ignoreFields?: string[]) {
    if (customerInfo && customerInfo?.customerType !== 'I') {
      FormHelpers.setFormError({
        control: this.form.get(this.senderCtrlName.cif),
        errorName: FORM_VAL_ERRORS.NOT_PERSONAL,
      });
    } else {
      FormHelpers.clearFormError({
        control: this.form.get(this.senderCtrlName.cif),
        errorName: FORM_VAL_ERRORS.NOT_PERSONAL,
      });
    }

    if (customerInfo && customerInfo?.nation !== 'VN') {
      FormHelpers.setFormError({
        control: this.form.get(this.senderCtrlName.cif),
        errorName: FORM_VAL_ERRORS.FOREIGNER,
      });
    } else {
      FormHelpers.clearFormError({
        control: this.form.get(this.senderCtrlName.cif),
        errorName: FORM_VAL_ERRORS.FOREIGNER,
      });
    }

    this.crrSenderInfo = customerInfo;
    this.changeSenderInfo.emit(customerInfo);

    if (!ignoreFields) {
      ignoreFields = [this.senderCtrlName.cif, this.senderCtrlName.docNum];
    }

    this.form
      .get(this.senderCtrlName.name)
      .setValue(customerInfo?.fullName || null);

    const docTypeRecord = DOC_TYPES_VI.find(
      (doc) => doc.noneMark === customerInfo?.docType
    );
    this.form
      .get(this.senderCtrlName.docType)
      .setValue(docTypeRecord?.code || DOC_TYPES.CCCD);

    ignoreFields.forEach((ignoreField) => {
      if (!(ignoreField && ignoreField === this.senderCtrlName.cif)) {
        this.form
          .get(this.senderCtrlName.cif)
          .setValue(customerInfo?.cifNo || null);
      }

      if (!(ignoreField && ignoreField === this.senderCtrlName.docNum)) {
        this.form
          .get(this.senderCtrlName.docNum)
          .setValue(customerInfo?.docNum || null);

        if (customerInfo?.docNum) {
          const { docNum, ...others } = customerInfo;
          const selectedItems = {
            docNum: customerInfo?.docNum,
            cifs: [others],
          };
          this.docNumAutoComp.selectedItem = selectedItems;
          this.docNumAutoComp.items$ = of([selectedItems]);
        }
      }
    });
  }

  changeCif(event: { target: HTMLInputElement } | string) {
    if (typeof event !== 'string') {
      const crrCif = event.target.value.trim();
      console.log('changeCif crrCif: ', crrCif);
      if (crrCif) {
        this.getCustomerInfoByCif(crrCif);
      }
    } else {
      const selectedInfo = this.lstCif.find((info) => info.cifNo === event);
      if (selectedInfo) {
        this.loadCustomerInfo(selectedInfo, [
          this.senderCtrlName.cif,
          this.senderCtrlName.docNum,
        ]);
      }
    }
  }

  onCifInputChange(event: Event & { target: HTMLInputElement }) {
    const crrCif = event.target.value.trim();
    if (!crrCif) {
      this.loadCustomerInfo(null);
    }
  }

  clearCif() {
    this.loadCustomerInfo(null, [this.senderCtrlName.docNum]);
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
