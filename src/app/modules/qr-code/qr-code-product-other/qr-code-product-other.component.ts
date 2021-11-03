import { BaseComponent } from './../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IQrProductOther, QrCodeService } from '../qr-code.service';
import { ISortData } from '../../contract/contract.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { FileService } from '../../../shared/services/file.service';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-qr-code-product-other',
  templateUrl: './qr-code-product-other.component.html',
  styleUrls: ['./qr-code-product-other.component.scss'],
  providers: [DestroyService]
})
export class QrCodeProductOtherComponent extends BaseComponent implements OnInit {
  dataRes;
  listStatus = LIST_STATUS;
  nameProduct: string;
  image: string;
  sortData: ISortData;
  paginatorState = new PaginatorState();
  searchFormControl: FormControl = new FormControl();

  constructor(
    private modalService: NgbModal,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private qrCodeService: QrCodeService,
    private fileService: FileService,
  ) {
    super();
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
    this.sortData = null;
  }

  ngOnInit(): void {
    this.getListQrCodeProductOther();
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.qrCodeService.getListQrCodeProductOther(
            this.paginatorState.page,
            this.paginatorState.pageSize,
            this.searchFormControl.value,
            this.sortData
          );
        }),
        tap((res) => {
          this.dataRes = res.data;
          this.paginatorState.recalculatePaginator(res.meta.total);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getListQrCodeProductOther() {
    this.qrCodeService.getListQrCodeProductOther(
      this.paginatorState.page,
      this.paginatorState.pageSize,
      this.searchFormControl.value,
      this.sortData
    )
      .subscribe((res) => {
        this.dataRes = res.data;
        console.log(this.dataRes);
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListQrCodeProductOther();
  }

  sort(column: string) {
    if (this.sortData && this.sortData.fieldSort === column) {
      if (this.sortData.directionSort === 'ASC') {
        this.sortData = { fieldSort: column, directionSort: 'DESC' };
      } else {
        this.sortData = null;
      }
    } else {
      this.sortData = { fieldSort: column, directionSort: 'ASC' };
    }
    this.getListQrCodeProductOther();
  }

  viewQrCode(content, item: IQrProductOther) {
    this.modalService.open(content, { size: 'md' });

    this.nameProduct = item.productName;
    this.image = item.qrCodeProduct.qrCodeImage.url;
  }

  downloadFile(item) {
    const fileId = item.qrCodeProduct.qrCodeImage.id;
    const fileName = item.qrCodeProduct.qrCodeImage.url;
    return this.fileService.downloadFile(fileId, fileName);
  }
}
