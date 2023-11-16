import { Component, OnInit } from '@angular/core';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { BILLS_UPLOAD_COLUMNS } from '../../shared/constants/water.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { WaterService } from '../../shared/services/water.service';
import { FileService } from 'src/app/shared/services/file.service';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FormMessageService } from 'src/app/shared/services/form-message.service';
import { ultis } from 'src/app/shared/utilites/function';
import { Router } from '@angular/router';

@Component({
  selector: 'app-water-offline-upload',
  templateUrl: './water-offline-upload.component.html',
  styleUrls: ['./water-offline-upload.component.scss']
})
export class WaterOfflineUploadComponent implements OnInit {

  formUpload = this.fb.group({
    supplierCode: ["", Validators.required],
    file: [null, Validators.required],
    desc: ["", Validators.required]
  })
  files: any;

  dataSource = [];
  columns = BILLS_UPLOAD_COLUMNS;
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hiddenActionColumn: true,
    hasPaging: true
  };
  rowsError = 0;
  rowsSuccess = 0;

  actions: ActionModel[] = [
    {
      actionName: 'Lưu',
      actionIcon: 'save',
      actionClick: () => this.save(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private waterService: WaterService,
    private fileService: FileService,
    private formMessageService: FormMessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onFileSelect($event): void {
    this.dataSource = [];
    this.rowsSuccess = 0;
    this.rowsError = 0;
    this.files = $event;
  }

  onClearSelected($event): void {
    this.formUpload.get('file').patchValue(null);
    this.dataSource = [];
  }

  downloadTemplateFile() {
    const url = "water-service/import/template";
    this.fileService.downloadFileMethodGet(url);
  }

  upload() {
    if (this.formUpload.get('file').invalid || !this.files) {
      this.formUpload.controls["file"].markAsTouched();
      return;
    }
    const url = "water-service/import/offline";
    const fileFormData = new FormData();
    fileFormData.append('file', this.files[0]);
    fileFormData.append('supplierCode', this.formUpload.getRawValue().supplierCode);
    fileFormData.append('desc', this.formUpload.getRawValue().desc);
    this.fileService.uploadFile(url, fileFormData).toPromise().then(res => {
      const dataSource = res["data"];
      this.rowsSuccess = dataSource.filter(x => x.noteErrorCode === "OK").length;
      this.rowsError = dataSource.length - this.rowsSuccess;
      if (this.rowsError > 0) {
        ultis.order(dataSource, "noteErrorCode");
      }
      this.dataSource = dataSource;
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  downloadErrorBills() {
    const url = "water-service/import/offline/export-error";
    const data = {importFileResponses: this.dataSource};
    this.fileService.downloadFile(url, data);
  }

  save() {
    if (this.formUpload.invalid) {
      this.formUpload.markAllAsTouched();
      return;
    }
    if (this.dataSource.length === 0) {
      this.formMessageService.openMessageError("File upload không có dữ liệu. Vui lòng kiểm tra lại !")
      return;
    }
    if (this.rowsError > 0) {
      this.formMessageService.openMessageError("File upload có bản ghi lỗi. Vui lòng kiểm tra lại !")
      return;
    }
    const body = {
      description: this.formUpload.getRawValue().desc,
      fileName: this.files[0].name,
      importFileResponseList: this.dataSource,
      supplierCode: this.formUpload.getRawValue().supplierCode,
    };

    this.waterService.uploadDataOffline(body).toPromise().then(res => {
      this.formMessageService.openMessageSuccess("Lưu dữ liệu thành công !");
      this.router.navigate(["/water-service/data-offline"]);
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }
}
