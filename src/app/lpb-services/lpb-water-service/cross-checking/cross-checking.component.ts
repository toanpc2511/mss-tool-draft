import {Component, HostListener, OnInit} from '@angular/core';
import {CROSS_CHECKING_WATER_COLUMN} from '../shared/constants/lpb-cross-checking-constant';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActionModel} from '../../../shared/models/ActionModel';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {FileService} from '../../../shared/services/file.service';
import {DestroyService} from '../../../shared/services/destroy.service';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../system-configuration/shared/models/error.model';

@Component({
  selector: 'app-crosschecking',
  templateUrl: './cross-checking.component.html',
  styleUrls: ['./cross-checking.component.scss'],
  providers: [DestroyService]
})
export class CrossCheckingComponent implements OnInit {

  fileName!: string;
  configs: any = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  columns: any = CROSS_CHECKING_WATER_COLUMN;
  totalRecordSuccess = 0;
  totalRecordError = 0;
  message = '';
  supplierControl: FormControl = new FormControl('', [Validators.required]);
  dragAreaClass: string;
  dataSource: any = [];
  dataSourceRaw: any;
  filesUpload: any;
  actions: ActionModel[] = [
    {
      actionName: 'Lưu thông tin',
      actionIcon: 'save',
      actionClick: () => this.onSubmit()
    },
  ];

  constructor(
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private fileService: FileService,
    private destroy$: DestroyService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.supplierControl.reset();
    this.fileName = '';
    this.filesUpload = null;
    this.dataSource = [];
    this.totalRecordSuccess = 0;
    this.totalRecordError = 0;
    this.dataSourceRaw = null;
  }

  ngOnInit(): void {
    this.dragAreaClass = 'dragarea';
  }

  @HostListener('dragover', ['$event']) onDragOver = (event: any) => {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }
  @HostListener('dragenter', ['$event']) onDragEnter = (event: any) => {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragend', ['$event']) onDragEnd = (event: any) => {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('dragleave', ['$event']) onDragLeave = (event: any) => {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop = ($event: any) => {
    $event.preventDefault();
    $event.stopPropagation();
    if ($event.dataTransfer.files) {
      const files: FileList = $event.dataTransfer.files;
      if (files.length > 1) {
        this.notify.warning('Cảnh báo', 'Chỉ được chọn 1 file!');
        return;
      }
      if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.notify.error('Lỗi', 'File không đúng định dạng, vui lòng thử lại!');
        return;
      }
      this.fileName = files[0].name;
      this.uploadFile(files);
    }
  }

  onSubmit(): void {
    this.supplierControl.markAllAsTouched();
    if (this.supplierControl.value) {
      this.supplierControl.clearValidators();
    } else {
      this.supplierControl.setErrors({required: true});
    }
    if (this.supplierControl.invalid) { return; }

    if (!this.filesUpload) {
      this.notify.warning('Cảnh báo', 'Vui lòng chọn file đối soát');
      return;
    } else {
      if (this.totalRecordError > 0) {
        this.notify.warning('Cảnh báo', 'Vui lòng kiểm tra và upload lại để tiếp thực hiện đối soát');
        return;
      }
    }
    if (this.dataSource.length <= 0) {
      return;
    }

    const url = 'water-service/cross-check/supplier-record/save';
    const formDataSave = new FormData();
    formDataSave.append('file', this.filesUpload[0]);
    formDataSave.append('supplierCode', this.supplierControl.value);
    this.fileService.uploadFile(url, formDataSave).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.notify.success('Thông báo', res.message);
        this.initForm();
      }
    }, (error: IError) => this.checkError(error));
  }

  onSelectedFile($event): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);
    if (files.length <= 0) {
      return;
    }
    if (files[0].size > 10485760) {
      this.notify.error('Lỗi', 'File vượt quá 10MB!');
      return;
    }
    if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.notify.error('Lỗi', 'File không đúng định dạng, vui lòng thử lại!');
      return;
    }
    this.fileName = files[0].name;

    this.uploadFile(files);
    $event.target.value = null;
  }

  downloadFileError(): void {
    if (this.dataSource.length <= 0) {
      return;
    }
    const url = 'water-service/cross-check/export-error';
    this.fileService.downloadFile(url, this.dataSourceRaw);
  }

  uploadFile(files): void {
    this.filesUpload = files;
    this.dataSource = [];
    const url = 'water-service/cross-check/importForControl';
    const formData = new FormData();
    formData.append('file', files[0]);
    this.fileService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.handleDataFileImport(res);
        this.notify.success('Thông báo', 'Tải file thực hiện đối soát thành công.');
      }
    }, (error: IError) => this.checkError(error));
  }

  handleDataFileImport(data): void {
    this.dataSourceRaw = data;
    this.dataSource = data.supplierRecords;
    this.totalRecordError = data.supplierRecords.filter((item) => item.note !== 'OK').length;
    this.totalRecordSuccess = data.supplierRecords.filter((item) => item.note === 'OK').length;
    this.message = this.totalRecordError > 0 ? 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục' : '';
  }

  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  downloadTemplate(): void {
    this.fileService.downloadFileMethodGet('water-service/cross-check/template');
  }

}
