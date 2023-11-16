import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-lpb-upload-file-single',
  templateUrl: './lpb-upload-file-single.component.html',
  styleUrls: ['./lpb-upload-file-single.component.scss']
})
export class LpbUploadFileSingleComponent implements OnInit {
  /* Hiện tại xử lý cho file và output base64
  * */
  @Input() isRequire = false;
  @Input() maxSize = 500;
  @Output() changeFile = new EventEmitter<any>();
  @Output() clearFile = new EventEmitter<any>();
  @ViewChild('fileUpload') fileUpload: ElementRef;
  fileName = '';
  fileSize = 0;
  fileType = '';
  errMessage = '';
  constructor() { }

  ngOnInit(): void {
  }

  handleFileInput(evt): void {
    if (evt.target.files.length > 0) {
      const file = evt.target.files[0];
      this.fileName = file.name;
      this.fileSize = file.size;
      this.fileType = file.type;
      if (this.validateFile()) {
        this.changeFile.emit(file);
      }
    }
  }

  setErrorMassage(txtErr: string): void {
    this.errMessage = txtErr;
  }

  validateFile(): boolean {
    if (this.isRequire && this.fileName === '') {
      this.setErrorMassage('File đính kèm bắt buộc chọn');
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
    this.fileUpload.nativeElement().value = '';
    this.changeFile.emit(null);
  }
}

