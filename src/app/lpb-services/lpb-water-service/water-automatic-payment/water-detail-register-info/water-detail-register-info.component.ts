import { Component, OnInit, Input } from '@angular/core';
import { IAutoPayment } from '../../shared/models/water.interface';

@Component({
  selector: 'app-water-detail-register-info',
  templateUrl: './water-detail-register-info.component.html',
  styleUrls: ['./water-detail-register-info.component.scss']
})

export class WaterDetailRegisterInfoComponent implements OnInit {
  @Input() rootData: IAutoPayment;
  constructor() { }

  ngOnInit(): void {
  }
}
