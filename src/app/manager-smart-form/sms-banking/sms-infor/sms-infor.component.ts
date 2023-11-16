import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountModel } from 'src/app/_models/account';
import { SmsCommnon } from 'src/app/_models/sms/SmsCommon';
import { AccountService } from 'src/app/_services/account.service';
import { SmsService } from 'src/app/_services/sms/sms.service';

@Component({
  selector: 'app-sms-infor',
  templateUrl: './sms-infor.component.html',
  styleUrls: ['./sms-infor.component.css']
})
export class SmsInforComponent implements OnInit {
  processId: string
  cate: [];
  smsStatus:SmsCommnon[];
  smsAction:SmsCommnon[]
  smsPackage:SmsCommnon[]
  smsAccount:[]
  lstAccount: AccountModel[] = []
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId')
    })
    this.getSmsStatus()
    this.getSmsAccount()
    this.getSmsAction()
    this.getSmsPackage()
    this.getAccountList()
  }
  getAccountList() {
    this.accountService.getAccountList({ processId: this.processId }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.lstAccount = rs.items;
        // console.log(rs.items);
      } else {
        this.lstAccount = null;
      }
    })
  }

  arrayTable: Array<any> = [
    {
      id: 1,
      name: "Mobile No.1",
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
    {
      id: 2,
      name: "Mobile No.2",
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
    {
      id: 3,
      name: "Mobile No.3",
      cate: ({
        isDefault: 'Default',
        isService: 'Service',
        isNotify: 'Notify'
      })
    },
  ]

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
  constructor(
    private fb: FormBuilder,
    private _LOCATION: Location, private route: ActivatedRoute,private accountService: AccountService,
    private smsService:SmsService) { }
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
  backPage() {
    this._LOCATION.back()
  }

  onSubmit() {
    // console.log(this.arrayTable)
  }

  // addCol() {
  //   let id = this.arrayTable[this.arrayTable.length - 1].id + 1
  //   this.arrayTable.push({
  //     id,
  //     name: `Mobile No. ${id}`
  //   })
  // }\
  getSmsStatus(){
    this.smsService.getSmsStatus().subscribe(data =>{
     if(data.items){
       this.smsStatus= data.items
       console.log(this.smsStatus);
     }
    })
  }
  getSmsAction(){
    this.smsService.getSmsAction().subscribe(data =>{
      if(data.items){
        this.smsAction= data.items
        console.log(this.smsAction);
      }
     })
  }
  getSmsPackage(){
    this.smsService.getSmsPackage().subscribe(data =>{
      if(data.items){
        this.smsPackage= data.items
        console.log(this.smsPackage);
      }
     })
  }
  getSmsAccount(){
    this.smsService.getSmsAccount().subscribe(data =>{
      if(data.items){
        this.smsAccount= data.items
        console.log(this.smsAccount);
      }
     })
  }
}
