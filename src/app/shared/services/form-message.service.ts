import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FrmMessageComponent } from '../components/form-message/form-message.component';

@Injectable({ providedIn: 'root' })
export class FormMessageService {
    constructor(public matdialog: MatDialog) { }

    async openMessageError(message: string = "Lỗi hệ thống !", title = "Lỗi", textError = "Thử lại") {
        if (this.matdialog.openDialogs.length >= 1) {
            return;
        }

        const dialog = this.matdialog.open(FrmMessageComponent, {
            data: { type: "error", text: message, title: title, btnError: { text: textError } }, backdropClass: "bg-none", position: { top: "0px", right: "0px" }
        })

        await dialog.afterClosed().toPromise().then(res => {
        })
    }

    async openMessageSuccess(message, title = "Thành công", btnOk = null, timeout = 3000) {
        const hasBtn = btnOk ? true : false;
        const dialog = this.matdialog.open(FrmMessageComponent, {
            data: { type: "ok", text: message, title, hasBtn, btnOk }, position: { top: "0px", right: "0px" }
        })
        if (timeout) {
            dialog.afterOpened().subscribe(_ => {
                setTimeout(() => {
                    dialog.close();
                }, timeout);
            })
        }
        let data;
        await dialog.afterClosed().toPromise().then(res => {
            data = res;
        })
        return data;
    }

    async confirm(title, message, btnOk, btnCancel, hasContent = false) {
        const dialog = this.matdialog.open(FrmMessageComponent, {
            data: {
                type: 'confirm',
                text: message,
                title,
                hasContent,
                btnOk,
                btnCancel
            }, hasBackdrop: true, disableClose: true, backdropClass: 'bg-none'
        });
        let data
        await dialog.afterClosed().toPromise().then(res => {
            data = res;
        });
        return data;
    }

    openMessageWarning(message: string) {
        if (this.matdialog.openDialogs.length >= 1) {
            return;
        }

        const dialog = this.matdialog.open(FrmMessageComponent, {
            data: { type: "warning", text: message }, backdropClass: "bg-none", position: { top: "0px", right: "0px" }
        })

        dialog.afterClosed().subscribe(res => {
        })
    }

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
}