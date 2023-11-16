import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-system-add-right',
  templateUrl: './popup-system-add-right.component.html',
  styleUrls: ['./popup-system-add-right.component.scss']
})
export class PopupSystemAddRightComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA)public data:any,
    private dialogRef:MatDialogRef<PopupSystemAddRightComponent>) { }
    ngOnInit() {}

    closeDialog(index:any){
        this.dialogRef.close(index);
    }
}
