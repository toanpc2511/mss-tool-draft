import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IProduct, ProductService } from '../product.service';

@Component({
  selector: 'app-list-product-fuel-modal',
  templateUrl: './list-product-fuel-modal.component.html',
  styleUrls: ['./list-product-fuel-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ListProductFuelModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;
  listStatus = LIST_STATUS;
  productForm: FormGroup;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.onSubmit();
    console.log('Data : ', this.data);
  }

  onClose(): void {
    this.modal.close();
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      code: [
        this.data.product?.code || 'SNL',
        [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
      ],
      name: [this.data.product?.name || '', Validators.required],
      unit: [this.data.product?.unit || '', Validators.required],
      entryPrice: [
        this.data.product?.entryPrice || '',
        [Validators.required]
      ],
      vat: [this.data.product?.tax || ''],
      description: [this.data.product?.description || ''],
      status: [this.data.product?.status || this.listStatus.ACTIVE, Validators.required],
      priceAreaOne: [
        this.data.product?.priceAreaOne || '',
        [Validators.required]
      ],
      priceAreaTwo: [
        this.data.product?.priceAreaTwo || '',
        [Validators.required]
      ],
    });
  }

  onSubmit(): void {
    fromEvent(this.btnSave.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe((_) => {
        this.productForm.markAllAsTouched();
        if (this.productForm.invalid) {
          return;
        }
        if (!this.data.product) {
          this.productService.createProduct(this.productForm.getRawValue()).subscribe(
            () => {
              this.modal.close(true);
            },
            (error: IError) => {
              this.checkError(error);
            }
          );
        } else {
          this.productService
            .updateProduct(this.data.product.id, this.productForm.getRawValue())
            .subscribe(
              () => {
                this.modal.close(true);
              },
              (error: IError) => {
                this.checkError(error);
              }
            );
        }
      });
  }
  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4154') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4153') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
    if (err.code === 'SUN-OIL-4088') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
    if (err.code === 'SUN-OIL-4089') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
  }
}

export interface IDataTransfer {
  title: string;
  product?: IProduct;
}
