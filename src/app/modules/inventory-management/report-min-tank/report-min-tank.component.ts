import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IGasFieldByStation,
  InventoryManagementService,
  IShallow,
  IStationActiveByToken
} from '../inventory-management.service';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { ModalReportMinTankComponent } from './modal-report-min-tank/modal-report-min-tank.component';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-report-min-tank',
  templateUrl: './report-min-tank.component.html',
  styleUrls: ['./report-min-tank.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class ReportMinTankComponent extends BaseComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;

  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  listGasField: IGasFieldByStation[] = [];
  dataSource: IShallow[] = [];
  stationByToken: IStationActiveByToken[] = [];

  constructor(
    private fb: FormBuilder,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private inventoryManagementService: InventoryManagementService
  ) {
    super();
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
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
    this.buildForm();
    this.initDate();
    this.handleGasStation();
    this.onSearch();
  }

  initDate() {
    this.searchForm.get('dateFrom').patchValue(this.firstDayOfMonth);
    this.searchForm.get('dateTo').patchValue(this.today);
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationId: [''],
      gasFieldId:[''],
      dateFrom: [],
      dateTo: []
    })
  }

  handleGasStation() {
    this.searchForm.get('stationId').valueChanges
      .subscribe((x) => {
        this.searchForm.get('gasFieldId').patchValue('');
        this.inventoryManagementService.getGasFields(x)
          .subscribe((res) => {
            this.listGasField = res.data;
            this.cdr.detectChanges();
          })
      })
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

  getFilterData() {
    const filterFormData = this.searchForm.value;
    return {
      ...filterFormData,
      dateFrom: convertDateToServer(filterFormData.dateFrom),
      dateTo: convertDateToServer(filterFormData.dateTo)
    };
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    this.inventoryManagementService.getShallows(this.paginatorState.page, this.paginatorState.pageSize, this.getFilterData())
      .subscribe((res) => {
        this.dataSource = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })

  }

  onReset() {
    this.ngOnInit();
  }

  openModal($event?: Event, data?): void {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ModalReportMinTankComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Chi tiết tịnh kho kịch bơm' : 'Tạo tịnh kho kịch bơm',
      dataDetail: data
    };

    modalRef.result.then((result) => {
      if (result) {
        this.onSearch();
      }
    });
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }
}
