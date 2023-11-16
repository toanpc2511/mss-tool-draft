import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DestroyService} from '../../../shared/services/destroy.service';
import {IError} from '../../../shared/models/error.model';
import {takeUntil} from 'rxjs/operators';
import {URL_FILE_DOWNLOAD, URL_FILE_INFO} from '../shared/constants/url.tuition.service';
import {ISearchFilter} from '../../../shared/models/shared.interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {FileService} from '../../../shared/services/file.service';
import {TuitionService} from '../shared/services/tuition.service';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { MatDialog } from '@angular/material/dialog';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {ActionModel} from '../../../shared/models/ActionModel';
import {FILE_KSV_COLUMNS, STATUS_FILE} from '../shared/constants/tuition.constant';
import {ISchool} from '../shared/models/tuition.interface';
import {
  CustomConfirmDialogComponent
} from "../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component";

@Component({
  selector: 'app-approve-upload-file',
  templateUrl: './approve-upload-file.component.html',
  styleUrls: ['./approve-upload-file.component.scss'],
  providers: [DestroyService]
})
export class ApproveUploadFileComponent implements OnInit {


  formsSearch: FormGroup;
  schools: ISchool [];
  crossStatus = STATUS_FILE;
  message = '';
  columns = FILE_KSV_COLUMNS;
  urlSearch = URL_FILE_INFO; // tuition-service/file
  dataSource: any = [];
  actions: ActionModel[] = [];
  status = 'INIT';
  uniCode = '';
  fileId = '';
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;

  configs = {
    filterDefault: `recordStat|eq|INIT&isActive|eq|ACTIVE`, // filter khoi tao ham search
    defaultSort: 'createdDate:DESC',
    hasSelection: false, // Hien cot chon
    hasNoIndex: true, // hien stt
    hasPaging: true, // hien so trang
    hiddenActionColumn: false, // An cac hanh dong
  };
  searchFiles: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  @ViewChild('modal', {static: true}) modal: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fileService: FileService,
    private tuitionService: TuitionService,
    private matDialog: MatDialog,
    private notify: CustomNotificationService,
    private destroy$: DestroyService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getSchools();
  }

  initForm(): void {
    this.formsSearch = this.fb.group({
      schoolName: [''],
      status: ['INIT']
    });
  }
  getSchools(): void{
    this.tuitionService
      .getListUniversityActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.schools = res.data;
        }
      });
  }

  search(): any {
    this.child?.selection?.clear();
    this.child?.selection?.deselect();
    const valueForm = this.formsSearch.value;
    // Hien hanh dong so voi trang thai
    if (valueForm.status === 'INIT') {
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
    // this.handleAction(valueForm); // cau hinh hanh dong o footer
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
    // this.fileService.downloadFromUrl(url);
    this.fileService.downloadFileMethodGet(url);
    // Link toi 1 trang khác qua url
    // this.router.navigate([`water-service/pay-at-counter/view`], { queryParams: { id: value.id } })
  }

  excuteFile($event): void {
    if (!$event) {
      return;
    }
    this.fileId = $event.id;
    this.matDialog.open(this.modal);
  }

  // Duyet file
  approveFile(): void {
    // this.fileId = $event.id;
    if (!this.fileId) {
      return;
    }
    console.log('approve fileId:', this.fileId);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Duyệt file upload. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.tuitionService.approveFile(this.fileId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.message === 'Fail'
              ? this.notify.error('Thông báo', `Duyệt file thất bại`)
              : this.notify.success('Thông báo', `Duyệt file thành công`);
            this.fileId = null; // update sau khi da tac dong
            this.search(); // reload table
            this.matDialog.closeAll();
          }
        }, (error: IError) => this.checkError(error));
      }
    });
  }

  // Tu choi file
  rejectFile(): void {
    // this.fileId = $event.id;
    if (!this.fileId) {
      return;
    }
    console.log('reject fileId:', this.fileId);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '30%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Từ chối file upload. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.tuitionService.rejectFile(this.fileId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            res.data.message === 'Fail'
              ? this.notify.error('Thông báo', `Từ chối duyệt file thất bại`)
              : this.notify.success('Thông báo', `Từ chối file thành công`);
            this.fileId = null; // update sau khi da tac dong
            this.search(); // reload table
            this.matDialog.closeAll();
          }
        }, (error: IError) => this.checkError(error));
      }
    });
  }

  checkError(error: IError): void {
    if (error.code) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi', 'Vui lòng thử lại sau!');
    }
  }

}
