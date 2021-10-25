import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-revenue',
  templateUrl: './total-revenue.component.html',
  styleUrls: ['./total-revenue.component.scss']
})
export class TotalRevenueComponent implements OnInit {
  listTotalRevenue;
  revenue = 34567890000;
  total = 10000;

  constructor() {
    this.listTotalRevenue = [
      {
        productName: 'abc',
        unit: 'Chiếc',
        quantity: 567890100,
        revenue: 4567000
      },
      {
        productName: '56789iuythjaff dfdss ',
        unit: 'Lon',
        quantity: 234234200,
        revenue: 77000
      },
      {
        productName: 'weqweqf erwer ',
        unit: 'Chiếc',
        quantity: 32000,
        revenue: 4567000
      }
    ]
  }

  ngOnInit(): void {
  }

}
