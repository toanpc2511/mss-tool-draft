import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls: ['./custom-confirm-dialog.component.scss'],
})
export class CustomConfirmDialogComponent implements OnInit {
  reasonControl = new FormControl('', Validators.required);

  constructor(
    public dialogRef: MatDialogRef<CustomConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataConfirmDialog
  ) {}
  ngOnInit(): void {}

  onConfirm(): void {
    this.reasonControl.markAllAsTouched();
    if (this.reasonControl.invalid && this.data?.isReject) return;
    this.dialogRef.close(this.data?.isReject ? this.reasonControl.value : true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

export interface IDataConfirmDialog {
  title: string;
  message: string;
  isReject?: boolean;
  type?: 'success' | 'warning' | 'error';
}
