import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IProduct } from '../../product/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-qr-code-pump-hoses',
  templateUrl: './qr-code-pump-hoses.component.html',
  styleUrls: ['./qr-code-pump-hoses.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class QrCodePumpHosesComponent implements OnInit {
  listStatus = LIST_STATUS;
  nameProduct: string;
  image: string;
  sorting: SortState;
  dataSource;
  dataSourceTemp;
  searchForm: FormControl;

  filterField: FilterField<{
    station: null;
    pole: null;
    hole: null;
    price: null;
    nameFuel: null;
  }>;

  constructor(
    private modalService: NgbModal,
    private sortService: SortService<IProduct>,
    private filterService: FilterService<IProduct>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dataSource = this.dataSourceTemp = [
      {
        id: 3,
        station: 'Trạm xăng Sunoil',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'INACTIVE'
      },
      {
        id: 4,
        station: 'Trạm xăng Sunoil 9',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'ACTIVE'
      },
      {
        id: 2,
        station: 'Trạm xăng Sunoil 7',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'INACTIVE'
      },
      {
        id: 6,
        station: 'Trạm xăng Sunoil 2',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'INACTIVE'
      },
      {
        id: 8,
        station: 'Trạm xăng Sunoil 3',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'ACTIVE'
      },
      {
        id: 3,
        station: 'Trạm xăng Sunoil 5',
        pole: 'Thanh Hóa',
        hole: 'Cột 3',
        price: 12340000000,
        nameFuel: 'Xăng Ron 95',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
        image: {
          id: 2,
          url: 'https://chart.googleapis.com/chart?cht=qr&chl=TTC%20Solution&chs=180x180&choe=UTF-8&chld=L|2',
          typeMedia: ''
        },
        unit: "Lít",
        status: 'ACTIVE'
      }
    ];

    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      station: null,
      pole: null,
      hole: null,
      price: null,
      nameFuel: null
    });
    this.searchForm = new FormControl();
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value.trim());
        } else {
          this.filterField.setFilterFieldValue(null);
        }

        this.dataSource = this.sortService.sort(
          this.filterService.filter(this.dataSourceTemp, this.filterField.field)
        );
        this.cdr.detectChanges();
      });
  }

  viewQrCode(content, item: any) {
    this.modalService.open(content, { size: 'md' });

    this.nameProduct = item.nameFuel;
    this.image = item.qrCode;
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }
}
