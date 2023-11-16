import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-card-service-extend-file-input',
  templateUrl: './card-service-extend-file-input.component.html',
  styleUrls: ['./card-service-extend-file-input.component.scss'],
})
export class CardServiceExtendFileInputComponent implements OnInit {
  /* Hiện tại xử lý cho file và output base64
   * */
  @Input() isRequire = false;
  @Input() maxSize = 1048576;
  @Input() validType: string[] = [];
  @Output() changeFile = new EventEmitter<any>();
  @Output() clearFile = new EventEmitter<any>();
  @ViewChild('fileUpload') fileUpload: ElementRef;
  fileName = '';
  fileSize = 0;
  fileType = '';
  errMessage = '';
  fileExt = '';
  validFileTypesTxt = '';
  constructor() {}

  ngOnInit(): void {
    this.validFileTypesTxt = this.validType.join(', ');
  }

  handleFileInput(evt): void {
    if (evt.target.files.length > 0) {
      const file = evt.target.files[0];
      this.fileExt = file.name.split('.').pop();
      this.fileSize = file.size;
      this.fileName = file.name;
      this.fileType = file.type;
      if (this.validateFile(file)) {
        this.changeFile.emit(file);
      }
    }
  }

  setErrorMassage(txtErr: string): void {
    this.errMessage = txtErr;
  }

  validateFile(file): boolean {
    if (this.isRequire && file.name === '') {
      this.setErrorMassage('File đính kèm bắt buộc chọn');
      return false;
    }

    if (file.name.length >= 255) {
      this.setErrorMassage('Tên file quá dài');
      return false;
    }

    const fileExt = file.name.split('.').pop();
    if (
      !this.validType.some(
        (type) => type?.toLowerCase() === fileExt.toLowerCase()
      )
    ) {
      this.setErrorMassage(
        `File không đúng định dạng ${this.validType.join(', ')}`
      );
      return false;
    }

    if (Number(file.size) > Number(this.maxSize)) {
      this.setErrorMassage(`Dung lượng file vượt quá 2MB`);
      return false;
    }

    this.setErrorMassage('');
    return true;
  }

  clear() {
    this.fileName = '';
    this.fileSize = 0;
    this.fileType = '';
    this.errMessage = '';
    this.fileUpload.nativeElement.value = '';
    this.changeFile.emit(null);
    this.clearFile.emit();
  }

  formatBytes(bytes, decimals = 2): string {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  }
}
