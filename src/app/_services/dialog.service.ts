import { Injectable } from '@angular/core';
import { DialogComponent } from '../manager-menu-tree/_dialog/dialog.component';
// import {DialogComponent} from '../_dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  registeredDialog: DialogComponent;
  constructor(dialog: DialogComponent) {
    this.registeredDialog = dialog
  }

  show() {
    return new Promise<void>((resolve, reject) => {

      this.registeredDialog.show();
      this.registeredDialog.onOk.subscribe(() => {
        this.registeredDialog.hide();
        resolve();
      });
      this.registeredDialog.onCancel.subscribe(() => {
        this.registeredDialog.hide();
        reject();
      });

    });
  }
}
