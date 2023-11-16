import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface IButton {
  display: boolean;
  label?: string;
  color?: string;
  bgColor?: string;
}
interface IButtons {
  confirm: IButton;
  dismiss: IButton;
}
@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss'],
})
export class CardDialogComponent implements OnInit {
  title: string;
  messages: string[];
  buttons: IButtons;
  constructor(
    public dialogRef: MatDialogRef<CardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDataConfirmDialog
  ) {}
  ngOnInit(): void {
    this.title = this.data?.title;
    this.messages = this.data?.messages;
    this.buttons = this.data?.buttons;
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  confirmDialog(): void {
    this.dialogRef.close(true);
  }
}

export class IDataConfirmDialog {
  constructor(
    public title: string,
    public messages: string[],
    public buttons?: IButtons
  ) {}
}
