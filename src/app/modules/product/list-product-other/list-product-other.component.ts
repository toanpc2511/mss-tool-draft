import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';
import { IProductType, ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { IDataTransfer, ListProductOtherModalComponent } from '../list-product-other-modal/list-product-other-modal.component';

@Component({
  selector: 'app-list-product-other',
  templateUrl: './list-product-other.component.html',
  styleUrls: ['./list-product-other.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ListProductOtherComponent implements OnInit {
  searchForm: FormGroup;
  listStatus = LIST_STATUS;
  dataSource;

  productTypes: Array<IProductType> = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal,
  ) {
    this.dataSource = [
      {
        productType: 'a',
        productName: 'f',
        productCode: 'd',
        importPrice: 1000800,
        exportPrice: 898900,
        unit: 'Cái',
        vat: 15,
        status: 'ACTIVE',
        qrCode: 'CREATED'
      },
      {
        productType: 'e',
        productName: 'f',
        productCode: 'd',
        importPrice: 47800000,
        exportPrice: 54680000,
        unit: 'Cái',
        vat: 19,
        status: 'INACTIVE',
        qrCode: 'NOTCREATED'
      }
    ]
  }

  ngOnInit(): void {
    this.productService
      .getListProductType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.productTypes = res.data;
        this.cdr.detectChanges();
      });

    this.buildForm();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      productType: [null],
      productName: [null],
      productCode: [null],
      importPriceFrom: [null],
      importPriceTo: [null],
      exportPriceFrom: [null],
      exportPriceTo: [null],
      status: [null],
      qrCode: [null]
    })
  }

  onSearch() {
    console.log(this.searchForm.value);
  }

  onReset() {
    this.buildForm();
  }

  createModal($event?: Event, data?: IDataTransfer) {

    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ListProductOtherModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Sửa sản phẩm' : 'Thêm sản phẩm',
      product: data
    };

    modalRef.result.then((result) => {
      if (result) {
      }
    });
  }

  deleteProduct($event: Event, item: any) {
    $event.stopPropagation();
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá thông tin sản phẩm  ${item.productCode} - ${item.productName} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.productService.deleteProductType(item.id).subscribe(
          (res) => {
            if (res.data) {
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });
  }

  checkError(err: IError) {
    this.toastr.error(`err`);
  }

}
