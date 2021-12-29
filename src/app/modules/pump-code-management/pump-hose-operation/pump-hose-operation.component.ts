import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pump-hose-operation',
  templateUrl: './pump-hose-operation.component.html',
  styleUrls: ['./pump-hose-operation.component.scss']
})
export class PumpHoseOperationComponent implements OnInit {
  dataSource;

  constructor() {
    this.dataSource = []
  }

  ngOnInit(): void {
  }

}
