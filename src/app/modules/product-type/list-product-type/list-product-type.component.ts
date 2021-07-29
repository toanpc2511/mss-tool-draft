import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import {
  IDataTransfer,
  ProductTypeModalComponent
} from '../product-type-modal/product-type-modal.component';
import { ProductTypeResponse, ProductTypeService } from '../product-type.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-product-type',
  templateUrl: './list-product-type.component.html',
  styleUrls: ['./list-product-type.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class ListProductTypeComponent implements OnInit {
  searchFormControl: FormControl;
  listStatus = LIST_STATUS;
  dataSource: Array<ProductTypeResponse>;
  dataSourceTemp: Array<ProductTypeResponse>;
  sorting: SortState;

  filterField: FilterField<{
    code: null;
    name: null;
    description: null;
  }>;

  constructor(
    private productTypeService: ProductTypeService,
    private sortService: SortService<ProductTypeResponse>,
    private filterService: FilterService<ProductTypeResponse>,
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
      description: null
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    this.getListProductType();

    // Filter
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

  // Get list product type
  getListProductType() {
    this.productTypeService.getListProductType().subscribe((res) => {
      this.dataSource = this.dataSourceTemp = res.data;
      // Set data after filter and apply current sorting
      this.dataSource = this.sortService.sort(
        this.filterService.filter(this.dataSourceTemp, this.filterField.field)
      );
      this.cdr.detectChanges();
    });
  }

  viewListProduct(): void {
    alert('Danh sách sản phẩm');
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  deleteProductType(item: ProductTypeResponse): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá thông tin nhóm sản phẩm  ${item.code} - ${item.name} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.productTypeService.deleteStation(item.id).subscribe(
          (res) => {
            if (res.data) {
              this.getListProductType();
            }
          },
          (err: IError) => {
            this.checkError(err);
          });
      }
    });
  }
  createModal(data?: IDataTransfer): void {
    const modalRef = this.modalService.open(ProductTypeModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Sửa nhóm sản phẩm' : 'Thêm nhóm sản phẩm',
      product: data
    };

    modalRef.result.then((result) => {
      if (result) {
        this.getListProductType();
      }
    });
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4124') {
      this.toastr.error('Nhóm sản phẩm không thể chỉnh sửa');
    }
  }

}
