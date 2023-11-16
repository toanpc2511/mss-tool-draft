import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {takeUntil} from 'rxjs/operators';
import {FileService} from '../../../../../shared/services/file.service';
import {DestroyService} from '../../../../../shared/services/destroy.service';
import {COLUMNS_FILE_IMPORT} from '../../../shared/constants/columns-transaction-electric.constant';
import {Observable} from 'rxjs';
import {IError} from '../../../../../shared/models/error.model';
import { ultis } from 'src/app/shared/utilites/function';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input() event: Observable<void>;
  @Input() eventCompleted: Observable<void>;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>(null);
  files: File[] = [];
  fileName = '';
  templateType: string[] = ['NPC', 'SPC', 'CPC', 'HCM', 'HNI'];
  dataSource = [];
  totalRecordSuccess = 0;
  totalRecordError = 0;
  message = '';
  uploadForm: FormGroup;
  isDisabled = false;

  configs: any = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  columns: any = COLUMNS_FILE_IMPORT;

  constructor(
    private notify: CustomNotificationService,
    private fileService: FileService,
    private destroy$: DestroyService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm(): void {
    this.uploadForm = this.fb.group({
      supplierCode: [null, [Validators.required]],
      file: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.uploadForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.dataChange.emit(null);
    });
    this.event.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.getValue();
    });
    this.handleCompleted();
  }

  handleCompleted(): void {
    this.eventCompleted
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.uploadForm.disable({onlySelf: false, emitEvent: false});
        this.isDisabled = true;
      });
  }

  onFileSelect($event): void {
    this.dataSource = [];
    this.totalRecordSuccess = 0;
    this.totalRecordError = 0;
    this.files = $event;
  }

  onClearSelected($event): void {
    this.uploadForm.get('file').patchValue(null);
    this.dataSource = [];
  }

  getValue(): any {
    this.uploadForm.markAllAsTouched();
    if (this.uploadForm.invalid) {
      return;
    }
    if (this.dataSource.length <= 0) {
      this.notify.warning('Cảnh báo', 'Vui lòng upload file để thực hiện truy vấn!');
      return;
    }
    if (this.totalRecordError > 0) {
      this.notify.warning('Cảnh báo', 'Vui lòng kiểm tra và thực hiện upload lại file!');
      return;
    }
    this.dataChange.emit({
      supplierCode: this.uploadForm.get('supplierCode').value.supplierCode,
      supplierId: this.uploadForm.get('supplierCode').value.id,
      file: this.files[0],
      fileName: this.fileName,
      importFileResponses: this.dataSource
    });
  }

  uploadFile(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    const url = 'electric-service/payment/import';
    const formData = new FormData();
    this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);

    this.fileService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        let dataSource: any[] = res.data;
        const rowError = dataSource.find(x => x.noteCode === "ERROR");
        if (rowError) {
          ultis.order(dataSource, "noteCode");
        }
        this.dataSource = dataSource;
        this.totalRecordError = res.data.filter((item) => item.noteCode !== 'OK').length;
        this.totalRecordSuccess = res.data.filter((item) => item.noteCode === 'OK').length;
        this.message = this.totalRecordError > 0 ? 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục' : '';
        this.notify.success('Thông báo', 'Upload file thành công.');
      }
    }, (error: IError) => this.notify.handleErrors(error));
  }

  downloadFileError(): void {
    if (!this.dataSource) {
      return;
    }
    this.fileService.downloadFile('electric-service/payment/export-error-query', this.dataSource);
  }

  downloadTemplate(type: string): void {
    this.fileService.downloadFileMethodGet(`electric-service/payment/template?supplierCode=EVN_${type}`);
  }
}
