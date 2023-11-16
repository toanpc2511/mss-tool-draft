import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormMessageComponent } from '../components/form-message/form-message.component';

@Injectable({ providedIn: 'root' })
export class HandleErrorService {

    constructor(public matdialog: MatDialog,) { }

    handleError(err) {
        let message = "Lỗi hệ thống !";
        if (!err) {
            this.openMessageError(message);
            return
        }
        if (err.errors) {
            message = "";
            for (const error of err.errors) {
                message += `${error.field} - ${error.description} \n`
            }
        } else {
            if (err.message) {
                message = err.message
            }
        }
        this.openMessageError(message);
    }

    openMessageError(message: string) {
        if (this.matdialog.openDialogs.length >= 1) {
            return;
        }

        const dialog = this.matdialog.open(FormMessageComponent, {
            data: { type: "error", text: message, title: "Lỗi", btnError: { text: "Thử lại" }, style: "" }, backdropClass: "bg-none", position: { top: "0px", right: "0px" }
        })

        dialog.afterClosed().subscribe(res => {
        })
    }
}