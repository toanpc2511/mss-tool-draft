import { Component, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/_toast/notification_service';
import { EbankingService } from '../../shared/ebanking.services';
import { ProcessService } from 'src/app/_services/process.service';
import { group } from '@angular/animations';
@Component({
  selector: 'app-ebanking-add-or-edit',
  templateUrl: './ebanking-add-or-edit.component.html',
  styleUrls: ['./ebanking-add-or-edit.component.scss']
})
export class EbankingAddOrEditComponent implements OnInit {
  @Input() actionType = 'CREATE';   // actionType: CREATE-Tạo mới, EDIT-Chỉnh sửa
  @Input() objEbankingSelected;
  @Input() objProcessDetail;
  @Output() changeStep = new EventEmitter();
  formEbanking: FormGroup;
  processId: string;
  submitted = false;
  ebankUserType: any[] = [];
  ebankPackage: any[] = [];
  ebankDeviceType: any[] = [];
  formBanking: any[] = [];
  EMAIL_REGEX = '^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$';
  constructor(
    private fb: FormBuilder,
    private ebankingService: EbankingService,
    private notificationService: NotificationService,
    private router: Router, private route: ActivatedRoute,
    private cifService: ProcessService,
  ) { }

  ngOnInit(): void {
    this.getebankPackage();
    this.getebankDeviceType();
    this.getebankUserType();
    this.initFormEbanking();
    this.getemployeeId.patchValue(JSON.parse(localStorage.getItem('userInfo')).employeeId);
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    if (this.actionType !== 'CREATE' && this.objEbankingSelected) {
      this.fillDataToForm();
    } else if (this.actionType === 'CREATE' && this.objProcessDetail) {
      this.fillDataToElement();
    }
  }
  /**
   * Khởi tạo form Ebanking
   */
  initFormEbanking(): void {
    this.formEbanking = this.fb.group({
      id: [''],
      processId: [''],
      userId: ['', [Validators.required]],                   // User Id
      mobileNo1: ['', [Validators.required]],                // Số điện thoại 1
      mobileNo2: [''],                // Số điện thoại 2
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.EMAIL_REGEX)]],  // email
      isDomestic: [true, [Validators.required]],             // true: Là KH nội địa
      deviceTypeCode: ['SMS', [Validators.required]],        // Phương thức xác thực: sms / soft_token
      userTypeCode: ['USER', [Validators.required]],         // type: user / admin
      servicePackageCode: ['BASIC'],      // Gói dịch vụ: 0-Bạc truy vấn, 1-Gói vàng, 2-Gói kim cương, 3-Gói vàng miễn phí
      state: [''],                    // state
      area: [''],                     // Vùng
      employeeId: [''],               // Mã nhân viên giới thiệu
      reffererCode: [''],              // Mã nhân viên
      actionCode: [''],                 // Mã trạng thái
    }, {
      validators: [this.areaAndStateValidator, this.mobileNoValidator]
    });
  }
  areaAndStateValidator: ValidatorFn = (f: FormGroup) => {
    const isDometic = f.controls.isDomestic.value ? f.controls.isDomestic.value : null ;
    const area = f.controls.area.value ;
    const state = f.controls.state.value ;
    if (isDometic){
      if (area === '' && state === '' ){
        return {allRequire: true};
      }
    }
    return null;
  }
  mobileNoValidator: ValidatorFn = (f: FormGroup) => {
    const mobileNo1 = f.controls.mobileNo1.value;
    const mobileNo2 = f.controls.mobileNo2.value;
    if (mobileNo1 === mobileNo2){
        return {compareMobileNo: true};
    }
    return null;
  }

  fillDataToForm(): void {
    if (this.objEbankingSelected) {
      this.formEbanking.patchValue(this.objEbankingSelected);
    }
  }
  fillDataToElement(): void {
    if (this.objProcessDetail) {
      if (this.objProcessDetail.customer.customerCode) {
        const name = this.objProcessDetail.customer.customerCode;
        const name2 = this.toNoSign(name).toUpperCase();
        this.getUserId.patchValue(name2);
      }

      this.getmobileNo1.patchValue(this.objProcessDetail.customer.person.mobileNo);
    }
  }
  /**
   * Get value form
   */
  get getUserId(): AbstractControl { return this.formEbanking.get('userId'); }
  get getEmail(): AbstractControl { return this.formEbanking.get('email'); }
  get getIsDomestic(): AbstractControl { return this.formEbanking.get('isDomestic'); }
  get getmobileNo1(): AbstractControl { return this.formEbanking.get('mobileNo1'); }
  get getmobileNo2(): AbstractControl { return this.formEbanking.get('mobileNo2'); }
  get getuserTypeCode(): AbstractControl { return this.formEbanking.get('userTypeCode'); }
  get getState(): AbstractControl { return this.formEbanking.get('state'); }
  get getArea(): AbstractControl { return this.formEbanking.get('area'); }
  get getdeviceTypeCode(): AbstractControl { return this.formEbanking.get('deviceTypeCode'); }
  get getservicePackageCode(): AbstractControl { return this.formEbanking.get('servicePackageCode'); }
  get getemployeeId(): AbstractControl { return this.formEbanking.get('employeeId'); }
  get getreffererCode(): AbstractControl { return this.formEbanking.get('reffererCode'); }



  getebankUserType(): void {
    this.ebankingService.ebankUserType().subscribe(
      data => {
        if (data.items) {
          this.ebankUserType = data.items;
        }
      });
  }
  getebankPackage(): void {
    this.ebankingService.ebankPackage().subscribe(
      data => {
        if (data.items) {
          this.ebankPackage = data.items;
        }
      });
  }
  getebankDeviceType(): void {
    this.ebankingService.ebankDeviceType().subscribe(
      data => {
        if (data.items) {
          this.ebankDeviceType = data.items;
        }
      });
  }
  create(): void {
    this.submitted = true;
    this.formEbanking.get('processId').setValue(this.processId);
    this.ebankingService.create(this.formEbanking.value).subscribe(
      rs => {
        if (rs.responseStatus.success) {
          this.notificationService.showSuccess('Thêm mới dịch vụ thành công', '');
          this.changeStep.emit('HOME');
        } else {
          this.notificationService.showError('Thêm mới dịch vụ thất bại', 'Lỗi thêm mới dịch vụ`');
        }
      }
    );
  }
  update(): void {
    this.submitted = true;
    this.formEbanking.get('processId').setValue(this.processId);
    this.ebankingService.update(this.formEbanking.value).subscribe(
      rs => {
        if (rs.responseStatus.success) {
          this.notificationService.showSuccess('Cập nhật dịch vụ thành công', '');
          this.changeStep.emit('HOME');
        } else {
          this.notificationService.showError('Thêm mới dịch vụ thất bại', 'Lỗi thêm mới dịch vụ`');
        }
      }
    );
  }


  inputLatinUppercase(event): void {
    // this.handleCustomInput(event.target, event);
    event.target.value = this.toNoSign(event.target.value);
  }
  // chuyển tiếng việt thành tiếng latin, vd: NGUYỄN VĂN A -> NGUYEN VAN A
  toNoSign(value): string {
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
    // str = str.replace(/1|2|3|4|5|6|7|8|9|0|-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|"|;|'|:| |/g, '');
    // console.log('after ', str);
    return str;
  }

  toNoNumber(value): void {
    let str1 = value;
    str1 = str1.replace('/[^a-zA-Z,.\s]/g');
  }

}



