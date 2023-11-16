import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {first} from 'rxjs/operators';
import {NotificationService} from '../_toast/notification_service';
import {ValidatorSpace} from '../_validator/otp.validator';
import {UserService} from '../_services/user.service';
import {CategoryService} from '../_services/category/category.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  role = '';
  roles = [];
  showValidationMsg: boolean;
  validationMsg: string;
  fieldTextType = false;
  showOtpComponent = true;
  isLogin = false;
  PHONE_PREFIX_LIST = [];
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '60px',
      height: '50px'
    }
  };
  @ViewChild('ngOtpInput', {static: false}) ngOtpInput: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private userService: UserService,
    private category: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      otp: new FormControl('', [ValidatorSpace.cannotContainSpaceOTP])
    });
    this.showValidationMsg = false;
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line:typedef
  get f() {
    return this.loginForm.controls;
  }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.submitted = true;
    this.showValidationMsg = false;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const pass = this.f.password.value + this.f.otp.value;
    this.loading = true;
    this.authenticationService.login(this.f.username.value, pass)
      .pipe(first())
      .subscribe(
        data => {
          this.authenticationService.getUserByUserName(this.f.username.value).subscribe(x => {
            if (x) {
              if (x.message.code === '201') {
                this.showValidationMsg = true;
                this.loading = false;
                this.validationMsg = 'Tài khoản chưa được cấp quyền';
                localStorage.removeItem('currentUser');
              } else if (x.data !== undefined && x.data !== null) {
                localStorage.setItem('userInfo', JSON.stringify(x.data.userInfo));

                localStorage.setItem('role', JSON.stringify(x.data.role));

                this.roles = x.data.roles;
                this.role = this.roles.length > 0 ? this.roles[0].id : 0;
                if (x.data.length > 0 && x.data.role[0] === 'UNIFORM.BANK.KSV') {
                  localStorage.setItem('roleKSV', '1');
                }
                // tslint:disable-next-line:no-shadowed-variable
                this.category.getConfigSetting().subscribe(data => {
                  this.PHONE_PREFIX_LIST = data.items;
                  this.PHONE_PREFIX_LIST.forEach(e => {
                    if (e.key === 'age') {
                      const ageValue = e.valueNumber;
                      localStorage.setItem('yearOldValidate', JSON.stringify(ageValue));
                    }
                  });
                  this.PHONE_PREFIX_LIST.forEach(e => {
                    if (e.key === 'PHONE_PREFIX') {
                      const phonePrefix = e.valueString.split(', ');
                      localStorage.setItem('listPrefixPhone', JSON.stringify(phonePrefix));
                    }
                  });
                });
                if (this.roles.length > 1) {
                  this.isLogin = true;
                } else if (this.roles.length === 1) {
                  this.authenticationService.getUserByUserName2(this.f.username.value, this.roles[0].id).subscribe(x => {
                    localStorage.setItem('action', JSON.stringify(x.data.actions));
                    const frontendAction = this.groupByKey(x.data.actions.filter(action => action.feUrl), 'functionName');
                    localStorage.setItem('frontendAction', JSON.stringify(frontendAction));
                    localStorage.setItem('userRole', JSON.stringify(this.roles[0]));
                    this.router.navigate(['/smart-form/home']);
                  }, error => {
                    this.notificationService.showError('Tài khoản không có quyền truy cập', 'Quyền truy cập');
                  });
                } else {
                  this.notificationService.showError('Tài khoản không có quyền truy cập', 'Quyền truy cập');
                }

                this.loading = false;

              }
            }
          });
        },
        error => {
          this.showValidationMsg = true;
          this.validationMsg = error;
          this.loading = false;
        }
      );
  }

  onOtpChange(otp: any): void {
    // this.otp = otp;
  }

  setVal(val: any): void {
    this.ngOtpInput.setValue(val);
  }

  onConfigChange(): void {
    this.showOtpComponent = false;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  inputLatinUppercase(event): void {
    event.target.value = this.toNoSign(event.target.value);
  }

  // chuyển tiếng việt thành tiếng latin, vd: NGUYỄN VĂN A -> NGUYEN VAN A
  toNoSign(value): any {
    if (value === '') {
      return '';
    }
    let str = value;
    str = str.replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'A');
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'E');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/í|ì|ị|ỉ|ĩ/g, 'I');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'O');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'U');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/y|ỳ|ỵ|ỷ|ỹ/g, 'Y');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|"|;|'|:|/g, '');
    return str;
  }

  selectRole(): void {
    this.authenticationService.getUserByUserName2(this.f.username.value, this.role).subscribe(x => {
      localStorage.setItem('action', JSON.stringify(x.data.actions));
      const frontendAction = this.groupByKey(x.data.actions.filter(action => action.feUrl), 'functionName');
      localStorage.setItem('frontendAction', JSON.stringify(frontendAction));
      const userRole = this.roles.find(item => item.id === this.role);
      localStorage.setItem('userRole', JSON.stringify(userRole));
      this.router.navigate(['/smart-form/home']);
    }, error => {
      this.notificationService.showError('Tài khoản không có quyền truy cập', 'Quyền truy cập');
    });
  }

  groupByKey(array, key): any {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) { return hash; }
        return Object.assign(hash, { [obj[key]]: ( hash[obj[key]] || [] ).concat(obj)});
      }, {});
  }
}

