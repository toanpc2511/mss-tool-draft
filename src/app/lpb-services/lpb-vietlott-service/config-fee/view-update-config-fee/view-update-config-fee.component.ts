import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe, DecimalPipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {VietlottService} from '../../shared/services/vietlott.service';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {ConfigFeeComponent} from '../config-fee.component';
import {IError} from '../../../../shared/models/error.model';
import {
  CustomConfirmDialogComponent
} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-config-fee',
  templateUrl: './view-update-config-fee.component.html',
  styleUrls: ['./view-update-config-fee.component.scss'],
  providers: [DestroyService]
})
export class UpdateConfigFeeComponent implements OnInit {
  @ViewChild(ConfigFeeComponent) child;
  hoFeeHo = '';
  hoFeeDvkd = '';
  dvkdFeeHo = '';
  dvkdFeeDvkd = '';
  data: any;
  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  formUpdateConfig: FormGroup;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  initFormGroup(): void {
    this.formUpdateConfig = this.fb.group({
      hoQlFeeHo: [Validators.required, Validators.pattern(this.numberRegEx)],
      HoQlFeeDvkd: [Validators.required, Validators.pattern(this.numberRegEx)],
      dvkdQlFeeHo: [Validators.required, Validators.pattern(this.numberRegEx)],
      dvkdQlFeeDvkd: [Validators.required, Validators.pattern(this.numberRegEx)],
    });
  }
  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private vietlottService: VietlottService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private destroy$: DestroyService,
    private notify: CustomNotificationService,
    private router: Router,
    private numberPipe: DecimalPipe,
  ){
    this.initFormGroup();
  }

  ngOnInit(): void {
    console.log(history.state.hoQlFeeDvkd);
    this.formUpdateConfig.get('hoQlFeeHo').patchValue(history.state.hoQlFeeHo);
    this.formUpdateConfig.get('HoQlFeeDvkd').patchValue(history.state.hoQlFeeDvkd);
    this.formUpdateConfig.get('dvkdQlFeeHo').patchValue(history.state.dvkdQlFeeHo);
    this.formUpdateConfig.get('dvkdQlFeeDvkd').patchValue(history.state.dvkdQlFeeDvkd);
    this.formUpdateConfig.get('hoQlFeeHo').valueChanges.subscribe((value) => {
      if (value === ''){
        this.hoFeeHo = '0';
      }else {
        this.hoFeeHo = value;
      }
      console.log('hoFeeHo', value);
    });
    this.formUpdateConfig.get('HoQlFeeDvkd').valueChanges.subscribe((value) => {
      if (value === ''){
        // tslint:disable-next-line:no-unused-expression
        this.hoFeeDvkd = '0';
      }else {
        this.hoFeeDvkd = value;
      }
      console.log('hoFeeDvkd', value);
    });
    this.formUpdateConfig.get('dvkdQlFeeHo').valueChanges.subscribe((value) => {
      if (value === ''){
        // tslint:disable-next-line:no-unused-expression
        this.dvkdFeeHo = '0';
      }else {
        this.dvkdFeeHo = value;
      }
      console.log('dvkdFeeHo', value);
    });
    this.formUpdateConfig.get('dvkdQlFeeDvkd').valueChanges.subscribe((value) => {
      if (value === ''){
        // tslint:disable-next-line:no-unused-expression
        this.dvkdFeeDvkd = '0';
      }else {
        this.dvkdFeeDvkd = value;
      }
      console.log('dvkdFeeDvkd', value);
    });
  }

  // tslint:disable-next-line:typedef
  update() {
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Thay đổi phí quản lý. Bạn có muốn tiếp tục ?`,
      },
    });
    const body = {
      hoQLFeeHo: this.hoFeeHo === '' ? history.state.hoQlFeeHo : this.hoFeeHo ,
      hoQLFeeDvkd: this.hoFeeDvkd === '' ? history.state.hoQlFeeDvkd : this.hoFeeDvkd ,
      dvkdQLFeeHo: this.dvkdFeeHo === '' ? history.state.dvkdQlFeeHo : this.dvkdFeeHo,
      dvkdQLFeeDvkd: this.dvkdFeeDvkd === '' ? history.state.dvkdQlFeeDvkd : this.dvkdFeeDvkd
    };
    const url = 'fee-lv24';
    console.log('body', body);
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.vietlottService.updateConfigFee(url, body).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.message === 'SUCCESS'
              ? this.notify.success('Thông báo', `Cập nhật phí quản lý thành công`)
              : this.notify.error('Thông báo', `Cập nhật phí quản lý thất bại`);
            this.matDialog.closeAll();
            this.router.navigate(['vietlott-service/config-fee'], {});
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }
}
