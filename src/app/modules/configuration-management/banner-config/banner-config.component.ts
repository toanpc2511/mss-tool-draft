import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IBanner } from './models';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { BannerConfigService } from './banner-config.service';
import { DataResponse } from '../../../shared/models/data-response.model';
import { finalize } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { ToastrService } from 'ngx-toastr';
import { CreateBannerDialogComponent } from './dialog/create-banner-dialog/create-banner-dialog.component';
import { UpdateBannerDialogComponent } from './dialog/update-banner-dialog/update-banner-dialog.component';
import { DestroyService } from '../../../shared/services/destroy.service';
import { BaseComponent } from '../../../shared/components/base/base.component';

@Component({
  selector: 'app-banner-config',
  templateUrl: './banner-config.component.html',
  styleUrls: ['./banner-config.component.scss'],
})
export class BannerConfigComponent extends BaseComponent implements OnInit {

  listBanner: IBanner[];

  constructor(private bannerService: BannerConfigService,
              private cdr: ChangeDetectorRef,
              private destroy: DestroyService,
              private modalService: NgbModal,
              private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.bannerService.getList()
      .pipe(
        finalize((): void => {
          this.cdr.detectChanges();
        })
      )
      .subscribe((res: DataResponse<IBanner[]>): void => {
        this.listBanner = res.data;
    });
  }

  openCreateDialog() {
    const modalRef = this.modalService.open(CreateBannerDialogComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Bạn đã thêm mới cấu hình banner thành công');
        this.getList();
      }
    });
  }

  openUpdateDialog(banner: IBanner) {
    const modalRef = this.modalService.open(UpdateBannerDialogComponent, {
      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.data = banner;

    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Bạn đã cập nhật cấu hình banner thành công');
        this.getList();
      }
    });
  }

  openConfirmDeleteDialog(banner: IBanner) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });

    modalRef.componentInstance.data = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xóa cấu hình banner ${banner.title}?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    }

    modalRef.result.then((result) => {
      if (result) {
        this.bannerService.delete(banner.id).subscribe((res: DataResponse<boolean>): void => {
            this.toastr.success('Bạn đã xóa cấu hình banner thành công');
            this.getList();
          });
      }
    });
  }

}
