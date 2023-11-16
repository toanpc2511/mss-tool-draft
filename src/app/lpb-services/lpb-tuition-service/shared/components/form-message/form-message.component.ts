import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-message',
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss']
})
export class FormMessageComponent implements OnInit {
  text = "";
  title = "Thông báo";
  btnOk = {text: "Ok", class: "lpb-btn-primary"}
  btnCancel = {text: "Cancel", class: "btn-danger"};
  btnError = {text: "Thử lại", class: "btn-red"};
  acceptCancel = false;
  type = ""
  types = ["error", "ok", "cancel"];
  width = "400px";

  constructor(public dialogRef: MatDialogRef<FormMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.type) {
      if (this.types.includes(data.type)) {
        this.type = data.type;
      }      
    }
    if (data.title) {
      this.title = data.title;
    }
    this.text = data.text;
    if (data.btnOk) {
      this.btnOk = data.btnOk
    }
    if (data.btnCancel) {
      this.btnCancel = data.btnCancel;
      this.acceptCancel = true;
    }
    if (data.btnError) {
      this.btnError = data.btnError;      
    }
  }

  ngOnInit() {

  }

  close(){        
    this.dialogRef.close();
  }

  accept(){    
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }
}
