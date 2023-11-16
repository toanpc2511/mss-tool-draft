import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-message',
  templateUrl: './form-message.component.html',
  styleUrls: ['./form-message.component.scss']
})
export class FrmMessageComponent implements OnInit {
  text = "";
  title = "Thông báo";
  btnOk = { text: "Ok", class: "lpb-btn-primary" }
  btnCancel = { text: "Cancel", class: "btn-danger" };
  btnError = { text: "Thử lại", class: "btn-red" };
  acceptCancel = false;
  type = ""
  types = ["error", "ok", "cancel", "warning", "confirm"];
  width = "400px";
  hasBtn = true;
  content = "";
  hasContent = false;

  constructor(public dialogRef: MatDialogRef<FrmMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.type) {
      if (this.types.includes(data.type)) {
        this.type = data.type;
      }
    }
    if (data.title) {
      this.title = data.title;
    }
    this.text = data.text;
    if (data.hasBtn !== undefined) {
      this.hasBtn = data.hasBtn
    }

    if (data.btnOk) {
      this.btnOk = data.btnOk
    }
    if (data.btnCancel) {
      this.btnCancel = data.btnCancel;
      this.acceptCancel = true;
    }

    if (this.type === "confirm") {
      if (data.hasContent) {
        this.hasContent = data.hasContent;
        if (this.hasContent && data.content) {
          this.content = data.content;
        }
      }
    }

    if (data.btnError) {
      this.btnError = data.btnError;
    }
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }

  accept() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  cancelConfirm() {
    let dataOutput = { accept: false };
    this.dialogRef.close(dataOutput);
  }

  acceptConfirm() {
    let dataOutput = { accept: true };
    if (this.hasContent) {
      dataOutput["content"] = this.content;
    }
    this.dialogRef.close(dataOutput);
  }
}
