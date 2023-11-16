import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ELECTRIC_SUPPLIER_COLUMNS, STATUS_SUPPLIER} from '../../shared/contants/system-constant';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {DestroyService} from '../../../shared/services/destroy.service';
import {
  CustomConfirmDialogComponent
} from '../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {IError} from '../../shared/models/error.model';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {Router} from '@angular/router';
import {ElectricServiceConfigService} from '../electric-service-config.service';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-supplier-config',
  templateUrl: './supplier-config.component.html',
  styleUrls: ['./supplier-config.component.scss'],
  providers: [DestroyService],
})
export class SupplierConfigComponent implements OnInit {
  searchForm: FormGroup;
  columns: LpbDatatableColumn[] = ELECTRIC_SUPPLIER_COLUMNS;
  configs = {
    filterDefault: '',
    defaultSort: 'status:ASC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false,
  };
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  statusSuppliers = STATUS_SUPPLIER;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private electricServiceConfigService: ElectricServiceConfigService,
    private notifyService: CustomNotificationService,
    private destroy$: DestroyService,
    private matdialog: MatDialog,
    private router: Router
  ) {
    this.initFormSearch();
  }

  initFormSearch(): void {
    this.searchForm = this.fb.group({
      provider: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Cấu hình dịch vụ',
      'Dịch vụ điện',
      'Danh sách nhà cung cấp',
    ]);
    this.search();
  }

  search(): void {
    const conditions = [
      {
        property: 'supplierCode',
        operator: 'ol',
        value: this.searchForm.value.provider,
      },
      {
        property: 'supplierName',
        operator: 'ol',
        value: this.searchForm.value.provider,
      },
      {
        property: 'status',
        operator: 'eq',
        value: this.searchForm.value.status,
      },
    ];
    this.child?.search(conditions);
  }

  clearSelect(control: string): void {
    this.searchForm.get(control).patchValue('');
  }

  onCreate(): void {
    this.router.navigate(['system-config/electric-service/supplier-config/create']);
  }

  onUpdate(value: any): void {
    this.router.navigate(['system-config/electric-service/supplier-config/update'], {queryParams: {id: value.id}});
  }

  onViewDetail(value: any): void {
    this.router.navigate(['/system-config/electric-service/supplier-config/detail'], {queryParams: {id: value.id}});
  }

  changeStatus($event): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Trạng thái nhà cung cấp sẽ chuyển sang '${$event.statusCode === 'ACTIVE' ? 'Dừng hoạt động' : 'Hoạt động'}'. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = {
          status: $event.statusCode === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
        this.electricServiceConfigService
          .changeStatusSupplier(body, $event.id)
          .subscribe((res) => {
            if (res.meta.code === 'uni01-00-200'){
              this.search();
              this.notifyService.success('Thành công', 'Cập nhật trạng thái  nhà cung cấp thành công');
            }
          }, (error: IError) => this.checkError(error));
      }
    });
  }

  checkError(error: IError): void {
    if (error.message) {
      this.notifyService.error('Lỗi', error.message);
    } else {
      this.notifyService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
    }
    console.log(error);
  }
}
