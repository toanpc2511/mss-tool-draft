import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IProduct, ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.onSubmit();
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
      valueAddedTax: [this.data.product?.vat || ''],
      description: [this.data.product?.description || ''],
      priceArea1: [
        this.data.product?.priceAreaOne || '',
        [Validators.required]
      ],
      priceArea2: [
        this.data.product?.priceAreaTwo || '',
        [Validators.required]
      ],
      price: 0
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
        console.log('form: ', this.productForm.getRawValue());
        const valueForm = {...this.productForm.getRawValue()};
        valueForm.entryPrice = Number(valueForm.entryPrice.split(',').join(''));
        valueForm.priceArea1 = Number(valueForm.priceArea1.split(',').join(''));
        valueForm.priceArea2 = Number(valueForm.priceArea2.split(',').join(''));
        valueForm.valueAddedTax = Number(valueForm.valueAddedTax);
        valueForm.price = Number(valueForm.price);
        if (!this.data.product) {
          this.productService.createProduct(valueForm).subscribe(
            () => {
              this.modal.close(true);
            },
            (error: IError) => {
              this.checkError(error);
            }
          );
        } else {
          this.productService
            .updateProduct(this.data.product.id, valueForm)
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
    if (err.code === 'SUN-OIL-4711') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4710') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
    if (err.code === 'SUN-OIL-4790') {
      this.toastr.error('Nhập thuế không nằm trong khoảng 0-100');
    }
  }
}

export interface IDataTransfer {
  title: string;
  product?: IProduct;
}
