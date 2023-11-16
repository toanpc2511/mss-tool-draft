import { DialogComponent } from './dialog.component';

export class DialogService {

  registeredDialog: DialogComponent;

  register(dialog: DialogComponent) {
    this.registeredDialog = dialog;
  }

  show() {
    return new Promise((resolve, reject) => {
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
