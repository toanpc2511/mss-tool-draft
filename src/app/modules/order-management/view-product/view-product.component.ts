import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-view-product',
	templateUrl: './view-product.component.html',
	styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
	@Input() data: any[];
	totalAmout: string;
	constructor() {}

	ngOnInit(): void {
		let total = 0;
		this.data.forEach((prod) => {
			total += Number(prod.price) * prod.quantity;
		});
		this.totalAmout = total.toLocaleString('en-US');
	}
}
