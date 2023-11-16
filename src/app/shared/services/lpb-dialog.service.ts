import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  IDataDialogButtons,
  IFormControl,
  LpbDialogComponent,
} from '../components/lpb-dialog/lpb-dialog.component';

export interface ILpbDialog {
  title: string;
  messages: string[];
  form?: IFormControl[];
  buttons?: IDataDialogButtons;
  catchDismiss?: boolean;
  className?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LpbDialogService {
  dialogRef: any;

  constructor(private dialog: MatDialog) {}

  setDialog(initDialog: MatDialog): void {
    this.dialog = initDialog;
  }

  openDialog(
    { title, messages, form, buttons, catchDismiss, className }: ILpbDialog,
    callback: (result?: any) => void
  ): void {
    if (this.dialogRef) {
      return;
    }

    this.dialogRef = this.dialog.open(LpbDialogComponent, {
      data: {
        title,
        messages,
        buttons,
        form,
        className
      },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef = undefined;
      if (result?.type !== 'dismiss' && result?.type) {
        callback(result);
      } else if (catchDismiss) {
        callback(result);
      }
    });
  }

  closeDialog(): void {
    if (this.dialog) {
      this.dialog.closeAll();
    }
    this.dialogRef = undefined;
    this.dialog = undefined;
  }
}
