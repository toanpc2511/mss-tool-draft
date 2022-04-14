import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {IPaginatorState, PaginatorState} from "../../../_metronic/shared/crud-table";
import {FormBuilder, FormGroup} from "@angular/forms";
import {
  IFuelInventory,
  IGasFieldByStation,
  InventoryManagementService,
  IStationActiveByToken
} from "../inventory-management.service";
import {takeUntil} from "rxjs/operators";
import {DestroyService} from "../../../shared/services/destroy.service";
import {ToastrService} from "ngx-toastr";
import {IProduct, ProductService} from "../../product/product.service";

@Component({
  selector: 'app-fuel-inventory-list',
  templateUrl: './fuel-inventory-list.component.html',
  styleUrls: ['./fuel-inventory-list.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class FuelInventoryListComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  dataSource: IFuelInventory[] = [];
  stationByToken: IStationActiveByToken[] = [];
  listGasField: IGasFieldByStation[] = [];
  products: IProduct[] = [];
  categoryId = 0;

  constructor(
    private inventoryManagementService: InventoryManagementService,
    private productService: ProductService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.init();
  }
  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
  }

  ngOnInit(): void {
    this.getStationToken();
    this.getListProductFuel();
    this.buildFormSearch();
    this.handleListGasField();
    this.onSearch();
  }

  buildFormSearch() {
    this.searchForm = this.fb.group({
      stationId: [''],
      gasFieldId: [''],
      productId: ['']
    })
  }

  onReset() {
    this.ngOnInit();
  }

  getStationToken() {
    this.inventoryManagementService
      .getStationByToken('NOT_DELETE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

  handleListGasField() {
    this.searchForm.get('stationId').valueChanges
      .subscribe((value) => {
        this.searchForm.get('gasFieldId').patchValue('');
        this.inventoryManagementService.getGasFields(value, 'NOT_DELETE')
          .subscribe((res) => {
            this.listGasField = res.data;
            this.cdr.detectChanges();
          })
      })
  }

  getListProductFuel() {
    this.productService
      .getListProduct(this.categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.products = res.data;
        this.cdr.detectChanges();
      });
  }

  onSearch() {
    const valueFormSearch = this.searchForm.value;
    this.inventoryManagementService.getListFuelInventory(this.paginatorState.page, this.paginatorState.pageSize, valueFormSearch)
      .subscribe((res) =>{
          if (res) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.dataSource = res.data;
            this.paginatorState.recalculatePaginator(res.meta.total);
            this.cdr.detectChanges();
          }
      })
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }
}

export interface IValueSearchFuelInventory {
  stationId: string,
  gasFieldId:  string,
  productId: string
}
