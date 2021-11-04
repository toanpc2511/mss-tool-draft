import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct, ProductService } from '../product/product.service';
import { DestroyService } from '../../shared/services/destroy.service';
import { FileService } from '../../shared/services/file.service';
import * as moment from 'moment';
import { IPaginatorState, PaginatorState } from '../../_metronic/shared/crud-table';
import { takeUntil } from 'rxjs/operators';
import {
  HistoryUsingPointsService,
  IFilterUsingPoint,
  IPaymentMethod,
  IStationEployee
} from './history-of-using-points.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { IFilterTransaction } from '../transaction/transaction.service';

@Component({
  selector: 'app-history-of-using-points',
  templateUrl: './history-of-using-points.component.html',
  styleUrls: ['./history-of-using-points.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class HistoryOfUsingPointsComponent implements OnInit {
  dataSource = [];
  searchForm: FormGroup;
  paymentMethods: Array<IPaymentMethod> = [];
  stationEmployee: Array<IStationEployee> = [];
  dataProduct: Array<IProduct> = [];
  firstDayOfMonth: string;
  today: string;
  paginatorState = new PaginatorState();
  categoryId: number;

  totalRecord = 1;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private fileService: FileService,
    private productService: ProductService,
    private historyUsingPointsService: HistoryUsingPointsService
  ) {
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;

    this.categoryId = 0;

    this.totalRecord = 0;
  }

  ngOnInit(): void {
    this.buildForm();
    this.initDate();
    this.getPaymentMethods();
    this.getStationEmployee();
    this.getListProductFuel();
  }

  getPaymentMethods() {
    this.historyUsingPointsService
      .getPaymentMethods()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.paymentMethods = res.data;
        this.cdr.detectChanges();
      });
  }

  getStationEmployee() {
    this.historyUsingPointsService
      .getStationEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
        this.cdr.detectChanges();
      });
  }

  getListProductFuel() {
    this.productService
      .getListProduct(this.categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataProduct = res.data;
        this.cdr.detectChanges();
      });
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  buildForm() {
    this.searchForm = this.fb.group({
      orderCode: [''],
      phone: [''],
      userName: [''],
      startAt: [''],
      endAt: [''],
      paymentMethod: [''],
      stationName: [''],
      productName: ['']
    })
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

  onSearch() {
    console.log(this.searchForm.value);

    const filterData: IFilterUsingPoint = this.getFilterData();
  }

  getFilterData() {
    const filterFormData: IFilterUsingPoint = this.searchForm.value;
    return {
      ...filterFormData,
      startAt: convertDateToServer(filterFormData.startAt),
      endAt: convertDateToServer(filterFormData.endAt)
    };
  }

  onReset() {
    this.ngOnInit();
  }

  exportFileExcel() {}

}
