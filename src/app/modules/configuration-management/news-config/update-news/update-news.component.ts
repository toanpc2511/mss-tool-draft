import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '../editor-config/config';
import { EFileType, FileService } from '../../../../shared/services/file.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from '../news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { ELocationImg, IImage, IImageNews, INews } from '../model';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { getConfigEditor } from '../config-editor';

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

  config: AngularEditorConfig = getConfigEditor(this.toastr, this.newsService);

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
      const { title, content, description, image } = {...res.data};
      this.updateForm.patchValue({ title, description, content: this.transformContentToWebView(content), image });
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

    if (files[0].size > 15360000) {
      this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
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
    return convertedHTML.replace(/&nbsp;/ig, '').trim();
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

  transformContentToPhoneView(): string {
    /*
       regex: /<p>[<\w="/ ]*>*<br>[<\w="/ ]*>*<\/p>/g
       catch 2 case:
        <p><font face="Times New Roman"><br></font></p>
        <p><br></p>
     */
    const transformBrTag: string = this.updateForm.controls['content'].value.replace(/<p>(<([^>]+)>)*<br>(<([^>]+)>)*<\/p>/g, '<br>');
    const regexp = new RegExp('<br><[^/b]+>','g');
    let match;

    let addingBrTagStr = transformBrTag;

    while ((match = regexp.exec(transformBrTag)) !== null) {
      addingBrTagStr = addingBrTagStr.slice(0, match.index) + "<br>" + addingBrTagStr.slice(match.index);
    }

    return addingBrTagStr;
  }

  onSubmit(): void {
    if (this.trimContentValue() === '') {
      this.updateForm.controls['content'].patchValue('');
    }
    this.updateForm.markAllAsTouched();
    if (this.updateForm.invalid) {
      return;
    }

    this.updateForm.controls['content'].patchValue(this.transformContentToPhoneView());

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