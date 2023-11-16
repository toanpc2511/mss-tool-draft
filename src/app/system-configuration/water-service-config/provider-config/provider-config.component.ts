import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { SUPPLIER_COLUMNS } from '../../shared/contants/system-constant';
import { DestroyService } from '../../../shared/services/destroy.service';
import { CustomNotificationService } from '../../../shared/services/custom-notification.service';
import { WaterServiceConfigService } from '../water-service-config.service';
import { STATUS_SUPPLIER } from '../../shared/contants/system-constant';
import { ISupplier } from '../../shared/models/lvbis-config.interface';
import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { SupplierModalComponent } from './supplier-modal/supplier-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss'],
  providers: [DestroyService],
})
export class ProviderConfigComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  actions: any[] = [];
  columns = SUPPLIER_COLUMNS;
  configs = {
    filterDefault: '',
    defaultSort: 'lastModifiedDate:DESC',
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
    private waterServiceConfigService: WaterServiceConfigService,
    private notifyService: CustomNotificationService,
    private destroy$: DestroyService,
    private matDialog: MatDialog
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
    $('.parentName').html('Dịch vụ nước');
    $('.childName').html('Danh sách nhà cung cấp');
    this.search();
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
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

  resetForm(): void {
    this.initFormSearch();
  }

  clearSelect(control: string) {
    this.searchForm.get(control).patchValue('');
  }

  showSupplierModal(value: any, action?: string): void {
    const dialogRef = this.dialog.open(SupplierModalComponent, {
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
  }

  changeStatus($event): void {
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Trạng thái nhà cung cấp sẽ chuyển sang '${$event.statusCode === 'ACTIVE' ? 'Dừng hoạt động' : 'Hoạt động'}'. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = {
          status: $event.statusCode === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
        this.waterServiceConfigService
          .changeStatusSupplier(body, $event.id)
          .subscribe((res) => {
            if (res.meta.code === 'uni01-00-200'){
              this.search();
              this.notifyService.success('Thông báo', 'Chuyển trạng thái thành công');
            }
          }, (error: IError) => this.checkError(error));
      }
    });
  }

  checkError(error: IError): void {
    console.log(error);
    switch (error.code) {
      case 'uni01-4034':
        break;

      default:
        this.notifyService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
        break;
    }
  }
}
