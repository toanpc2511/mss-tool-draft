import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EFileType, FileService } from '../../../../shared/services/file.service';
import { takeUntil } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { AngularEditorConfig } from '../editor-config/config';
import { NewsService } from '../news.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { Router } from '@angular/router';
import { ELocationImg, IImage } from '../model';
import { SubheaderService } from '../../../../_metronic/partials/layout';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit, AfterViewInit {
  createForm: FormGroup;
  imgDetail: IImage;
  imgContent: IImage;
  eLocationImg = ELocationImg;
  idDetailControl: FormControl = new FormControl('', Validators.required);
  idContentControl: FormControl = new FormControl('', Validators.required);

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: '25rem',
    placeholder: 'Nhập nội dung tin tức',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Times New Roman',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      if (file.size > 2000000) {
        this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 2MB');
        return new Observable<HttpResponse<null>>();
      }
      return this.newsService.uploadImage(formData);
    }
  };

  constructor(private fb: FormBuilder,
              private fileService: FileService,
              private destroy$: DestroyService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
              private newsService: NewsService,
              private router: Router,
              private subheader: SubheaderService
  ) {}

  ngOnInit() {
    this.initCreateForm();
  }

  ngAfterViewInit() {
    this.setBreadcumb();
  }

  initCreateForm(): void {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
      display: [true]
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

        if (this.imgDetail && this.imgContent) {
          this.createForm.controls['image'].patchValue([this.imgDetail, this.imgContent]);
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

  onSubmit(): void {
    this.createForm.markAllAsTouched();
    this.idContentControl.markAsTouched();
    this.idDetailControl.markAsTouched();
    if (this.createForm.invalid) {
      return;
    }

    this.newsService.create(this.createForm.getRawValue()).subscribe((res: DataResponse<boolean>) => {
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
          title: 'Thêm cấu hình tin tức',
          linkText: 'Thêm cấu hình tin tức',
          linkPath: null
        }
      ]);
    }, 1);
  }
}
