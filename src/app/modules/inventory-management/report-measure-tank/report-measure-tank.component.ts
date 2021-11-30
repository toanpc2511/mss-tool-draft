import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IStationEployee } from '../../history-of-using-points/history-of-using-points.service';
import { takeUntil } from 'rxjs/operators';
import { IFilterImportInventory, InventoryManagementService } from '../inventory-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import * as moment from 'moment';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { IDataTransfer, ProductModalComponent } from '../../product/product-modal/product-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalReportMeasureTankComponent } from './modal-report-measure-tank/modal-report-measure-tank.component';
import { convertDateToServer } from '../../../shared/helpers/functions';

@Component({
  selector: 'app-report-measure-tank',
  templateUrl: './report-measure-tank.component.html',
  styleUrls: ['./report-measure-tank.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class ReportMeasureTankComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;

  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  stationEmployee: Array<IStationEployee> = [];
  listGasField;
  dataSource;

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

    this.inventoryManagementService.getMeasures(this.paginatorState.page, this.paginatorState.pageSize, this.getFilterData())
      .subscribe((res) => {
        this.dataSource = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })
  }

  onReset() {
    this.ngOnInit();
  }

  openModal($event?: Event, data?: IDataTransfer): void {
    if ($event) {
      $event.stopPropagation();
    }
    const modalRef = this.modalService.open(ModalReportMeasureTankComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = {
      title: data ? 'Chi tiết tịnh kho đo bể' : 'Tạo tịnh kho đo bể',
      product: data
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
