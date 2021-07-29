import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationResponse, GasStationService } from '../gas-station.service';

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-list-station',
  styleUrls: ['list-station.component.scss'],
  templateUrl: 'list-station.component.html',
  providers: [SortService, FilterService, DestroyService]
})
export class ListStationComponent implements OnInit {
  dataSource: Array<GasStationResponse>;
  dataSourceTemp: Array<GasStationResponse>;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: null;
    name: null;
    address: null;
  }>;
  listStatus = LIST_STATUS;

  constructor(
    private sortService: SortService<GasStationResponse>,
    private filterService: FilterService<GasStationResponse>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private gasStationService: GasStationService,
    private modalService: NgbModal
  ) {
    this.dataSource = this.dataSourceTemp = [];
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: null,
      name: null,
      address: null
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    this.getListStation();

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

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }

  goToCreateGasStation() {
    this.router.navigate(['/tram-xang/danh-sach/them-tram']);
  }

  getListStation() {
    this.gasStationService.getListStation().subscribe((res) => {
      this.dataSource = this.dataSourceTemp = res.data;
      // Set data after filter and apply current sorting
      this.dataSource = this.sortService.sort(
        this.filterService.filter(this.dataSourceTemp, this.filterField.field)
      );
      this.cdr.detectChanges();
    });
  }

  deleteStation(item: GasStationResponse) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá trạm ${item.code} - ${item.name}?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService.deleteStation(item.id).subscribe(() => {
          this.getListStation();
        });
      }
    });
  }

  updateStation(stationId: number) {
    this.router.navigate([`/tram-xang/danh-sach/sua-tram/${stationId}`]);
  }
}
