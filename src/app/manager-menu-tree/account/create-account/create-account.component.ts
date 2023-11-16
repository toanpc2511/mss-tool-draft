import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { CreateAccount } from 'src/app/_models/account';
import { AccountService } from 'src/app/_services/account.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ConstantUtils } from 'src/app/_utils/_constant';
import { Process } from 'src/app/_models/process/Process';
import { CifCondition } from 'src/app/_models/cif';

declare var $: any;

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  createAccountForm: FormGroup;
  submitted = false;
  processId: any;
  detailProcess: DetailProcess = new DetailProcess(null);
  objCreateAccount: CreateAccount = new CreateAccount();
  branchName: string;
  accountNumber: any;
  lstCurrency: [] = [];
  lstAccountProduct: any[] = [];
  lstAccountClass: [] = [];
  lstAccountClassMap: any[] = [];
  typeAccount = '';
  typeCurren = '';
  typeCurrency: any;
  accClassId: any;
  checkAccoutClass: boolean;
  accountClassName: any;
  constant: ConstantUtils = new ConstantUtils();
  process: Process = new Process();
  customerName = '';
  loading = false;
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  employee: any;
  sucess = false;
  constructor(
    private router: Router, private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private location: Location,
    private missionService: MissionService,
    private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    $('.childName').html('Thêm tài khoản');
    $('.click-link').addClass('active');
    this.missionService.setProcessId(this.processId);
    this.processId = this.route.snapshot.paramMap.get('processId');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // console.log('userInfo', userInfo.employeeId);
    this.objCreateAccount.employeeId = userInfo.employeeId;
    this.objCreateAccount.branchCode = userInfo.branchCode;
    this.branchName = userInfo.branchName.toUpperCase();
    this.accountNumber = 'Tài khoản mới - ' + Math.floor(100000 + Math.random() * 900000);
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')));
    this.createAccountForm = new FormGroup({
      accountName: new FormControl(''),
      acountNumber: new FormControl('', Validators.required),
      typeCurrency: new FormControl('', Validators.required),
      typeAccountHtml: new FormControl('', Validators.required),
      codeAccount: new FormControl('', Validators.required),
      packageAccount: new FormControl(''),
      minimumMaintenanceBalance: new FormControl('', [Validators.required, Validators.maxLength(19)]),
      employeeId: new FormControl(userInfo.employeeId, Validators.required),
      description: new FormControl('', Validators.required),
    });
    this.employee = this.employeeCode.patchValue(userInfo.employeeId);
    console.log(userInfo.employeeId);
    this.getLstAllCurrency();
    this.getLstAccountProduct();
    this.getLstAccountClass();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
  }
  get accountName(): AbstractControl { return this.createAccountForm.get('accountName'); }
  get employeeCode(): AbstractControl { return this.createAccountForm.get('employeeId'); }
  get getTypeCurrency(): AbstractControl { return this.createAccountForm.get('typeCurrency'); }

  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.customerName = data.item.customer.person.fullName;
        this.accountName.patchValue(data.item.customer.person.fullName);
      }
    }, error => {
    }, () => { }
    );
  }

  getLstAllCurrency(): void {
    this.accountService.getLstAllCurrency().subscribe(rs => {
      const returnLstCurrency = rs.items.filter(e => e.code === this.constant.VND
        || e.code === this.constant.USD
        || e.code === this.constant.EUR);
      this.lstCurrency = returnLstCurrency;
      console.log(this.lstCurrency); if (this.lstCurrency !== undefined && this.lstCurrency.length > 0) {
        const tA = this.typeAccount !== '' ? ' - ' + this.typeAccount : '';
        this.typeCurren = ' - ' + rs.items[0].code;
        this.objCreateAccount.currencyCode = rs.items[0].id;
        this.typeCurrency = rs.items[0].code;
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + tA + this.typeCurren;
      } else {
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + ' - ' + this.typeCurren;
      }
    });
  }

  // loại tài khoản
  getLstAccountProduct(): void {
    this.accountService.getLstAccountProduct().subscribe(rs => {
      this.lstAccountProduct = rs.items;
      const item = rs.items;
      this.getTypeCurrency.valueChanges.subscribe(
        x => {
          this.lstAccountProduct = [];
          item.forEach(element => {
            if (element.currencyCodes.includes(x)) {
              this.lstAccountProduct.push(element);
            }
          });
          return this.lstAccountProduct;
        }
      );
    });
  }


  // mã tài khoản
  getLstAccountClass(): void {
    this.accountService.getLstAccountClass().subscribe(rs => {
      this.lstAccountClass = rs.items;
    });
  }

  onChangeAccountClass(value): void {
    this.objCreateAccount.minBalance = undefined;
    this.lstAccountClassMap.forEach(rs => {
      if (value === rs.code) {
        this.objCreateAccount.accountClassCode = rs.code;
        // this.checkAccoutClass = true
        // this.accountClassName = rs['name']
        return;
      }
    });
    this.getAccountMinBal(value);
  }

  onBlurMethod(val: any): void {
    let str = val.toString();
    const parts = false;
    let output = [];
    let i = 1;
    let formatted = null;
    // if (str.indexOf('.') > 0) {
    //   parts = str.split('.');
    //   str = parts[0];
    // }
    str = str.split('').reverse();
    if (str.indexOf('.') < 0) {
      for (let j = 0, len = str.length; j < len; j++) {
        if (str[j] !== ',') {
          output.push(str[j]);
          if (i % 3 === 0 && j < (len - 1)) {
            output.push('.');
          }
          i++;
        }
      }
    } else {
      output = val;
    }
    formatted = output.reverse().join('');
    this.objCreateAccount.minBalance = formatted;
    console.log(this.sucess);
  }

  onChangeAccountCurrency(value): void {
    this.typeCurren = ' - ' + value;
    const typeAccount = this.typeAccount !== '' ? ' - ' + this.typeAccount : '';
    // this.getAccountMinBal(value)
    this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + typeAccount + this.typeCurren;
    this.lstCurrency.forEach(rs => {
      // tslint:disable-next-line:no-string-literal
      const val: string = rs['code'];
      if (val === value) {
        // tslint:disable-next-line:no-string-literal
        this.objCreateAccount.currencyCode = rs['code'];
        this.changeCodeAccount();
        return;
      }
    });
  }

  onChangeAccountProduct(value): void {
    // this.getAccountMinBal(value)
    this.lstAccountProduct.forEach(rs => {
      // tslint:disable-next-line:no-string-literal
      const val: string = rs['code'];
      if (val === value) {
        // tslint:disable-next-line:no-string-literal
        this.objCreateAccount.accountProductCode = rs['code'];
        // tslint:disable-next-line:no-string-literal
        this.typeAccount = rs['name'];
        this.objCreateAccount.accountDescription = this.objCreateAccount.accountName + ' - ' + this.typeAccount + this.typeCurren;
        this.changeCodeAccount();
        return;
      }
    });

  }

  changeCodeAccount(): void {
    this.lstAccountClassMap = [];
    this.checkAccoutClass = false;
    this.objCreateAccount.minBalance = undefined;
    this.objCreateAccount.accountClassCode = undefined;
    this.accountClassName = '';

    if (this.objCreateAccount.currencyCode !== undefined
      && this.objCreateAccount.accountProductCode !== undefined) {
      this.lstAccountClass.forEach(rs => {
        // tslint:disable-next-line:no-string-literal
        const currencies: [] = rs['currencies'];
        // tslint:disable-next-line:no-string-literal
        const products: [] = rs['products'];
        // tslint:disable-next-line:no-string-literal
        if (rs['currencies'] !== null && rs['products']
        // tslint:disable-next-line:no-string-literal
          !== null && rs['currencies']
          // tslint:disable-next-line:no-string-literal
          !== undefined && rs['products'] !== undefined) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < currencies.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < products.length; j++) {
              // tslint:disable-next-line:no-string-literal
              if (currencies[i]['currencyCode'] === this.objCreateAccount.currencyCode
              // tslint:disable-next-line:no-string-literal
                && products[j]['accountProductCode'] === this.objCreateAccount.accountProductCode) {
                const obj = {
                  code: '',
                  name: '',
                  value: ''
                };
                // tslint:disable-next-line:no-string-literal
                obj.code = rs['code'] + ' - ' + this.objCreateAccount.accountProductCode;
                // tslint:disable-next-line:no-string-literal
                obj.name = rs['code'] + ' - ' + rs['name'];
                // tslint:disable-next-line:no-string-literal
                obj.value = rs['code'];
                this.lstAccountClassMap.push(obj);
              }
            }
          }

        }
      });
      this.createAccountForm.get('codeAccount').setValue('');
    }
  }

  // số dư tối thiểu
  getAccountMinBal(value: any): void {
    this.accountService.getAccountMinBal().subscribe(rs => {
      if (rs.items.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.items.length; index++) {
          if (rs.items[index].accountClassCode.includes(value)) {
            if (rs.items[index].minBalance !== null
              && rs.items[index].minBalance !== ''
              && rs.items[index].minBalance !== undefined) {
              this.onBlurMethod(rs.items[index].minBalance);
            }
            break;
          }
        }
      }
    });
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.createAccountForm.controls;
  }

  backPage(): void {
    //  $('.childName').html('Danh sách tài khoản')
    this.location.back();
  }

  createAccount(): void {
    this.loading = true;
    this.submitted = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    if (this.createAccountForm.invalid) {
      return;
    }
    this.objCreateAccount.accountTypeCode = 'S';
    this.objCreateAccount.processId = this.processId;
    this.objCreateAccount.minBalance = this.objCreateAccount.minBalance.toString().replace(/\./g, '');
    this.accountService.createAccount(this.objCreateAccount).subscribe(rs => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.codes[index].code === '200') {

          this.notificationService.showSuccess('Thêm mới tài khoản thành công', '');
          this.router.navigate(['./smart-form/manager/account', { processId: this.processId }]);
        } else {
          this.notificationService.showError('Thêm mới tài khoản thất bại', '');
        }
      }
    }, err => {
      this.notificationService.showError(err, '');
      // tslint:disable-next-line:no-unused-expression
      err;
    });
    // $('.childName').html('Thêm tài khoản')
  }

}
