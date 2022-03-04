import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EFileType, FileService } from '../../../../shared/services/file.service';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { AngularEditorConfig } from '../editor-config/config';
import { NewsService } from '../news.service';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { Router } from '@angular/router';
import { ELocationImg, IImage } from '../model';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { getConfigEditor } from '../config-editor';
import { IError } from '../../../../shared/models/error.model';

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

  config: AngularEditorConfig = getConfigEditor(this.toastr, this.newsService);

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
    const convertedHTML = this.createForm.controls['content'].value.replace(/(<([^>]+)>)/ig,'');
    return convertedHTML.replace(/&nbsp;/ig, '').trim();
  }

  transformContentToPhoneView(): string {
    /*
       regex: /<p>[<\w="/ ]*>*<br>[<\w="/ ]*>*<\/p>/g
       catch 2 case:
        <p><font face="Times New Roman"><br></font></p>
        <p><br></p>
     */
    const transformBrTag: string = this.createForm.controls['content'].value.replace(/<p>(<([^>]+)>)*<br>(<([^>]+)>)*<\/p>/g, '<br>');
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
      this.createForm.controls['content'].patchValue('');
    }

    this.createForm.markAllAsTouched();
    this.idContentControl.markAsTouched();
    this.idDetailControl.markAsTouched();
    if (this.createForm.invalid) {
      return;
    }

    this.createForm.controls['content'].patchValue(this.transformContentToPhoneView());

    this.newsService.create(this.createForm.getRawValue()).subscribe((res: DataResponse<boolean>) => {
      this.router.navigate(['cau-hinh/tin-tuc']);
    }, (error: IError): void => {
      this.checkError(error);
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

  checkError(err: IError): void {
    switch (err?.code) {
      case 'SUN-OIL-4975':
        this.createForm.get('title').setErrors({ existed: true });
        break;
    }
    this.cdr.detectChanges();
  }
}
