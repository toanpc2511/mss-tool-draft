import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ACCOUNTING_STATUS } from '../../shared/constants/water.constant';
import { ITranPostResponse } from '../../shared/models/water.interface';


@Component({
  selector: 'app-water-bill-detail',
  templateUrl: './water-bill-detail.component.html',
  styleUrls: ['./water-bill-detail.component.scss'],
})
export class WaterBillDetailComponent implements OnInit {

  //
  dataSource: ITranPostResponse[] = [];

  accountingStatus = ACCOUNTING_STATUS;

  
  constructor(public dialogRef: MatDialogRef<WaterBillDetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    //console.log(this.data)
    if (this.data["data"]) {
      this.dataSource = this.data["data"];
    }
  }

  close() {
    this.dialogRef.close();
  }

}
