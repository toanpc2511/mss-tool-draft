import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IProduct, ProductService } from '../product.service';

@Component({
  selector: 'app-list-product-fuel-modal',
  templateUrl: './list-product-fuel-modal.component.html',
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
    const dataProrduct = this.data.product;
    if (dataProrduct) {
      this.productForm = this.fb.group({
        code: [
          dataProrduct.code,
          [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
        ],
        name: [dataProrduct.name, Validators.required],
        unit: [dataProrduct.unit, Validators.required],
        entryPrice: [
          this.formatMoney(dataProrduct.entryPrice  > 0 ? dataProrduct.entryPrice : 0),
          [Validators.required]
        ],
        valueAddedTax: [typeof dataProrduct.vat !== 'object' ? this.formatMoney(dataProrduct.vat  > 0 ? dataProrduct.vat : 0) : ''],
        description: [dataProrduct.description],
        priceArea1: [
          this.formatMoney(dataProrduct.priceAreaOne  > 0 ? dataProrduct.priceAreaOne : 0),
          [Validators.required]
        ],
        priceArea2: [
          this.formatMoney(dataProrduct.priceAreaTwo  > 0 ? dataProrduct.priceAreaTwo : 0),
          [Validators.required]
        ],
        price: 0
      });
      // this.formatMoney(dataProrduct.vat  > 0 ? dataProrduct.vat : 0)
    } else {
      this.productForm = this.fb.group({
        code: [
          'SNL',
          [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
        ],
        name: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        entryPrice: ['', [Validators.required]],
        valueAddedTax: [''],
        description: [''],
        priceArea1: ['', [Validators.required]],
        priceArea2: ['', [Validators.required]],
        price: 0
      });
    }
  }

  onSubmit(): void {
    fromEvent(this.btnSave.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.productForm.markAllAsTouched();
        if (this.productForm.invalid) {
          return;
        }
        const valueForm = {...this.productForm.getRawValue()};
        valueForm.entryPrice = Number(valueForm.entryPrice.split(',').join(''));
        valueForm.priceArea1 = Number(valueForm.priceArea1.split(',').join(''));
        valueForm.priceArea2 = Number(valueForm.priceArea2.split(',').join(''));
        valueForm.valueAddedTax = valueForm.valueAddedTax !== '' ?  Number(valueForm.valueAddedTax) : '';
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

  formatMoney(n) {
    if (n !== '' && n >= 0) {
      return  (Math.round(n * 100) / 100).toLocaleString().split('.').join(',');
    }
  }
}

export interface IDataTransfer {
  title: string;
  product?: IProduct;
}
