import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IBanner } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { EFileType, FileService } from '../../../../../shared/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { BannerConfigService } from '../../banner-config.service';
import { takeUntil } from 'rxjs/operators';
import { DataResponse } from '../../../../../shared/models/data-response.model';

interface IImage {
  id: number;
  url: string;
  name: string;
}

@Component({
  selector: 'app-update-banner-dialog',
  templateUrl: './update-banner-dialog.component.html',
  styleUrls: ['./update-banner-dialog.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class UpdateBannerDialogComponent implements OnInit {

  @Input() data: IBanner;
  updateForm: FormGroup;
  attachmentImg: IImage;
  urlImg: string;
  isImageLarge: boolean;

  constructor(public modal: NgbActiveModal,
              private fb: FormBuilder,
              private destroy$: DestroyService,
              private fileService: FileService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
              private bannerService: BannerConfigService
  ) {}

  ngOnInit(): void {
    this.initUpdateForm();
    this.urlImg = this.data.image.url;
    this.cdr.detectChanges();
  }

  initUpdateForm(): void {
    this.updateForm = this.fb.group({
      title: [this.data.title, Validators.required],
      shows: [this.data.shows],
      typeMedia: ['IMAGE'],
      imageId: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.updateForm.get('imageId').value && !this.isImageLarge) {
      this.updateForm.get('imageId').patchValue(this.data.image.id, {emitModelToViewChange: false});
    }
    this.updateForm.markAllAsTouched();
    if (this.updateForm.invalid) {
      return;
    }
    this.bannerService.update(this.updateForm.getRawValue(), this.data.id).subscribe((res: DataResponse<boolean>): void => {
      this.modal.close(true);
    });
  }

  uploadImageFile(file: File): void {
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.IMAGE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.data) {
          this.attachmentImg = event.data[0];
          this.updateForm.get('imageId').patchValue(event.data[0].id , {emitModelToViewChange: false});
        }
        this.cdr.detectChanges();
      });
  }

  addImage($event): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);

    if (files[0].size > 15360000) {
      this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
      this.updateForm.controls['imageId'].patchValue('');
      this.attachmentImg = null;
      this.urlImg = '';
      this.isImageLarge = true;
      return;
    }

    const typeFile = files[0].type.split('/')[0];
    if (typeFile !== 'image') {
      this.updateForm.controls['imageId'].setErrors({file: true});
      this.attachmentImg = null;
      this.urlImg = '';
      return;
    }

    this.updateForm.controls['imageId'].setErrors({file: false});
    this.uploadImageFile(files[0]);

    inputElement.value = null;
  }

}
