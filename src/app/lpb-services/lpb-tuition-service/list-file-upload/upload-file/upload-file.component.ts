import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {FileService} from '../../../../shared/services/file.service';
import {TuitionService} from '../../shared/services/tuition.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {ISchool} from '../../shared/models/tuition.interface';
import {BRANCH_UPLOAD_FILE, CROSS_UNIVERSITY} from '../../shared/constants/tuition.constant';
import {LpbDatatableComponent} from '../../../../shared/components/lpb-datatable/lpb-datatable.component';
import {
  URL_FILE_CHECK,
  URL_FILE_RESULT,
  URL_FILE_SAVE,
  URL_FILE_TEMPLATE
} from '../../shared/constants/url.tuition.service';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../../shared/models/error.model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
  providers: [DestroyService]
})
export class UploadFileComponent implements OnInit {

  forms: FormGroup;
  // schools: any[] = ['CAO ĐẲNG LÀO CAI', 'TRƯỜNG ĐẠI HỌC KTQD'];  // su dung tai *ngFor="let type of schools"
  crossUnivercityName = CROSS_UNIVERSITY;
  schools: ISchool[];
  isValidFile = false;
  isFileTemplate = false;
  isWarning = false;
  isBranchUpload = false;
  file: File;
  dataSource: any = [];
  dataSourceRaw: any;
  totalRecord = 0;
  totalRecordSuccess = 0;
  totalRecordError = 0;
  totalRecordWarning = 0;
  fileName!: string;
  message = '';
  modalConfirm: MatDialogRef<any>;

  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  @ViewChild('modalCheck', {static: true}) modalCheck: TemplateRef<any>;
  @ViewChild('modalSave', {static: true}) modalSave: TemplateRef<any>;

  constructor(
    private fileService: FileService,
    private tuitionService: TuitionService,
    private destroy$: DestroyService,
    private notify: CustomNotificationService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private http: HttpClient,
    private matDialog: MatDialog
  ) {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      schoolName: ['', [Validators.required]],
      content: ['', [Validators.required]],
      isNewUpload: [false]
    });
  }

  ngOnInit(): void {
    // Thuc hien khi có tac dong thay doi du lieu
    this.forms.valueChanges.subscribe((value) => {
      this.isFileTemplate = !(this.forms.value.schoolName === null);
    });
    this.getSchools();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if ([BRANCH_UPLOAD_FILE].includes(userInfo?.branchCode)) {
      this.isBranchUpload = true;
    }
    else {
      this.isBranchUpload = false;
      this.notify.error('Lưu ý', 'Chức năng Upload file chỉ dành cho 170- Chi nhánh Lào Cai');
    }
  }

  getSchools(): void {
    this.tuitionService
      .getListUniversityActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.schools = res.data;
        }
      });
  }

  onDownloadTemplate(): void {
    const url = URL_FILE_TEMPLATE;
    this.fileService.downloadFileMethodGet(url);
  }

  getFile($event): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);
    this.file = files[0];
    this.dataSource = [];
    this.isValidFile = false;
    // set event ve null
    // $event.target.value = null;
  }
  // load lai target khi upload file moi
  remoteEvent($event): void{
    $event.target.value = null;
    this.totalRecord = 0;
    this.totalRecordSuccess = 0;
    this.totalRecordError = 0;
    this.totalRecordWarning = 0;
  }
  uploadFile(): void {
    // khai bao
    const url = URL_FILE_CHECK;
    // const url = 'file/check';
    // Tao 1 formData va gan gia tri la file
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('isNewUpload', this.forms.value.isNewUpload);
    // Goi toi API BE check file, res: HttpResponse <any>
    this.fileService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //
      if (res) {
        this.handleDataFileImport(res);
        this.notify.success('Thông báo', 'Kiểm tra file thành công.');

      }
    }, (error: IError) => this.checkError(error));
  }

  handleDataFileImport(data): void {
    this.dataSourceRaw = data;
    // gan du lieu response tra ve 'excelRecords'
    this.dataSource = data.excelRecords;
    this.totalRecordError = data.excelRecords.filter((item) => item.note === 'ERROR').length;
    this.totalRecordSuccess = data.excelRecords.filter((item) => item.note === 'OK').length;
    this.totalRecordWarning = data.excelRecords.filter((item) => item.note === 'WARNING').length;
    this.totalRecord = data.excelRecords.length;
    if (this.totalRecordError > 0) {
      this.isValidFile = false;
    } else {
      this.isValidFile = true;
    }
    this.isWarning = this.totalRecordWarning > 0;
    this.message = this.totalRecordError > 0 ? 'Tệp tin đính kèm bị lỗi. Vui lòng kiểm tra và upload lại để tiếp tục' : '';
  }

  checkFileExcel(): void {
    console.log(' File: ', this.file);
    // check file null
    if (!this.file) {
      this.notify.error('Lỗi', 'Bạn chưa chọn file');
      return;
    }
    // Kiem tra kich thuoc file
    if (this.file.size > 102400000) {
      this.notify.error('Lỗi', 'File vượt quá 10mb ví dụ');
      return;
    }
    // Kiem tra dinh dang file excel

    if (this.file?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.notify.error('Lỗi', 'File không đúng định dạng, vui lòng thử lại!');
      return;
    }
    // gan gia tri filename
    this.fileName = this.file.name;
    // goi toi ham upload va check file
    this.uploadFile();
    // this.matDialog.open(this.modalCheck);
    this.modalConfirm = this.matDialog.open(this.modalCheck);
  }

  saveFile(): void {
    if (this.isWarning) {
      // this.matDialog.open(this.modalSave);
      this.modalConfirm = this.matDialog.open(this.modalSave);
    } else {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.forms.markAllAsTouched();
    if (this.forms.invalid) {
      return;
    }
    const valueForm = this.forms.value;
    console.log(valueForm);

    const url = URL_FILE_SAVE;
    // const url = 'file/save';
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('isNewUpload', this.forms.value.isNewUpload);
    formData.append('detail', this.forms.value.content);

    this.fileService.uploadFile(url, formData).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        console.log('res: ', res);
        res.message === 'Fail'
          ? this.notify.error('Thông báo', `Lưu file thất bại`)
          : this.notify.success('Thông báo', `Lưu file thành công`);
        this.modalConfirm.close();
      }
    }, (error: IError) => this.checkError(error));
    this.isValidFile = false;
  }


  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  viewFileValid(): void {
    if (!this.dataSourceRaw) {
      return;
    }
    const url = URL_FILE_RESULT;
    // const url = 'file/export';
    this.fileService.downloadFile(url, this.dataSourceRaw);
    this.modalConfirm.close();
  }

}
