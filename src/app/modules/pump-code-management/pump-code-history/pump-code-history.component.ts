import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import {
  InventoryManagementService,
  IStationActiveByToken
} from '../../inventory-management/inventory-management.service';
import { GasStationService, IPumpHose, IPumpPole } from '../../gas-station/gas-station.service';
import { IFilterHistoryPumpCode, IHistoryPumpCode, PumpCodeManagementService } from '../pump-code-management.service';
import { convertDateToServer } from '../../../shared/helpers/functions';

@Component({
  selector: 'app-pump-code-history',
  templateUrl: './pump-code-history.component.html',
  styleUrls: ['./pump-code-history.component.scss'],
  providers: [ FormBuilder ]
})
export class PumpCodeHistoryComponent extends BaseComponent  implements OnInit {
  stations: IStationActiveByToken[] = [];
  pumpPoles: IPumpPole[] = [];
  pumpHoses: IPumpHose[] = [];
  dataSource: IHistoryPumpCode[] = [];

  firstDayOfMonth: string;
  today: string;

  searchForm: FormGroup;

  paginatorState = new PaginatorState();

  constructor(
    private fb: FormBuilder,
    private inventoryMSv: InventoryManagementService,
    private gasStationSv : GasStationService,
    private pumpCodeMSv: PumpCodeManagementService,
    private cdr: ChangeDetectorRef,
    ) {
    super();
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;

    this.dataSource = [];
    this.today = moment().format('DD/MM/YYYY');
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.initDate();

    this.getStation();
    this.getPumpPoles();
    this.getPumpHoses();
    this.handlePumpPole();
    this.handlePumpHose();

    this.onSearch();
  }

  initDate(): void {
    this.searchForm.get('dateFrom').patchValue(this.firstDayOfMonth);
    this.searchForm.get('dateTo').patchValue(this.today);
  }

  buildFormSearch() {
    this.searchForm = this.fb.group({
      stationCode: [''],
      pumpPoleCode: [''],
      pumpHoseCode: [''],
      pumpCode: [''],
      dateFrom: [],
      dateTo: []
    })
  }

  getStation() {
    this.inventoryMSv.getStationByToken('ACTIVE', false)
      .subscribe((res) => {
        this.stations = res.data;
        this.cdr.detectChanges();
      })
  }

  getPumpPoles(stationId?: number | string) {
    this.pumpCodeMSv.getPumpPolesEmployee(stationId)
      .subscribe((res) => {
        this.pumpPoles = res.data;
        this.cdr.detectChanges();
      })
  }

  getPumpHoses(stationId?: number, pumbPoleId?: number) {
    this.pumpCodeMSv.getPumpHoseEmployee(stationId, pumbPoleId)
      .subscribe((res) => {
        this.pumpHoses = res.data;
        this.cdr.detectChanges();
      })
  }

  handlePumpPole() {
    this.searchForm.get('stationCode').valueChanges
      .subscribe((stationCode: string) => {
        this.searchForm.get('pumpPoleCode').patchValue('');
        this.searchForm.get('pumpHoseCode').patchValue('');
        if (stationCode) {
          const station: IStationActiveByToken = this.stations.find((x) => x.code === stationCode);
          this.getPumpPoles(station.id);
          this.getPumpHoses(station.id);
          return;
        } else {
          this.getPumpPoles();
          this.getPumpHoses();
          return;
        }
      })
  }

  handlePumpHose() {
    this.searchForm.get('pumpPoleCode').valueChanges
      .subscribe((pumpPoleCode: string) => {
        const stationCode = this.searchForm.get('stationCode').value;
        const station: IStationActiveByToken = this.stations.find((x) => x.code === stationCode);
        this.searchForm.get('pumpHoseCode').patchValue('');
        if (pumpPoleCode) {
          const pumpPole = this.pumpPoles.find((x) => x.code === pumpPoleCode);
          return this.getPumpHoses(station?.id, pumpPole.id);
        } else {
          this.getPumpHoses(station.id);
        }
      })
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
    const filterData: IFilterHistoryPumpCode = this.getFilterData();
    this.pumpCodeMSv.getHistoryPumpCode(this.paginatorState.page, this.paginatorState.pageSize, filterData)
      .subscribe((res) => {
        this.dataSource = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })
  }

  onReset() {
    this.ngOnInit();
  }

  exportFileExcel() {}

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

}
