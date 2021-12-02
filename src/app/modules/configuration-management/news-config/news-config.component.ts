import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INews } from './model';
import { NewsService } from './news.service';
import { DataResponse } from '../../../shared/models/data-response.model';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-news-config',
  templateUrl: './news-config.component.html',
  styleUrls: ['./news-config.component.scss']
})
export class NewsConfigComponent extends BaseComponent implements OnInit {

  listNews: INews[];

  constructor(private newsService: NewsService,
              private modalService: NgbModal,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.newsService.getAll()
      .pipe(
        finalize((): void => {
          this.cdr.detectChanges();
        })
      )
      .subscribe((res: DataResponse<INews[]>) => {
        this.listNews = res.data;
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

}
