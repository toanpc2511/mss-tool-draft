import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { IProduct, ProductService } from '../product.service';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IDataTransfer, ListProductFuelModalComponent } from '../list-product-fuel-modal/list-product-fuel-modal.component';

@Component({
  selector: 'app-list-product-fuel',
  templateUrl: './list-product-fuel.component.html',
  styleUrls: ['./list-product-fuel.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})

export class ListProductFuelComponent implements OnInit {
  searchFormControl: FormControl;
  listStatus = LIST_STATUS;
  dataSource: Array<IProduct>;
  dataSourceTemp: Array<IProduct>;
  sorting: SortState;
  categoryId = 1;

  filterField: FilterField<{
    code: null;
    name: null;
  }>;

  productTypes: any = [
    {id: 1, type: 'Nhiên liệu'},
    {id: 2, type: 'Khác'},
  ];

  constructor(
    private productService: ProductService,
    private sortService: SortService<IProduct>,
    private filterService: FilterService<IProduct>,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.dataSource = this.dataSourceTemp = [];
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: null,
      name: null,
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit(): void {
    this.getListProduct();

    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value.trim());
        } else {
          this.filterField.setFilterFieldValue(null);
        }
        // Set data after filter and apply current sorting
        this.dataSource = this.sortService.sort(
          this.filterService.filter(this.dataSourceTemp, this.filterField.field)
        );
        this.cdr.detectChanges();
      });
  }
  getListProduct(): void {
    this.productService.getListProduct(this.categoryId).subscribe((res) => {
    this.dataSource = this.dataSourceTemp = res.data;
    this.dataSource = this.sortService.sort(
      this.filterService.filter(this.dataSourceTemp, this.filterField.field)
    );
    console.log('list product: ', res.data);
    this.cdr.detectChanges();
    });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }

  deleteProduct($event: Event, item: IProduct): void {
    $event.stopPropagation();
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá thông tin sản phẩm  ${item.code} - ${item.name} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.productService.deleteProduct(item.id).subscribe(
          (res) => {
            if (res.data) {
              this.getListProduct();
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });
  }

  createModal($event?: Event, data?: IDataTransfer): void {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ListProductFuelModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Sửa sản phẩm' : 'Thêm sản phẩm',
      product: data
    };

    modalRef.result.then((result) => {
      if (result) {
        this.getListProduct();
      }
    });
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4123') {
      this.toastr.error('Category not found');
    }
    if (error.code === 'SUN-OIL-4258') {
      this.toastr.error('chưa update SRS');
    }
  }
}