import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';
import { ProductService } from '../product.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { fromEvent } from 'rxjs';
import { IError } from '../../../shared/models/error.model';

@Component({
  selector: 'app-list-product-other-modal',
  templateUrl: './list-product-other-modal.component.html',
  providers: [DestroyService, FormBuilder]
})
export class ListProductOtherModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;

  listStatus = LIST_STATUS;
  productTypes;
  productForm: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    ) { }

  ngOnInit(): void {
    this.productService
      .getListProductType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.productTypes = res.data;
        this.cdr.detectChanges();
      });

    this.buildForm();
    this.onSubmit();
  }

  buildForm() {
    this.productForm = this. fb.group({
      code: ['SSP', Validators.required],
      name: [null, Validators.required],
      type: [null, Validators.required],
      importPrice: [null, Validators.required],
      exportPrice: [null, Validators.required],
      valueAddedTax: [null],
      unit: [null, Validators.required],
      description: [null],
      status: [null],
      checkQR: [false]
    })
  }

  onSubmit(): void {
    fromEvent(this.btnSave.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.productForm.markAllAsTouched();
        if (this.productForm.invalid) {
          return;
        }
      });
  }

  onClose() {
    // this.modal.close();
    console.log(this.productForm.value);
  }

  checkError(err: IError) {
    console.log(err);
  }

}

export interface IDataTransfer {
  title: string;
  product?: any;
}
