import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IStationEployee } from '../../history-of-using-points/history-of-using-points.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryManagementService, IShallow } from '../inventory-management.service';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { IDataTransfer } from '../../product/product-modal/product-modal.component';
import { ModalReportMinTankComponent } from './modal-report-min-tank/modal-report-min-tank.component';

@Component({
  selector: 'app-report-min-tank',
  templateUrl: './report-min-tank.component.html',
  styleUrls: ['./report-min-tank.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class ReportMinTankComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;

  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  stationEmployee: Array<IStationEployee> = [];
  listGasField;
  dataSource: IShallow[] = [];

  constructor(
    private fb: FormBuilder,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private inventoryManagementService: InventoryManagementService
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
  }

  ngOnInit(): void {
    this.getStationEmployee();
    this.buildForm();
    this.initDate();
    this.handleGasStation();
    this.onSearch();
  }

  initDate() {
    this.searchForm.get('createFrom').patchValue(this.firstDayOfMonth);
    this.searchForm.get('createTo').patchValue(this.today);
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationId: [''],
      gasFieldId:[''],
      createFrom: [],
      createTo: []
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

  getStationEmployee() {
    this.inventoryManagementService
      .getStationEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
        this.cdr.detectChanges();
      });
  }

  getFilterData() {
    const filterFormData = this.searchForm.value;
    return {
      ...filterFormData,
      createFrom: convertDateToServer(filterFormData.createFrom),
      createTo: convertDateToServer(filterFormData.createTo)
    };
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    this.inventoryManagementService.getShallows(this.paginatorState.page, this.paginatorState.pageSize, this.getFilterData())
      .subscribe((res) => {
        this.dataSource = res.data;
        console.log(this.dataSource);
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })

  }

  onReset() {
    this.ngOnInit();
  }

  openModal($event?: Event, data?): void {
    console.log(data);
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
