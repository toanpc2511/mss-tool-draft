import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS_CUSTOMER, LIST_STATUS_PROFILE_CUSTOMER } from '../../../../shared/data-enum/list-status';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { convertDateToDisplay } from '../../../../shared/helpers/functions';
import { debounceTime, filter, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from '../../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { CustomerManagementService, IInfoCutomer } from '../../customer-management.service';
import { IError } from '../../../../shared/models/error.model';

@Component({
  selector: 'app-info-account',
  templateUrl: './info-account.component.html',
  styleUrls: ['./info-account.component.scss']
})
export class InfoAccountComponent implements OnInit {
  isReadonly: boolean = true;
  numberPhone: string;

  listStatusProfileCustomer = LIST_STATUS_PROFILE_CUSTOMER;
  listStatusCustomer = LIST_STATUS_CUSTOMER;
  dataSource;
  infoForm: FormGroup;
  submit: boolean = true;
  customerId: number;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private customerManagementService: CustomerManagementService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {

  }

  ngOnInit(): void {
    this.buildInfoForm();
    this.getCustomerInfo();
  }

  getCustomerInfo() {
    this.activeRoute.params
      .pipe(
        pluck('customerId'),
        filter((customerId: number) => !!customerId),
        switchMap((customerId: number) => {
          return this.customerManagementService.getCustomerInfo(customerId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.dataSource = res.data;
        this.pathValueForm();
        this.cdr.detectChanges();
      });
  }

  editNumber($event: Event, isReadonly: any) {
    this.isReadonly = !isReadonly;
    const phoneForm = this.infoForm.get('phone');
    isReadonly ? phoneForm.enable() : phoneForm.disable();
  }

  buildInfoForm(): void {
    this.infoForm = this.fb.group({
      phone: [{ value: null, disabled: this.isReadonly }, Validators.required],
      name: [null],
      dateOfBirth: [null],
      idCard: [null],
      rank: [null],
      address: [null],
      statusContract: [null],
      status: [null]
    });

    this.infoForm.get('phone')
      .valueChanges.pipe(
      debounceTime(300)
    )
      .subscribe(() => {
          this.changeValue();
        }
      );

    this.infoForm.get('statusContract')
      .valueChanges.pipe(
      debounceTime(300)
    )
      .subscribe(() => {
          this.changeValue();
        }
      );

    this.infoForm.get('status')
      .valueChanges.pipe(
      debounceTime(300)
    )
      .subscribe(() => {
          this.changeValue();
        }
      );
  }

  pathValueForm() {
    this.infoForm.get('phone').patchValue(this.dataSource?.phone);
    this.infoForm.get('name').patchValue(this.dataSource?.name);
    this.infoForm.get('idCard').patchValue(this.dataSource?.idCard);
    this.infoForm.get('rank').patchValue(this.dataSource?.rank);
    this.infoForm.get('address').patchValue(this.dataSource?.location);
    this.infoForm.get('dateOfBirth').patchValue(convertDateToDisplay(this.dataSource?.dateOfBirth));
    this.infoForm.get('statusContract').patchValue(this.dataSource?.profileStatus);
    this.infoForm.get('status').patchValue(this.dataSource?.accountStatus);
  }

  changeValue() {
    const valuePhone = this.infoForm.get('phone').value;
    const valueStatusContract = this.infoForm.get('statusContract').value;
    const valueStatus = this.infoForm.get('status').value;

    if (
      valuePhone !== this.dataSource?.phone ||
      valueStatus !== this.dataSource?.accountStatus ||
      valueStatusContract !== this.dataSource?.profileStatus
    ) {
      this.submit = false;
    } else {
      this.submit = true;
    }
  }

  onSubmit() {
    const valuePhone = this.infoForm.get('phone').value;
    const valueStatusContract = this.infoForm.get('statusContract').value;
    const valueStatus = this.infoForm.get('status').value;

    if (valuePhone !== this.dataSource?.phone) {
      const modalRef = this.modalService.open(ConfirmDeleteComponent, {
        backdrop: 'static'
      });
      const data: IConfirmModalData = {
        title: 'Cảnh báo',
        message: `Khi sửa số điện thoại, tài xế sẽ phải đăng nhập tài khoản bằng số điện thoại mới. Bạn có chắc chắn muốn cập nhật số điện thoại không?`,
        button: { class: 'btn-primary', title: 'Đồng ý' }
      };
      modalRef.componentInstance.data = data;

      modalRef.result.then((result) => {
        if (result) {
          console.log(valuePhone, valueStatus, valueStatusContract);
        }
      });
    } else {
      console.log(valuePhone, valueStatus, valueStatusContract);
    }
  }

  checkError(error: IError) {
    console.log(error);
  }
}
