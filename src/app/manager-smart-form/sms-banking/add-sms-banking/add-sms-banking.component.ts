import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';
import { SmsCommnon } from 'src/app/_models/sms/SmsCommon';
import { AccountService } from 'src/app/_services/account.service';
import { ProcessService } from 'src/app/_services/process.service';
import { SmsService } from 'src/app/_services/sms/sms.service';

@Component({
  selector: 'app-add-sms-banking',
  templateUrl: './add-sms-banking.component.html',
  styleUrls: ['./add-sms-banking.component.css']
})
export class AddSmsBankingComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private _LOCATION: Location, private route: ActivatedRoute, private accountService: AccountService,
    private cifService: ProcessService,
    private smsService: SmsService,
    private missionService: MissionService, ) { }
  // tslint:disable-next-line:typedef
  get smsDetailList(){return this.createSmsForm.get('smsDetailList'); }
   // tslint:disable-next-line:typedef
  get smsAccountList(){return this.createSmsForm.get('smsDetailList').get('smsAccountList'); }
   // tslint:disable-next-line:typedef
  get accountId(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('accountId'); }
   // tslint:disable-next-line:typedef
  get isRegister(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('isRegister'); }
   // tslint:disable-next-line:typedef
  get isFeeCharge(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('isFeeCharge'); }
   // tslint:disable-next-line:typedef
  get isDefault(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('isDefault'); }
   // tslint:disable-next-line:typedef
  get isService(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('isService'); }
   // tslint:disable-next-line:typedef
  get isNotify(){return this.createSmsForm.get('smsDetailList').get('smsAccountList').get('isNotify'); }
   // tslint:disable-next-line:typedef
  get mobileNo(){return this.createSmsForm.get('smsDetailList').get('mobileNo'); }
   // tslint:disable-next-line:typedef
  get accountId2(){return this.createSmsForm.get('smsDetailList').get('accountId2'); }
   // tslint:disable-next-line:typedef
  get packageCode(){return this.createSmsForm.get('smsDetailList').get('packageCode'); }
   // tslint:disable-next-line:typedef
  get acctionCode(){return this.createSmsForm.get('smsDetailList').get('acctionCode'); }
  processId: string;
  branchCode: string;
  cate: [];
  smsStatus: SmsCommnon[];
  smsAction: SmsCommnon[];
  smsPackage: SmsCommnon[];
  lstAccount: AccountModel[] = [];

  arrayTable: Array<any> = [
    {
      id: 1,
      name: 'Mobile No.1',
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
    {
      id: 2,
      name: 'Mobile No.2',
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
    {
      id: 3,
      name: 'Mobile No.3',
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
  ];
  createSmsForm = this.fb.group({
    smsDetailList: this.fb.array([
      this.fb.group({
        smsAccountList: this.fb.array([
          this.fb.group({
            accountId: [''],
            isRegister: [''],
            isFeeCharge: [''],
            isDefault: [''],
            isService: [''],
            isNotify: [''],
          }),
        ]),
        mobileNo: [''],
        accountId: [''],
        packageCode: [''],
        acctionCode: [''],
      })
    ]),
    processId: [''],
  });
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.getSmsStatus();
    this.getSmsAction();
    this.getSmsPackage();
    this.getAccountList();
    this.getProcessInformation();
    this.missionService.setProcessId(this.processId);
    this.branchCode = JSON.parse(localStorage.getItem('userInfo')).branchCode;

  }
  getAccountList(): void {
    this.accountService.getAccountList({ processId: this.processId }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.lstAccount = rs.items;
        // console.log(rs.items.customer.person.mobileNo);
      } else {
        this.lstAccount = null;
      }
    });
  }
  getProcessInformation(): void {
    this.cifService.detailProcess(this.processId).subscribe(data => {
      if (data.item) {
        // console.log(data.item);
        // console.log(data.item.customer.person.mobileNo);

      }
    }, error => {
    }, () => { }
    );
  }


  backPage(): void {
    this._LOCATION.back();
  }

  onSubmit(): void {
    // console.log(this.arrayTable);
  }


  getSmsStatus(): void {
    this.smsService.getSmsStatus().subscribe(data => {
      if (data.items) {
        this.smsStatus = data.items;
        // console.log(this.smsStatus);
      }
    });
  }
  getSmsAction(): void {
    this.smsService.getSmsAction().subscribe(data => {
      if (data.items) {
        this.smsAction = data.items;
        // console.log(this.smsAction);
      }
    });
  }
  getSmsPackage(): void {
    this.smsService.getSmsPackage().subscribe(data => {
      if (data.items) {
        this.smsPackage = data.items;
        // console.log(this.smsPackage);
      }
    });
  }
}
 // listAccount: Array<any> = [
  //   {
  //     id: 1,
  //     accountNumber: 'Tài khoản Mới',
  //     mobileAction: ({
  //       isDefault: false,
  //       isService: false,
  //       isNotify: false
  //     })
  //   },
  //   {
  //     id: 2,
  //     accountNumber: 'Tài khoản Mới 2',
  //     mobileAction: ({
  //       isDefault: false,
  //       isService: false,
  //       isNotify: false
  //     })
  //   },
  //   {
  //     id: 3,
  //     accountNumber: 'Tài khoản Mới 3',
  //     mobileAction: ({
  //       isDefault: false,
  //       isService: false,
  //       isNotify: false
  //     })
  //   }
  // ]

  // AddSMS = new FormBuilder({
  //   accountList: new FormGroup({
  //     accountId: new FormControl(''),
  //     isService: new FormControl(''),
  //     isNotify: new FormControl('')
  //   }),
  //   mobileNo: new FormControl(''),
  //   defaultAccountId: new FormControl(''),
  //   feeChargeAccountId: new FormControl(''),
  //   actionCode: new FormControl('')
  // })
