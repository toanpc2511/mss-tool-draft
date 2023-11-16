import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-close',
  templateUrl: './popup-close.component.html',
  styleUrls: ['./popup-close.component.css']
})
export class PopupCloseComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data:any,
  private dialogRef:MatDialogRef<PopupCloseComponent>) { }

  ngOnInit(): void {
  }
  closeDialog(index:any){
    this.dialogRef.close(index);
}
  
}
