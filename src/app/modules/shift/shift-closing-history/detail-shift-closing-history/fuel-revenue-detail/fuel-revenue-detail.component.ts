import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateStation } from '../../../../gas-station/gas-station.service';

@Component({
  selector: 'app-fuel-revenue-detail',
  templateUrl: './fuel-revenue-detail.component.html',
  styleUrls: ['./fuel-revenue-detail.component.scss']
})
export class FuelRevenueDetailComponent implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  @Input() step1Data: CreateStation;

  constructor() { }

  ngOnInit(): void {
  }

}
