import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { InventoryManagementService } from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { BaseComponent } from '../../../../shared/components/base/base.component';

@Component({
  selector: 'app-create-export-inventory',
  templateUrl: './create-export-inventory.component.html',
  styleUrls: ['./create-export-inventory.component.scss']
})
export class CreateExportInventoryComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private subheader: SubheaderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private inventoryManagementService: InventoryManagementService,
    private destroy$: DestroyService
    ) {
    super();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý kho',
          linkText: 'Quản lý kho',
          linkPath: 'kho'
        },
        {
          title: 'Xuất kho',
          linkText: 'Xuất kho',
          linkPath: 'kho/xuat-kho'
        },
        {
          title: 'Tạo phiếu xuất kho',
          linkText: 'Tạo phiếu xuất kho',
          linkPath: null
        }
      ]);
    }, 1);
  }

}
