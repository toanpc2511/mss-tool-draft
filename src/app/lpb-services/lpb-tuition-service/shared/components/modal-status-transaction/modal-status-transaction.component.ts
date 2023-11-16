import { TuitionService } from '../../services/tuition.service';
 //import { TuitionBillDetailComponent } from './../../../water-payment-at-counter/water-bill-detail/water-bill-detail.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-status-transaction',
  templateUrl: './modal-status-transaction.component.html',
  styleUrls: ['./modal-status-transaction.component.scss'],
})
export class ModalStatusTransactionComponent implements OnInit {
  transactions: any[];
  constructor(
    private matdialog: MatDialog,
    private waterService: TuitionService,
    public dialogRef: MatDialogRef<ModalStatusTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transactions = this.data;
  }

  ngOnInit(): void {}

  onCloseModal() {
    this.dialogRef.close(false);
  }

  // showDetailTransModal(id: string) {
  //   this.waterService.getDetailTransaction(id).subscribe((res) => {
  //     if (res.data) {
  //       this.matdialog.open(WaterBillDetailComponent, {
  //         data: { data: res.data.tranPostResponses },
  //         hasBackdrop: true,
  //         disableClose: true,
  //         width: '100%',
  //         maxWidth: '100%',
  //       });
  //     }
  //   });
  // }
}
