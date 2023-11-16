import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe, DecimalPipe} from '@angular/common';
import {UserInfo} from '../../../_models/user';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {VietlottService} from '../shared/services/vietlott.service';
import {Router} from '@angular/router';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'config-fee',
  templateUrl: './config-fee.component.html',
  styleUrls: ['./config-fee.component.scss']
})
export class ConfigFeeComponent implements OnInit {
  billCode: any;
  userInfo?: UserInfo;
  billId = '';
  hoFeeHo = '';
  hoFeeDvkd = '';
  dvkdFeeHo = '';
  dvkdFeeDvkd = '';
  formConfig; FormGroup;

  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  initFormGroup(): void {
    this.formConfig = this.fb.group({
      hoQlFeeHo: [0],
      HoQlFeeDvkd: [0],
      dvkdQlFeeHo: [0],
      dvkdQlFeeDvkd: [0],
    });
  }
  //
  constructor(
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private vietlottService: VietlottService,
    private router: Router,
    private numberPipe: DecimalPipe,
  ){
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.getConfigFee();
  }

  // tslint:disable-next-line:typedef
  ConfigFee() {
    // this.router.navigate(['vietlott-service/config-fee/update-config-fee'], {});
    this.router.navigateByUrl('vietlott-service/config-fee/update-config-fee',
      { state: {hoQlFeeHo: this.hoFeeHo, hoQlFeeDvkd: this.hoFeeDvkd,
                      dvkdQlFeeHo: this.dvkdFeeHo, dvkdQlFeeDvkd: this.dvkdFeeDvkd } });
  }
  // tslint:disable-next-line:typedef
  getConfigFee(){
    const url = 'fee-lv24';
    this.vietlottService.getConfigFee(url).subscribe((res) => {
      if (res.data) {
        this.hoFeeHo = this.numberPipe.transform(res.data.hoQLFeeHo, '1.0');
        this.hoFeeDvkd = this.numberPipe.transform(res.data.hoQLFeeDvkd, '1.0');
        this.dvkdFeeHo = this.numberPipe.transform(res.data.dvkdQLFeeHo, '1.0');
        this.dvkdFeeDvkd = this.numberPipe.transform(res.data.dvkdQLFeeDvkd, '1.0');
        this.formConfig.get('hoQlFeeHo').patchValue(this.numberPipe.transform(res.data.hoQLFeeHo, '1.0'));
        this.formConfig.get('HoQlFeeDvkd').patchValue(this.numberPipe.transform(res.data.hoQLFeeDvkd, '1.0'));
        this.formConfig.get('dvkdQlFeeHo').patchValue(this.numberPipe.transform(res.data.dvkdQLFeeHo, '1.0'));
        this.formConfig.get('dvkdQlFeeDvkd').patchValue(this.numberPipe.transform(res.data.dvkdQLFeeDvkd, '1.0'));
      }
    });
  }
}
