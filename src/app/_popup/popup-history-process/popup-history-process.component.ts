import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-history-process',
  templateUrl: './popup-history-process.component.html',
  styleUrls: ['./popup-history-process.component.scss']
})
export class PopupHistoryProcessComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data: any,
              private dialogRef: MatDialogRef<PopupHistoryProcessComponent>) { }

  ngOnInit(): void {
  }
  closeDialog(): void{
    this.dialogRef.close();
  }
}
