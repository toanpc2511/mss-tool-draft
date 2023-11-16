import {Component, OnInit, ViewChild} from '@angular/core';
import {DestroyService} from '../../../shared/services/destroy.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {STATUS_SUPPLIER, STATUS_UNIVERSITY, UNIVERSITY_CONFIG_COLUMNS} from '../../shared/contants/system-constant';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {TuitionServiceConfigService} from '../tuition-service-config.service';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {UniversityModalComponent} from './university-modal/university-modal.component';
import {IError} from '../../shared/models/error.model';
import {
  CustomConfirmDialogComponent
} from '../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {ISchool} from '../../../lpb-services/lpb-tuition-service/shared/models/tuition.interface';

@Component({
  selector: 'app-university-config',
  templateUrl: './university-config.component.html',
  styleUrls: ['./university-config.component.scss'],
  providers: [DestroyService]
})
export class UniversityConfigComponent implements OnInit {
  searchForm: FormGroup;
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  statusUniversity = STATUS_SUPPLIER;
  columns: LpbDatatableColumn[] = UNIVERSITY_CONFIG_COLUMNS;
  university: ISchool [];
  configs = {
    filterDefault: '',
    defaultSort: 'lastModifiedDate:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hasAddtionButton: true,
    hiddenActionColumn: false,
  };

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    private destroy$: DestroyService,
    private notifyService: CustomNotificationService,
    private tuitionService: TuitionServiceConfigService,
  ) {
    this.initFormSearch();
  }

  ngOnInit(): void {
    this.getSchools();
  }

  initFormSearch(): void {
    this.searchForm = this.fb.group({
      university: [''],
      status: [''],
    });
  }
  getSchools(): void {
    this.tuitionService
      .getListUniversityActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.university = res.data;
        }
      });
  }
  showSupplierModal(value: any, action?: string): void {
    const dialogRef = this.matDialog.open(UniversityModalComponent, {
      width: '60%',
      closeOnNavigation: true,
      hasBackdrop: true,
      disableClose: true,
      data: {
        id: value.id,
        action,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.search();
    });
    // Link toi 1 trang khác qua url
    // this.router.navigate([`water-service/pay-at-counter/view`], { queryParams: { id: value.id } })

  }

  onCreate(): void {
    // Link toi 1 trang khác qua url
    this.router.navigate(['system-config/tuition-service/university-config/create']);
  }

  search(): void {
    const conditions = [
      {
        property: 'code',
        operator: 'eq',
        value: this.searchForm.value.university,
      },
      {
        property: 'isActive',
        operator: 'eq',
        value: this.searchForm.value.status,
      },
    ];
    this.child?.search(conditions);
  }

  clearSelect(control: string): void {
    this.searchForm.get(control).patchValue('');
  }

  resetForm(): void {
    this.initFormSearch();
  }

  onUpdate(value: any): void {
    console.log('update', value.id);
    this.router.navigate(['system-config/tuition-service/university-config/update'], {queryParams: {id: value.id}});
  }

  onViewDetail(value: any): void {
    console.log('detail', value.id);
    this.router.navigate(['system-config/tuition-service/university-config/detail'], {queryParams: {id: value.id}});
  }

  checkError(error: IError): void {
    if (error.message) {
      this.notifyService.error('Lỗi', error.message);
    } else {
      this.notifyService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
    }
    console.log(error);
  }

  changeStatus($event): void {
    console.log('ID status', $event.id);
    console.log('Status', $event.statusCode);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Trạng thái nhà trường sẽ chuyển sang '${$event.statusCode === 'ACTIVE' ? 'Dừng hoạt động' : 'Hoạt động'}'. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = {
          isActive: $event.statusCode === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
        console.log('body', body);
        this.tuitionService
          .changeStatusUniversity(body, $event.id)
          .subscribe((res) => {
            if (res.meta.code === 'uni01-00-200') {
              this.search();
              this.notifyService.success('Thành công', 'Cập nhật trạng thái nhà trường thành công');
            }
          }, (error: IError) => this.checkError(error));
      }
    });
  }
}
