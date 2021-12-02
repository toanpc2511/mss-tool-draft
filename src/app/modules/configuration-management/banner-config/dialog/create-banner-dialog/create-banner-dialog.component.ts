import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EFileType, FileService } from '../../../../../shared/services/file.service';
import { takeUntil } from 'rxjs/operators';
import { IImage } from '../../../../employee/employee.service';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { BannerConfigService } from '../../banner-config.service';
import { DataResponse } from '../../../../../shared/models/data-response.model';

@Component({
  selector: 'app-create-banner-dialog',
  templateUrl: './create-banner-dialog.component.html',
  styleUrls: ['./create-banner-dialog.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class CreateBannerDialogComponent {

  createForm: FormGroup;
  attachmentImg: IImage;

  constructor(public modal: NgbActiveModal,
              private fb: FormBuilder,
              private destroy$: DestroyService,
              private fileService: FileService,
              private cdr: ChangeDetectorRef,
              private toastr: ToastrService,
              private bannerService: BannerConfigService
  ) {
    this.initCreateForm();
  }

  initCreateForm(): void {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      shows: [true],
      imageId: ['', Validators.required],
      typeMedia: ['IMAGE']
    });
  }

  onSubmit(): void {
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      return;
    }
    this.bannerService.create(this.createForm.getRawValue()).subscribe((res: DataResponse<boolean>): void => {
      this.modal.close(true);
    });
  }

  uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append('files', file);
    this.fileService
      .uploadFile(formData, EFileType.IMAGE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        if (event?.data) {
          this.attachmentImg = event.data[0];
          this.createForm.get('imageId').patchValue(event.data[0].id,{emitModelToViewChange: false});
        }
        this.cdr.detectChanges();
      });
  }

  addImage($event) {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);

    if (files[0].size > 2000000) {
      this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 2MB');
      this.createForm.controls['imageId'].patchValue('');
      return;
    }

    const typeFile = files[0].type.split('/')[0];
    if (typeFile !== 'image') {
      this.createForm.controls['imageId'].setErrors({file: true});
      this.attachmentImg = null;
      return;
    }

    this.createForm.controls['imageId'].setErrors({file: false});
    this.uploadImageFile(files[0]);

    inputElement.value = null;
  }

}
