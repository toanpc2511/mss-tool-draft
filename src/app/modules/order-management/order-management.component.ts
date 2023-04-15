import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
	selector: 'app-order-management',
	templateUrl: './order-management.component.html',
	styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
	orders: any[];

	constructor(private sharedService: SharedService, private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.getListOrder();
	}

	getListOrder(): void {
		const params = {};
		this.sharedService.getListOrder(params).subscribe((res) => {
			if (res.data) {
				this.orders = res.data;
				this.cdr.detectChanges();
			}
		});
	}
}
