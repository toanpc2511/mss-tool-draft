import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IProductType, ProductService } from '../product.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ProductModalComponent implements OnInit {
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
  }

  onClose(): void {
    this.modal.close();
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      code: [
        this.data.product?.code || 'SNSP',
        [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
      ],
      name: [this.data.product?.name || '', Validators.required],
      description: [this.data.product?.description || ''],
      status: [this.data.product?.status || this.listStatus.ACTIVE, Validators.required]
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
          this.productService.createProductType(this.productForm.getRawValue()).subscribe(
            () => {
              this.modal.close(true);
            },
            (error: IError) => {
              this.checkError(error);
            }
          );
        } else {
          this.productService
            .updateProductType(this.data.product.id, this.productForm.getRawValue())
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
  product?: IProductType;
}
