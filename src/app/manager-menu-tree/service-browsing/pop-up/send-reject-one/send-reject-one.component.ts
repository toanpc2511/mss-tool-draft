import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-send-reject-one',
  templateUrl: './send-reject-one.component.html',
  styleUrls: ['./send-reject-one.component.css']
})
export class SendRejectOneComponent implements OnInit {
  title: any;
  content: any;
  hidden = false;
  note: string;
  submitted: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SendRejectOneComponent>
  ) { }
  ngOnInit(): void {
    this.title = 'Xác nhận';
  }

  closeDialog(index: any): void {
    this.submitted = true;
    this.dialogRef.close({ index, note: this.note });
  }

  exitDialog(index: any): void {
    this.dialogRef.close(index);
  }

  validMessage(): boolean {
    return this.note !== '' && this.note !== null && this.note !== undefined;
  }

  messageValidator(): boolean {
    return this.submitted && this.note === '' || this.submitted && this.note == null || this.submitted && this.note === undefined;
  }
}
