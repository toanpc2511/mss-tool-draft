import {Component, OnInit} from '@angular/core';
import {LIST_AGENT_TYPE, LIST_CHANEL} from '../shared/constants/vietlott.constant';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VietlottService} from "../shared/services/vietlott.service";
import {IError} from "../../../system-configuration/shared/models/error.model";
import {CustomNotificationService} from "../../../shared/services/custom-notification.service";

@Component({
  selector: 'app-query-transaction',
  templateUrl: './query-transaction.component.html',
  styleUrls: ['./query-transaction.component.scss']
})
export class QueryTransactionComponent implements OnInit {
  forms: FormGroup;
  listType = LIST_AGENT_TYPE;
  listChanel = LIST_CHANEL;
  searched: boolean;

  constructor(
    private fb: FormBuilder,
    private vietlottService: VietlottService,
    private notifyService: CustomNotificationService,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.searched = false;
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      agentType: ['V2VL'],
      agentCode: ['', [Validators.required]],
      chanel: ['QUAY', [Validators.required]],
      codeTrans: [''],
      status: [''],
      amount: [''],
      dateTrans: [''],
    });
  }

  search(): void {
    this.forms.markAllAsTouched();
    if (this.forms.invalid) {
      return;
    }
    this.searched = true;
    const param = `posId=${this.forms.get('agentCode').value}`;
    console.log('body--', param);
    this.vietlottService.getTopupLimit(param)
      .subscribe((res) => {
        if (res.data) {
          this.forms.patchValue({
            status: res.data.billStatus === 'Y' ? 'Hoạt động' : 'Không hoạt động',
            amount: res.data.billAmount,
            dateTrans: res.data.queryDate,
          });
        }
      }, (error: IError) => {
        this.notifyService.handleErrors(error);
      });
  }
}
