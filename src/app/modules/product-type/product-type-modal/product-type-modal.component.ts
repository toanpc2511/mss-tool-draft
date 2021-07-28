import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { ProductTypeResponse, ProductTypeService } from '../product-type.service';

@Component({
  selector: 'app-product-type-modal',
  templateUrl: './product-type-modal.component.html',
  styleUrls: ['./product-type-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ProductTypeModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;
  listStatus = LIST_STATUS;
  productForm: FormGroup;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private productTypeService: ProductTypeService,
    private destroy$: DestroyService
  ) {
 
   }

  ngOnInit(): void {
    this.buildForm();
    this.onSubmit();
  }

  onClose(): void {
    this.modal.close();
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      code: [this.data.product['code'] || '', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      name: [this.data.product['name'] || '', Validators.required],
      description: [this.data.product['description'] || ''],
      status: [this.data.product['status'] ||this.listStatus.ACTIVE, Validators.required]
    })
  }

  onSubmit(): void {
    fromEvent(this.btnSave.nativeElement, 'click').pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe( _ => {
      this.productForm.markAllAsTouched();
      if (this.productForm.invalid) {
        return;
      }
      if (this.data.product === 'create') {
        this.productTypeService.createProductType(this.productForm.getRawValue()).subscribe( _ => {
          callBackEmitter.callBack.emit();
          this.modal.close();
        }, (error : IError) => {
          this.checkError(error);
        });
      } else {
        this.productTypeService.updateProductType(this.data.product['id'], this.productForm.getRawValue()).subscribe( _ => {
          callBackEmitter.callBack.emit();
          this.modal.close();
        }, (error: IError) => {
          this.checkError(error);
        });
      }
    })
    
  }
  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4095') {
      this.productForm.get('code').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4094') {
      this.productForm.get('name').setErrors({ nameExisted: true });
    }
  }

}


export  interface IDataTransfer {
  title: string,
  product: string | ProductTypeResponse
}

export class callBackEmitter {
  static callBack = new EventEmitter();
}

