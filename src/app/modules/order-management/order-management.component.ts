import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { statusOrders } from 'src/app/shared/data-enum/enums';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ViewProductComponent } from './view-product/view-product.component';

@Component({
	selector: 'app-order-management',
	templateUrl: './order-management.component.html',
	styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
	orders: any[];
	orderStatus = statusOrders;

	constructor(
		private sharedService: SharedService,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal
	) {}

	ngOnInit(): void {
		this.getListOrder();
	}

	getListOrder(): void {
		const params = {};
		this.sharedService.getListOrder(params).subscribe((res) => {
			if (res.data) {
				this.orders = res.data.map((item) => ({
					...item,
					totalAmount: this.handleAmount(item?.orderProducts),
					products: item.orderProducts.map((prod) => ({
						...prod.product,
						quantity: prod.quantity
					}))
				}));

				this.cdr.detectChanges();
			}
		});
	}

	handleAmount(orderProducts: any[]): string {
		let totalAmount = 0;
		orderProducts.map((item) => {
			totalAmount += Number(item.price) * item.quantity;
		});
		return `${totalAmount.toLocaleString('en-US')} vnđ`;
	}

	viewDetail(order: any): void {
		const modalRef = this.modalService.open(ViewProductComponent, {
			centered: true,
			size: 'xl'
		});
		modalRef.componentInstance.data = order.products;
	}
}
