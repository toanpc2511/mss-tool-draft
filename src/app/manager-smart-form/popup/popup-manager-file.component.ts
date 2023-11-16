import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-manager-file.component',
  templateUrl: './popup-manager-file.component.html',
  styleUrls: ['./popup-manager-file.component.css']
})
export class PopupManagerFileComponent implements OnInit {
  
    constructor(@Inject(MAT_DIALOG_DATA)public data:any,
    private dialogRef:MatDialogRef<PopupManagerFileComponent>) { }
    ngOnInit() {}

    closeDialog(index:any){
        this.dialogRef.close(index);
    }
}
