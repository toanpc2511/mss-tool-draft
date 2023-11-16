import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  STATUS_SUPPLIER,
  VIETTEL_POST_SUPPLIER_CONFIG_COLUMNS
} from '../../shared/contants/system-constant';
import {LpbDatatableComponent} from '../../../shared/components/lpb-datatable/lpb-datatable.component';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {IError} from "../../shared/models/error.model";
import {
  CustomConfirmDialogComponent
} from "../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DestroyService} from "../../../shared/services/destroy.service";
import {CustomNotificationService} from "../../../shared/services/custom-notification.service";
import {ViettelPostServiceConfigService} from "../viettel-post-service-config.service";

@Component({
  selector: 'app-supplier-config',
  templateUrl: './supplier-config.component.html',
  styleUrls: ['./supplier-config.component.scss'],
  providers: [DestroyService]
})
export class SupplierConfigComponent implements OnInit {
  searchForm: FormGroup;
  statusSupplier = STATUS_SUPPLIER;
  columns: LpbDatatableColumn[] = VIETTEL_POST_SUPPLIER_CONFIG_COLUMNS;

  configs = {
    filterDefault: '',
    defaultSort: 'lastModifiedDate:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hasAddtionButton: true,
    hiddenActionColumn: false,
  };
  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    private destroy$: DestroyService,
    private notifyService: CustomNotificationService,
    private viettelPostServiceConfigService: ViettelPostServiceConfigService
  ) {
    this.initFormSearch();
  }

  ngOnInit(): void {
  }

  initFormSearch(): void {
    this.searchForm = this.fb.group({
      supllierCode: [''],
      status: ['']
    });
  }

  search(): void {
    const conditions = [
      {
        property: 'code',
        operator: 'eq',
        value: this.searchForm.value.supllierCode,
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
    this.router.navigate(['/system-config/viettel-post-service/viettel-post-config/update'], {queryParams: {id: value.id}});
  }

  onViewDetail(value: any): void {
    console.log('detail', value.id);
    this.router.navigate(['/system-config/viettel-post-service/viettel-post-config/detail'], {queryParams: {id: value.id}});
  }

  changeStatus($event): void {
    console.log('ID status', $event.id);
    console.log('Status', $event.isActive);
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Trạng thái nhà trường sẽ chuyển sang '${$event.isActive === 'ACTIVE' ? 'Dừng hoạt động' : 'Hoạt động'}'. Bạn có muốn tiếp tục ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = {
          isActive: $event.isActive === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
        console.log('body', body);
        this.viettelPostServiceConfigService
          .changeStatusSupplier(body, $event.id)
          .subscribe((res) => {
            if (res.meta.code === 'viettel-post-service-00-200') {
              this.search();
              this.notifyService.success('Thành công', 'Cập nhật trạng thái nhà trường thành công');
            }
          }, (error: IError) => this.notifyService.error('Lỗi', error.message));
      }
    });
  }
}
