import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IAccount, ISupplierViettelPost} from '../../../shared/models/lvbis-config.interface';
import {IError} from '../../../shared/models/error.model';
import {ViettelPostServiceConfigService} from '../../viettel-post-service-config.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {CONTENT_VIETTEL_POST, STATUS_SUPPLIER} from '../../../shared/contants/system-constant';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil, tap} from 'rxjs/operators';
import {DestroyService} from '../../../../shared/services/destroy.service';

declare const $: any;

@Component({
  selector: 'app-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrls: ['./supplier-modal.component.scss'],
  providers: [DestroyService]
})
export class SupplierModalComponent implements OnInit {
  supplierForm: FormGroup;
  listAccount: IAccount[];
  accInfo: string;
  dataSupplier: ISupplierViettelPost;
  statusSupplier = STATUS_SUPPLIER;
  contentKey = CONTENT_VIETTEL_POST;
  accSupplier: IAccount;
  actions: ActionModel[] = [{
    actionName: 'Lưu',
    actionIcon: 'save',
    actionClick: () => this.onSave()
  }];

  constructor(
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private viettelPostService: ViettelPostServiceConfigService,
    private router: Router,
    private destroy$: DestroyService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getIDSupplier();
    this.handleChangeNumberCif();
    this.handleChangeAccNumber();
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      cif: ['', [Validators.required]],
      accNo: ['', [Validators.required]],
      content: ['', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
    });
  }

  getIDSupplier(): void {
    // lay ra param ID Uni
    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          $('.parentName').html('Dịch vụ Viettel Post');
          $('.childName').html(params.id ? 'Sửa thông tin nhà cung cấp' : 'Thêm mới nhà cung cấp');
          if (params.id) {
            this.getDetailSupplier(params.id);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  // Kiem tra ma NCC da ton tai ?
  handleChangeCode(): boolean {
    return this.viettelPostService.getListSupplier(`code|eq|${this.supplierForm.get('code').value}`).subscribe((res) => {
      if (res.data) {
        this.notify.error('Thông báo', 'Mã NCC đã tồn tại. Vui lòng nhập mã khác hoặc chọn chức năng Sửa thông tin');
        this.supplierForm.get('code').patchValue('');
        return true;
      } else {
        return false;
      }
    });
  }

  // Lay thong tin chi tiet NCC theo ID
  getDetailSupplier(id: string): void {
    this.viettelPostService.getDetailSupplier(id)
      .subscribe((res) => {
        if (res.data) {
          this.pathValueForm(res.data);
        }
      });
  }

  // Gan gia tri vào form
  pathValueForm(data: ISupplierViettelPost): void {
    this.dataSupplier = data;
    this.supplierForm.get('code').disable();
    this.supplierForm.patchValue({
      code: data.code,
      name: data.name,
      cif: data.cif,
      accNo: data.accNo,
      accName: data.accName,
      status: data.isActive,
      content: data.content,
    });
    this.searchAccNumberSpecial();
  }

  // tac dong khi thay doi so cif
  handleChangeNumberCif(): void {
    this.supplierForm.get('accNo').patchValue(null);
    this.listAccount = [];
    this.accInfo = null;
  }

// tac dong khi thay doi so tai khoan
  handleChangeAccNumber(): void {
    this.supplierForm.get('accNo').valueChanges
      .subscribe((value) => {
        this.accSupplier = value;
        this.accInfo = value ? `${this.accSupplier?.branchCode} - ${this.accSupplier?.accountName}` : null;
      });
  }

  // Tim kiem STK theo so cif
  searchAccNumberSpecial(): void {
    this.supplierForm.controls.cif.markAllAsTouched();
    if (this.supplierForm.controls.cif.invalid) {
      return;
    }
    const numCif = this.supplierForm.get('cif').value;
    this.supplierForm.get('cif').setErrors(null);
    const params = {customerCifNumber: numCif, pageNumber: 1, recordPerPage: 9999, isConfig: 'true'}; // tai khoan cau hinh, isConfig = true
    this.viettelPostService.searchInfoCustomer(params)
      .subscribe((res) => {
        if (res.data) {
          this.listAccount = res.data;
          if (this.dataSupplier) {
            const accNoSelected = this.listAccount.find((item) => item.accountNumber === this.dataSupplier.accNo);
            this.supplierForm.get('accNo').patchValue(accNoSelected.accountNumber);
            this.accInfo = accNoSelected ? `${accNoSelected?.branchCode}  -  ${accNoSelected?.accountName}` : null;
          }
          // this.cdr.detectChanges();
        }
      }, (error: IError) => this.notify.handleErrors(error));
  }

  onSave(): void {
    this.supplierForm.markAllAsTouched();
    if (this.supplierForm.invalid) {
      return;
    }
    if (this.dataSupplier) {
      this.viettelPostService.updateSupplier(this.handleDataSave(), this.dataSupplier.id)
        .subscribe((res) => {
          if (res.data) {
            this.notify.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/viettel-post-service/viettel-post-config/detail'], {queryParams: {id: res.data.id}});
          }
        }, (error: IError) => this.notify.handleErrors(error));
    } else {
      this.viettelPostService.createSupplier(this.handleDataSave())
        .subscribe((res) => {
          if (res.data) {
            this.notify.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/viettel-post-service/viettel-post-config/detail'], {queryParams: {id: res.data.id}});
          }
        }, (error: IError) => this.notify.handleErrors(error));
    }
  }

  // Lay gia tri tu form vao request
  handleDataSave(): any {
    const valueSupplierForm = this.supplierForm.getRawValue();
    const body = {
      code: valueSupplierForm.code,
      name: valueSupplierForm.name,
      isActive: valueSupplierForm.status,
      cif: valueSupplierForm.cif,
      accNo: this.accSupplier?.accountNumber,
      accName: this.accSupplier?.accountName,
      accBranch: this.accSupplier?.branchCode,
      content: valueSupplierForm.content,
    };
    console.log('body', body);
    return body;
  }
}
