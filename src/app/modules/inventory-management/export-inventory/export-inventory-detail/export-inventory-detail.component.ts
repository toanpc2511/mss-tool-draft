import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { finalize, pluck, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ofNull } from '../../../../shared/helpers/functions';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-export-inventory-detail',
  templateUrl: './export-inventory-detail.component.html',
  styleUrls: ['./export-inventory-detail.component.scss'],
  providers: [DestroyService]
})
export class ExportInventoryDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
  isInitDataUpdateSubject = new Subject();
  exportInventoryId:  number;
  dataDetail;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private router: Router,
    private destroy$: DestroyService
  ) {
    super()
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý kho',
          linkText: 'Quản lý kho',
          linkPath: 'kho'
        },
        {
          title: 'Xuất kho',
          linkText: 'Xuất kho',
          linkPath: 'kho/xuat-kho'
        },
        {
          title: 'Chi tiết phiếu nhập kho',
          linkText: 'Chi tiết phiếu nhập kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        pluck('id'),
        take(1),
        switchMap((id: number) => {
          if (id) {
            this.exportInventoryId = id;
            console.log(this.exportInventoryId);
          }
          return ofNull();
        }),
        finalize(() => this.isInitDataUpdateSubject.next(true)),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  onSubmit() {}

}
