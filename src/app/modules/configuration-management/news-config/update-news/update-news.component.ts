import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '../editor-config/config';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { EFileType, FileService } from '../../../../shared/services/file.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from '../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { ELocationImg, IImage, IImageNews, INews } from '../model';
import { SubheaderService } from '../../../../_metronic/partials/layout';

@Component({
  selector: 'app-update-news',
  templateUrl: './update-news.component.html',
  styleUrls: ['./update-news.component.scss']
})
export class UpdateNewsComponent implements OnInit, AfterViewInit {
  updateForm: FormGroup;
  imgDetail: IImageNews;
  imgContent: IImageNews;
  idNews: string;
  eLocationImg = ELocationImg;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: '25rem',
    placeholder: 'Nhập nội dung tin tức',
    translate: 'no',
    sanitize: true,
    toolbarPosition: 'top',
    defaultFontName: 'Times New Roman',
    defaultParagraphSeparator: 'p',
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      if (file.size > 2000000) {
        this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 2MB');
        return new Observable<HttpResponse<null>>();
      }
      return this.newsService.uploadImage(formData);
    },
    toolbarHiddenButtons: [
      [
        'subscript',
        'superscript',
      ],
      [
        'insertVideo',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(private fb: FormBuilder,
              private fileService: FileService,
              private destroy$: DestroyService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
              private newsService: NewsService,
              private router: Router,
              private _route: ActivatedRoute,
              private subheader: SubheaderService
  ) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => this.idNews = params.get('id'));
    this.initCreateForm();
    this.getDetailNews();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  initCreateForm(): void {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
      display: [true]
    });
  }

  getDetailNews(): void {
    this.newsService.getDetail(this.idNews).subscribe((res: DataResponse<INews>) => {
      this.updateForm.patchValue(res.data);
      this.imgContent = res.data.image[1];
      this.imgDetail = res.data.image[0];
    });
  }

  uploadImageFile(file: File, locationImg?: ELocationImg): void {
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.IMAGE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.data) {
          const newsImg: IImage = event.data[0];

          locationImg === this.eLocationImg.DETAIL
            ? this.imgDetail = { ...newsImg, location: this.eLocationImg.DETAIL }
            : this.imgContent = { ...newsImg, location: this.eLocationImg.CONTENT }
        }

        if (this.imgDetail || this.imgContent) {
          this.updateForm.controls['image'].patchValue([this.imgDetail, this.imgContent]);
        }
        this.cdr.detectChanges();
      });
  }

  addImage($event, locationImg?: ELocationImg): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);
    const typeFile = files[0].type.split('/')[0];

    if (files[0].size > 2000000) {
      this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 2MB');
      return;
    }

    if (typeFile !== 'image') {
      this.toastr.error('File không đúng định dạng');
      return;
    }

    this.uploadImageFile(files[0], locationImg);

    inputElement.value = null;
  }

  trimContentValue(): string {
    const convertedHTML = this.updateForm.controls['content'].value.replace(/(<([^>]+)>)/ig,'');
    return convertedHTML.replace(/&#160;/ig, '').trim();
  }

  onSubmit(): void {
    if (this.trimContentValue() === '') {
      this.updateForm.controls['content'].patchValue('');
    }
    this.updateForm.markAllAsTouched();
    if (this.updateForm.invalid) {
      return;
    }

    this.newsService.update(this.updateForm.getRawValue(), this.idNews).subscribe((res: DataResponse<boolean>) => {
      this.router.navigate(['cau-hinh/tin-tuc']);
    });
  }

  setBreadcumb(): void {
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
          title: 'Chỉnh sửa cấu hình tin tức',
          linkText: 'Chỉnh sửa cấu hình tin tức',
          linkPath: null
        }
      ]);
    }, 1);
  }
}
