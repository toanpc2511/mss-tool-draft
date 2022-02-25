import { BaseComponent } from './../../../shared/components/base/base.component';
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
import { IQrPumpHose, QrCodeService } from '../qr-code.service';
import { FileService } from '../../../shared/services/file.service';

@Component({
  selector: 'app-qr-code-pump-hoses',
  templateUrl: './qr-code-pump-hoses.component.html',
  styleUrls: ['./qr-code-pump-hoses.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class QrCodePumpHosesComponent extends BaseComponent implements OnInit {
  listStatus = LIST_STATUS;
  nameProduct: string;
  image: string;
  sorting: SortState;
  dataSource;
  dataSourceTemp;
  searchForm: FormControl;

  filterField: FilterField<{
    code: null;
    station: null;
    pole: null;
    hose: null;
    price: null;
    nameFuel: null;
  }>;

  constructor(
    private modalService: NgbModal,
    private sortService: SortService<IProduct>,
    private filterService: FilterService<IProduct>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private fileService: FileService,
    private qrCodeService: QrCodeService
  ) {
    super();
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: null,
      station: null,
      pole: null,
      hose: null,
      price: null,
      nameFuel: null
    });
    this.searchForm = new FormControl();
  }

  ngOnInit(): void {
    this.getListQrCodePumlHose();

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

  getListQrCodePumlHose() {
    this.qrCodeService.getListQrCodePumlHose()
      .subscribe((res) => {
        this.dataSource = this.dataSourceTemp = res.data;
        this.cdr.detectChanges();
      })
  }

  viewQrCode(content, item: IQrPumpHose) {
    this.modalService.open(content, { size: 'md' });

    this.nameProduct = item.nameFuel;
    this.image = item.image.url;
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }

  downloadFile(fileId: string, fileName: string) {
    return this.fileService.downloadFile(fileId, fileName);
  }
}
