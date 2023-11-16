import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-electric-detail-register-info',
  templateUrl: './electric-detail-register-info.component.html',
  styleUrls: ['./electric-detail-register-info.component.scss']
})
export class ElectricDetailRegisterInfoComponent implements OnInit {
  @Input() rootData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
