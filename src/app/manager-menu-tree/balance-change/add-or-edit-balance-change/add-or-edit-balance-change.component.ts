import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventEmitter } from 'events';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';

@Component({
  selector: 'app-add-or-edit-balance-change',
  templateUrl: './add-or-edit-balance-change.component.html',
  styleUrls: ['./add-or-edit-balance-change.component.scss']
})
export class AddOrEditBalanceChangeComponent implements OnInit {
  @Input() actionType = 'CREATE';   // actionType: CREATE-Tạo mới, EDIT-Chỉnh sửa
  @Input() objEbankingSelected;
  @Input() objProcessDetail;
  @Output() changeStep = new EventEmitter();
  lstAccount: AccountModel[] = [];
  formGroup = this.fb.group({
    account: [''],
    mobileList: this.fb.array([
      this.fb.group({
        mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
      })
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private missionService: MissionService,
    private fb: FormBuilder,
    ) {
  }

  get mobileList(): FormArray {
    return this.formGroup.get('mobileList').get('mobileNo') as FormArray;
  }
  processId: string;
  hiddenAccount: boolean;
  hiddenCreateAccount: boolean;
  hiddenDetailAccount: boolean;
  roleLogin: any;
  checkButtonCreate: boolean;
  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    // $('.childName').html('Danh sách tài khoản');
    // this.processId = this.route.snapshot.paramMap.get('processId');
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.missionService.setProcessId(this.processId);
    this.hiddenAccount = true;
    this.hiddenCreateAccount = false;
    this.hiddenDetailAccount = false;
    if (this.roleLogin.includes('UNIFORM.BANK.GDV')) {
      this.checkButtonCreate = true;
    }
    this.mobileList.controls[0].get('mobileNo').valueChanges.subscribe(data => {
      // console.log(data);
    });
  }
  addMobileNo(): void {
      this.mobileList.push(this.fb.group({
        mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],

      }));
  }


}
