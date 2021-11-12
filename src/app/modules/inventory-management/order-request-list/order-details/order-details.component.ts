import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InventoryManagementService } from '../../inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { ProductService } from '../../../product/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_STATUS_ORDER_REQUEST } from '../../../../shared/data-enum/list-status';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderRequestId: number;
  listStatus = LIST_STATUS_ORDER_REQUEST;
  dataSource;

  constructor(
    private inventoryManagementService: InventoryManagementService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res) => {
      this.orderRequestId = res.id;
    });

    this.getDetailOrderRequest();
  }

  getDetailOrderRequest() {
    this.inventoryManagementService.viewDetailOrderRequest(this.orderRequestId)
      .subscribe((res) => {
        this.dataSource = res.data;
        this.cdr.detectChanges();
      })
  }

  onClose() {
    this.router.navigate([`/kho/yeu-cau-dat-hang`]);
  }

}
