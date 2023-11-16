import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';

@Component({
  selector: 'app-currency-rate-reject',
  templateUrl: './currency-rate-reject.component.html',
  styleUrls: ['./currency-rate-reject.component.scss']
})
export class CurrencyRateRejectComponent implements OnInit {
  FormHelpers = FormHelpers;
  reason: FormControl = new FormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<CurrencyRateRejectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

  }

  onCloseDialog(index): void {
    this.reason.markAllAsTouched();
    if (index === 0 || (this.reason.valid)) {
      this.dialogRef.close({
        reason: this.reason.value,
        index
      });
    }
  }

}
