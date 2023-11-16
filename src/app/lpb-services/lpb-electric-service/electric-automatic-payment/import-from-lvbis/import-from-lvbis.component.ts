import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {ultis} from '../../../../shared/utilites/function';
import {IError} from '../../../../shared/models/error.model';
import {FileService} from '../../../../shared/services/file.service';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {COLUMNS_FILE_IMPORT, TRANSACTION_AUTO_PAYMENT_COLUMNS} from '../../shared/constants/columns-transaction-electric.constant';

@Component({
  selector: 'app-import-from-lvbis',
  templateUrl: './import-from-lvbis.component.html',
  styleUrls: ['./import-from-lvbis.component.scss']
})
export class ImportFromLvbisComponent implements OnInit {
  files: File[] = [];
  isDisabled = false;
  dataSource = [];
  uploadForm = this.fb.group({
    supplierCode: [null, [Validators.required]],
    file: [null, [Validators.required]]
  });
  columns = TRANSACTION_AUTO_PAYMENT_COLUMNS;
  configs: any = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true,
  };
  get uploadFormControl(): any {
    return this.uploadForm.controls;
  }

  constructor(private fb: FormBuilder,
              private fileService: FileService,
              private destroy$: DestroyService,
              private notify: CustomNotificationService) {
  }

  ngOnInit(): void {
  }

  onFileSelect($event): void {
    this.files = $event;
  }

  onClearSelected($event): void {
    this.uploadForm.get('file').patchValue(null);
    // this.dataSource = [];
  }

  uploadFile(): void {
    this.uploadForm.get('file').markAllAsTouched();
    if (this.uploadForm.get('file').invalid || !this.files) {
      return;
    }
    const url = 'electric-service/settle/import';
    const formData = new FormData();
    // this.fileName = this.files[0].name;
    formData.append('file', this.files[0]);

    this.fileService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        // let dataSource: any[] = res.data;
        // const rowError = dataSource.find(x => x.noteCode === 'ERROR');
        // if (rowError) {
        //   ultis.order(dataSource, 'noteCode');
        // }
        // // this.dataSource = dataSource;
        // this.totalRecordError = res.data.filter((item) => item.noteCode !== 'OK').length;
        // this.totalRecordSuccess = res.data.filter((item) => item.noteCode === 'OK').length;
        // this.message = this.totalRecordError > 0 ? 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục' : '';
        this.notify.success('Thông báo', 'Upload file thành công.');
      }
    }, (error: IError) => this.notify.handleErrors(error));
  }

  protected readonly COLUMNS_FILE_IMPORT = COLUMNS_FILE_IMPORT;
}
