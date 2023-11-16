import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ISchool} from '../shared/models/tuition.interface';
import {TuitionService} from '../shared/services/tuition.service';
import {FILE_KSV_COLUMNS, STATUS_FILE} from '../shared/constants/tuition.constant';
import {URL_FILE_DOWNLOAD, URL_FILE_INFO} from '../shared/constants/url.tuition.service';
import {FileService} from '../../../shared/services/file.service';
import {FormMessageComponent} from '../../lpb-water-service/shared/components/form-message/form-message.component';
import {HandleErrorService} from '../../../shared/services/handleError.service';
import {MatDialog} from '@angular/material/dialog';
import {IError} from '../../../shared/models/error.model';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../shared/services/destroy.service';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {ISearchFilter} from '../../../shared/models/shared.interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-file-upload',
  templateUrl: './list-file-upload.component.html',
  styleUrls: ['./list-file-upload.component.scss'],
  providers: [DestroyService]
})
export class ListFileUploadComponent implements OnInit {
  formsSearch: FormGroup;
  schools: ISchool [];
  crossStatus = STATUS_FILE;
  columns = FILE_KSV_COLUMNS;
  urlSearch = URL_FILE_INFO;
  fileId = '';
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  configs = {
    filterDefault: `recordStat|eq|INIT&isActive|eq|ACTIVE`,
    defaultSort: 'createdDate:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false,
    hasAddtionButton: true,
  };
  searchFiles: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  constructor(
    private fb: FormBuilder,
    private tuitionService: TuitionService,
    private fileService: FileService,
    private handleErrorService: HandleErrorService,
    private matDialog: MatDialog,
    private notify: CustomNotificationService,
    private destroy$: DestroyService,
    private router: Router,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getSchools();
  }

  initForm(): void {
    this.formsSearch = this.fb.group({
      schoolName: [''],
      status: ['']
    });
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
  onCreate(): void {
    // Link toi 1 trang khác qua url
    this.router.navigate(['tuition-service/list-file-upload/upload-file']);
  }
  search(): any {
    this.child?.selection?.clear();
    this.child?.selection?.deselect();
    if (this.formsSearch.value.status === 'INIT') {
      this.configs = {
        ...this.configs,
        hasNoIndex: true,
        hasSelection: false,
        hiddenActionColumn: false
      };
    } else {
      this.configs = {
        ...this.configs,
        hasNoIndex: true,
        hasSelection: false,
        hiddenActionColumn: true
      };
    }
    this.child?.search(this.handleFilter());
  }
  handleFilter(): ISearchFilter[] {
    const valueForm = this.formsSearch.value;
    const searchCondition: ISearchFilter[] = [
      {
        property: 'recordStat',
        operator: 'eq',
        value: valueForm.status,
      },
      {
        property: 'uniCode',
        operator: 'eq',
        value: valueForm.schoolName,
      },
      {
        property: 'isActive',
        operator: 'eq',
        value: 'ACTIVE',
      },
    ];
    console.log('handleFilter:', searchCondition);
    return searchCondition;
  }
  // Tai file upload
  downloadFile($event): void {
    if (!$event) {
      return;
    }
    console.log('IdFile:', $event.id);
    const url = `${URL_FILE_DOWNLOAD}/${$event.id}`;
    this.fileService.downloadFileMethodGet(url);
  }
  cancelFile(row): void {
    if (row.recordStat !== 'INIT') {
      this.handleErrorService.openMessageError('Không được xóa file ở trạng thái đã duyệt/từ chối !');
      return;
    }
    const message = 'Bạn có chắc chắn muốn xóa file này ?';
    const dialog = this.matDialog.open(FormMessageComponent, {
      data: {
        type: 'cancel',
        text: message,
        title: 'Xác nhận',
        btnOk: {text: 'Xác nhận', class: 'btn-danger'},
        btnCancel: {text: 'Quay lại', class: 'btn-secondary'}
      }, hasBackdrop: true, disableClose: true, backdropClass: 'bg-none'
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.deleteRow(row);
      }
    });
  }

  deleteRow($event): void {
    if (!$event.id) {
      return;
    }
    this.fileId = $event.id;
    console.log('delete fileId:', this.fileId);
    this.tuitionService.cancelFile(this.fileId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        res.data.message === 'Fail'
          ? this.notify.error('Thông báo', `Xóa file thất bại`)
          : this.notify.success('Thông báo', `Xóa file thành công`);
        this.fileId = null; // update sau khi da tac dong
        this.search(); // reload table
      }
    }, (error: IError) => this.checkError(error));
    this.matDialog.closeAll();
  }
  checkError(error: IError): void {
    if (error.code) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi', 'Vui lòng thử lại sau!');
    }
  }
}
