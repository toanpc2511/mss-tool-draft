import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EFileType, FileService } from '../../../shared/services/file.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ExchangePointManagementService } from '../exchange-point-management.service';
import { IDriver } from '../models/driver.interface';
import { DataResponse } from '../../../shared/models/data-response.model';
import { IError } from '../../../shared/models/error.model';
import { TValidators } from '../../../shared/validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IExchangePointCreator } from '../models/exchange-point-creater.interface';
import { convertMoney } from '../../../shared/helpers/functions';

interface IImage {
  id: number;
  url: string;
  name: string;
}

@Component({
  selector: 'app-exchange-point',
  templateUrl: './exchange-point.component.html',
  styleUrls: ['./exchange-point.component.scss'],
  providers: [DestroyService]
})
export class ExchangePointComponent implements OnInit {

  phoneNumberControl = new FormControl();
  exchangePointForm: FormGroup;
  driver: IDriver = null;
  isSearchable: boolean;
  isSearched = false;
  attachmentImg: IImage;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private fileService: FileService,
              private destroy$: DestroyService,
              private cdr: ChangeDetectorRef,
              private epmService: ExchangePointManagementService,
              private modalService: NgbModal
  ) {
    this.initExchangePointForm();
  }

  ngOnInit(): void {
  }

  initExchangePointForm(): void {
    this.exchangePointForm = this.fb.group({
      phone: [null],
      pointSwap: [null, [TValidators.required, TValidators.min(1)]],
      driverId: [null],
      photoVoucher: [null, TValidators.required]
    })
  }

  onSearch(): void {
    this.exchangePointForm.reset();
    this.attachmentImg = null;
    this.epmService.getDriverInformation(this.phoneNumberControl.value)
      .pipe(
        finalize(() => {
          this.isSearched = true;
          this.cdr.detectChanges();
        })
      )
      .subscribe((res: DataResponse<IDriver>) => {
        this.driver = res.data;
        this.isSearchable = true;
        this.cdr.detectChanges();
      }, ((error: IError) => {
        this.isSearchable = false;
        this.cdr.detectChanges();
      }));
  }

  onReset(): void {
    this.phoneNumberControl.reset();
    this.exchangePointForm.reset();
    this.attachmentImg = null;
    this.isSearched = false;
  }

  onSubmit(): void {
    this.setComparedValidator();
    this.exchangePointForm.markAllAsTouched();
    if (this.exchangePointForm.invalid) {
      return;
    }

    this.openConfirmDialog();
  }

  setFormData(): IExchangePointCreator {
    return {
      phone: this.driver.phone,
      driver_id: this.driver.accountId,
      point_swap: convertMoney(this.exchangePointForm.get('pointSwap').value.toString()),
      photo_vouchers: this.exchangePointForm.get('photoVoucher').value
    }
  }

  openConfirmDialog() {

    const pointSwap: string = this.exchangePointForm.get('pointSwap').value;

    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn đổi ${ pointSwap } của tài xế ${this.driver.name} thành ${ pointSwap } VNĐ không?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.epmService
          .createSwapPoint(this.setFormData())
          .pipe(
            finalize(() => {
              this.onReset();
              this.cdr.detectChanges();
            })
          )
          .subscribe((res: DataResponse<boolean>) => {
            this.toastr.success('Bạn đã đổi điểm thành công');
          });
      }
    });
  }

  setComparedValidator(): void {
    if (convertMoney(this.exchangePointForm.get('pointSwap').value.toString()) > this.driver.point) {
      this.exchangePointForm.controls['pointSwap'].setErrors({ compared: true })
    }
  }

  uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.IMAGE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.data) {
          this.attachmentImg = event.data[0];
          this.exchangePointForm.get('photoVoucher').patchValue([event.data[0].id] , {emitModelToViewChange: false});
        }
        this.cdr.detectChanges();
      });
  }

  addImage($event) {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);

    if (files[0].size > 2000000) {
      this.toastr.error('Dung lượng ảnh quá lớn');
    }

    this.uploadImageFile(files[0]);

    inputElement.value = null;
  }

}
