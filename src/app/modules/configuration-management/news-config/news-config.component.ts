import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INews } from './model';
import { NewsService } from './news.service';
import { DataResponse } from '../../../shared/models/data-response.model';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';

@Component({
  selector: 'app-news-config',
  templateUrl: './news-config.component.html',
  styleUrls: ['./news-config.component.scss']
})
export class NewsConfigComponent extends BaseComponent implements OnInit {

  listNews: INews[];
  paginatorState = new PaginatorState();

  constructor(private newsService: NewsService,
              private modalService: NgbModal,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    const params = {
      page: this.paginatorState.page,
      size: this.paginatorState.pageSize,
    }

    this.newsService.getAll(params)
      .pipe(
        finalize((): void => {
          this.cdr.detectChanges();
        })
      )
      .subscribe((res: DataResponse<INews[]>) => {
        this.listNews = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
    });
  }

  openConfirmDeleteDialog(news: INews): void {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });

    modalRef.componentInstance.data = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xóa cấu hình tin tức ${news.title}?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    }

    modalRef.result.then((result) => {
      if (result) {
        this.newsService.delete(news.id).subscribe((res: DataResponse<boolean>): void => {
          this.toastr.success('Bạn đã xóa cấu hình banner thành công');
          this.getList();
        });
      }
    });
  }

  pagingChange($event: IPaginatorState): void {
    this.paginatorState = $event as PaginatorState;
    this.getList();
  }
}
