import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-customer-passport-reject',
  templateUrl: './customer-passport-reject.component.html',
  styleUrls: ['./customer-passport-reject.component.scss']
})
export class CustomerPassportRejectComponent implements OnInit {

  reason: FormControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<CustomerPassportRejectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

  }

  onCloseDialog(index): void {

    this.dialogRef.close({
      reason: this.reason.value,
      index
    });
  }
}
