import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {IError} from '../../../shared/models/error.model';
import {TuitionServiceConfigService} from '../../tuition-service-config.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {
  PERIOD_DETAILS_TUITION,
  PREFIXS_TUITION,
  STATUS_SUPPLIER,
} from '../../../shared/contants/system-constant';
import {
  IAccount,
  IMetadataUniversity, IPaymentGroupTuition,
  IPaymentRule,
  IRuleResponseTuition,
  IUniversity
} from '../../../shared/models/lvbis-config.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil, tap} from 'rxjs/operators';

declare const $: any;
import {DestroyService} from '../../../../shared/services/destroy.service';

@Component({
  selector: 'app-university-modal',
  templateUrl: './university-modal.component.html',
  styleUrls: ['./university-modal.component.scss'],
  providers: [DestroyService]
})
export class UniversityModalComponent implements OnInit {
  universityForm: FormGroup;
  statusUni = STATUS_SUPPLIER;
  // periodDetails: any [];
  // prefixs: any [];
  prefixs = PREFIXS_TUITION;
  periodDetails = PERIOD_DETAILS_TUITION;
  dataUni: IUniversity;
  listAccount: IAccount[];
  listTypeConnect: IRuleResponseTuition[];
  listTypeSemesterPay: IRuleResponseTuition[];
  listTypePayment: IRuleResponseTuition[];
  universityMetadata: IMetadataUniversity;
  paymentRules: IPaymentGroupTuition[];
  accInfo: string;
  accUni: IAccount;
  actions = [
    {
      actionName: 'Lưu',
      actionIcon: 'save',
      actionClick: () => this.onSave(),
    },
  ];
  constructor(
    private fb: FormBuilder,
    private tuitionService: TuitionServiceConfigService,
    private notypfy: CustomNotificationService,
    private router: Router,
    private destroy$: DestroyService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.initForm();
  }

  initForm(): void {
    this.universityForm = this.fb.group({
      uniCode: ['', [Validators.required]],
      uniName: ['', [Validators.required]],
      accNo: ['', [Validators.required]],
      serviceId: [''],
      numCif: ['', [Validators.required]],
      accVat: ['', [Validators.required]],
      accFee: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      typeConnect: ['', [Validators.required]],
      typeSemesterPay: ['', [Validators.required]],
      typePayment: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      periodDetail: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getIDUni();
    this.getPaymentGroup();
    this.handleChangeNumberCif();
    this.handleChangeAccNumber();
    // this.prefixs = PREFIXS_TUITION;
    // this.periodDetails = PERIOD_DETAILS_TUITION;
  }

// tac dong khi thay doi so cif
  handleChangeNumberCif(): void {
    // this.universityForm.get('numCif').valueChanges
    //   .subscribe(() => {
    //     // this.universityForm.get('accNo').patchValue(null);
    //     this.listAccount = [];
    //     this.accInfo = null;
    //   });
    this.universityForm.get('accNo').patchValue(null);
    this.listAccount = [];
    this.accInfo = null;
  }

// tac dong khi thay doi so tai khoan
  handleChangeAccNumber(): void {
    this.universityForm.get('accNo').valueChanges
      .subscribe((value) => {
        this.accUni = value;
        this.accInfo = value ? `${this.accUni?.branchCode} - ${this.accUni?.accountName}` : null;
      });
  }


  getIDUni(): void {
    // lay ra param ID Uni
    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          $('.parentName').html('Dịch vụ thu học phí');
          $('.childName').html(params.id ? 'Sửa thông tin nhà trường' : 'Thêm mới nhà trường');
          if (params.id) {
            this.getDetailUniversity(params.id);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

// Lay thong tin chi tiet truong theo ID
  getDetailUniversity(id: string): void {
    this.tuitionService.getDetailUniversity(id)
      .subscribe((res) => {
        if (res.data) {
          this.pathValueForm(res.data);
          // this.patchValueAccNo();
        }
      });
  }

  // Gan gia tri vào form
  pathValueForm(data: IUniversity): void {
    this.dataUni = data;
    this.universityForm.get('uniCode').disable();
    this.universityMetadata = data.universityMetadata;
    this.universityForm.patchValue({
      uniCode: data.code,
      uniName: data.name,
      // accNo: data.accNo,
      serviceId: data.universityMetadata.serviceId,
      numCif: data.customerNo,
      accVat: data.accVat,
      accFee: data.accFee,
      status: data.statusCode,
      typeConnect: data.typeConnect,
      typeSemesterPay: data.typeSemesterPay,
      typePayment: data.typePayment,
      prefix: data.universityMetadata.prefixFormat,
      periodDetail: data.universityMetadata.billFormat,
    });
    this.searchAccNumberSpecial();
  }

// lay ra danh sach lua chon Quy tac thanh toan
  getPaymentGroup(): void {
    this.tuitionService
      .getFormGroups().toPromise()
      .then((res) => {
        this.paymentRules = res.data;
        this.paymentRules.forEach(item => {
          switch (item.code) {
            case 'TypeConnect':
              this.listTypeConnect = item.ruleResponses;
              break;
            case 'TypeSemesterPay':
              this.listTypeSemesterPay = item.ruleResponses;
              break;
            case 'TypePayment':
              this.listTypePayment = item.ruleResponses;
              break;
          }
        });
        // this.paymentRules.forEach(e => {
        //   if (e.code === 'TypeConnect') {
        //     this.listTypeConnect = e.ruleResponses;
        //     console.log('TypeConnect', this.listTypeConnect);
        //   } else {
        //     if (e.code === 'TypeSemesterPay') {
        //       this.listTypeSemesterPay = e.ruleResponses;
        //       console.log('TypeSemesterPay', this.listTypeSemesterPay);
        //     } else {
        //       if (e.code === 'TypePayment') {
        //         this.listTypePayment = e.ruleResponses;
        //         console.log('TypePayment', this.listTypePayment);
        //       }
        //     }
        //   }
        // });
      });
  }

  // Tim kiem STK theo so cif
  searchAccNumberSpecial(): void {
    console.log('searchAccNumberSpecial -- ');
    this.universityForm.controls.numCif.markAllAsTouched();
    if (this.universityForm.controls.numCif.invalid) {
      return;
    }
    const numCif = this.universityForm.get('numCif').value;
    this.universityForm.get('numCif').setErrors(null);
    const params = {customerCifNumber: numCif, pageNumber: 1, recordPerPage: 9999, isConfig: 'true'}; // tai khoan cau hinh, isConfig = true
    this.tuitionService.searchInfoCustomer(params)
      .subscribe((res) => {
        if (res.data) {
          this.listAccount = res.data;
          if (this.dataUni) {
            const accNoSelected = this.listAccount.find((item) => item.accountNumber === this.dataUni.accNo);
            this.universityForm.get('accNo').patchValue(accNoSelected.accountNumber);
            this.accInfo = accNoSelected ? `${accNoSelected?.branchCode}  -  ${accNoSelected?.accountName}` : null;
          }
          // this.cdr.detectChanges();
        }
      }, (error: IError) => this.checkError(error));
  }

  checkError(error: IError): void {
    if (error.code) {
      if (error.code === 'uni01-00-5055') {
        this.universityForm.get('supplierCode').setErrors({isExist: true});
        this.notypfy.error('Lỗi', 'Mã nhà trường đã tồn tại. Vui lòng kiểm tra lại.');
      } else {
        this.notypfy.error('Lỗi', error.message);
      }
    } else {
      this.notypfy.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  onSave(): void {
    // if (this.checkFormInvalid()) { return; }
    this.universityForm.markAllAsTouched();
    if (this.universityForm.invalid) {
      return;
    }
    if (this.dataUni) {
      this.tuitionService.updateUniversity(this.handleDataSave(), this.dataUni.id)
        .subscribe((res) => {
          if (res.data) {
            this.notypfy.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/tuition-service/university-config/detail'], {queryParams: {id: res.data.id}});
          }
        }, (error: IError) => this.checkError(error));
    } else {
      this.tuitionService.createUniversity(this.handleDataSave())
        .subscribe((res) => {
          if (res.data) {
            this.notypfy.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/tuition-service/university-config/detail'], {queryParams: {id: res.data.id}});
          }
        }, (error: IError) => this.notypfy.handleErrors(error));
    }
  }

  // Lay gia tri tu form vao request
  handleDataSave(): any {
    const valueUniversityForm = this.universityForm.getRawValue();
    const body = {
      name: valueUniversityForm.uniName,
      code: valueUniversityForm.uniCode,
      typeConnect: valueUniversityForm.typeConnect,
      isActive: valueUniversityForm.status,
      typeSemesterPay: valueUniversityForm.typeSemesterPay,
      typePayment: valueUniversityForm.typePayment,
      accNo: this.accUni?.accountNumber,
      customerNo: valueUniversityForm.numCif,
      accVat: valueUniversityForm.accVat,
      accFee: valueUniversityForm.accFee,
      accName: this.accUni?.accountName,
      branchAccNo: this.accUni?.branchCode,
      universityMetadata: {
        type: 'TUITION_SERVICE',
        service: '',
        serviceId: valueUniversityForm.serviceId,
        productCode: '',
        merchantId: '',
        prefixFormat: valueUniversityForm.prefix,
        billFormat: valueUniversityForm.periodDetail
      }
    };
    console.log('body', body);
    return body;
  }
}
