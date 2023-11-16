import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-send-service',
  templateUrl: './pop-up-send-service.component.html',
  styleUrls: ['./pop-up-send-service.component.css']
})
export class PopUpSendServiceComponent implements OnInit {
  title: any;
  content: any;
  hidden = false;
  note: string;
  submitted: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PopUpSendServiceComponent>
  ) { }

  ngOnInit(): void {
    this.title = 'Xác nhận';
  }

  closeDialog(index: any): void {
    this.submitted = true;
    this.dialogRef.close({ index, note: this.note });
  }

  // validMessage(): boolean {
  //   return this.note !== '' && this.note !== null && this.note !== undefined;
  // }

  // messageValidator(): boolean {
  //   return this.submitted && this.note === '' || this.submitted && this.note == null || this.submitted && this.note === undefined;
  // }

}
