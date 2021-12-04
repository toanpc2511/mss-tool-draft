import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { INews } from '../model';
import { NewsService } from '../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, AfterViewInit {

  newsDetail: INews;
  idNews: string;
  contentNews: string;

  constructor(private newsService: NewsService,
              private router: Router,
              private subheader: SubheaderService,
              private _route: ActivatedRoute,
              private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => this.idNews = params.get('id'));
    this.getDetailNews();
  }

  ngAfterViewInit() {
    this.setBreadcumb();
  }

  getDetailNews(): void {
    this.newsService.getDetail(this.idNews)
      .pipe(
        finalize(() => { this.cdr.detectChanges(); })
      )
      .subscribe((res: DataResponse<INews>) => {
        this.newsDetail = res.data;
        this.contentNews = this.transformContentToWebView(res.data.content);
      });
  }

  transformContentToWebView(content: string): string {
    const regexp = new RegExp('<br><[^/b]+>','g');
    let match;

    let removingBrTagStr: string = content;

    while ((match = regexp.exec(removingBrTagStr)) !== null) {
      removingBrTagStr = removingBrTagStr.slice(0, match.index) + removingBrTagStr.slice(Number(match.index) + 4);
    }

    return removingBrTagStr;
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý cấu hình',
          linkText: 'Quản lý cấu hình',
          linkPath: 'cau-hinh'
        },
        {
          title: 'Cấu hình tin tức',
          linkText: 'Cấu hình tin tức',
          linkPath: 'cau-hinh/tin-tuc'
        },
        {
          title: 'Chi tiết cấu hình tin tức',
          linkText: 'Chi tiết cấu hình tin tức',
          linkPath: null
        }
      ]);
    }, 1);
  }
}
